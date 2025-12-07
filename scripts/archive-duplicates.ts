/**
 * Archive Duplicate Products
 * 
 * This script identifies products that have already had their base name cleaned up
 * and archives the remaining duplicate entries (the ones with sizes still in titles).
 * 
 * Run with: npx tsx scripts/archive-duplicates.ts
 * Execute with: npx tsx scripts/archive-duplicates.ts --execute
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
  }
  
  return json.data;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  status: string;
  vendor: string;
}

// Size patterns to detect in titles
const SIZE_PATTERNS = [
  /\d+\s*(?:Ct|Count|ct|count|CT)\.?$/i,
  /\d+(?:\.\d+)?\s*(?:oz|Oz|OZ)\.?$/i,
  /\d+(?:\.\d+)?\s*(?:Lb|lb|Lbs|lbs|LB|LBS)s?\.?$/i,
  /\d+\s*(?:Grams?|grams?|g)\.?$/i,
];

function hasSize(title: string): boolean {
  return SIZE_PATTERNS.some(pattern => pattern.test(title));
}

function getBaseName(title: string): string {
  let base = title;
  for (const pattern of SIZE_PATTERNS) {
    base = base.replace(pattern, '').trim();
  }
  return base;
}

async function getAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            handle
            status
            vendor
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  while (hasNextPage) {
    const data = await adminFetch<{
      products: {
        edges: { node: Product; cursor: string }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>(query, { first: 100, after: cursor });

    allProducts.push(...data.products.edges.map((e) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

async function archiveProduct(product: Product): Promise<boolean> {
  try {
    await adminFetch(`
      mutation ArchiveProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id status }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: product.id,
        status: 'ARCHIVED',
      }
    });
    return true;
  } catch (err) {
    console.error(`    Failed to archive: ${err}`);
    return false;
  }
}

async function main() {
  console.log('🗃️  Archive Duplicate Products\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}\n`);

  const dryRun = !process.argv.includes('--execute');
  
  if (dryRun) {
    console.log('📋 DRY RUN MODE - No changes will be made');
    console.log('   Run with --execute to actually archive products\n');
  } else {
    console.log('⚠️  EXECUTE MODE - Products will be archived!\n');
  }

  console.log('Fetching all products...');
  const products = await getAllProducts();
  console.log(`Found ${products.length} products\n`);

  // Group products by base name + vendor
  const productGroups = new Map<string, Product[]>();
  
  for (const product of products) {
    if (product.status === 'ARCHIVED') continue;
    
    const baseName = getBaseName(product.title);
    const key = `${product.vendor}|${baseName}`;
    
    if (!productGroups.has(key)) {
      productGroups.set(key, []);
    }
    productGroups.get(key)!.push(product);
  }

  // Find groups where we have both:
  // 1. A "clean" product (no size in title)
  // 2. Products with sizes in titles (duplicates to archive)
  const toArchive: Product[] = [];
  
  for (const [key, group] of productGroups) {
    if (group.length < 2) continue;
    
    const cleanProducts = group.filter(p => !hasSize(p.title));
    const sizedProducts = group.filter(p => hasSize(p.title));
    
    // Only archive if we have a clean version AND sized duplicates
    if (cleanProducts.length > 0 && sizedProducts.length > 0) {
      console.log(`\n📦 ${cleanProducts[0].title} (${cleanProducts[0].vendor})`);
      console.log(`   ✓ Clean version exists: ${cleanProducts[0].handle}`);
      
      for (const sized of sizedProducts) {
        console.log(`   ✗ Duplicate to archive: ${sized.title}`);
        toArchive.push(sized);
      }
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Products to archive: ${toArchive.length}`);

  if (toArchive.length === 0) {
    console.log('\n✅ No duplicate products to archive!');
    return;
  }

  if (!dryRun) {
    console.log('\n⏳ Archiving products...\n');
    
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < toArchive.length; i++) {
      const product = toArchive[i];
      process.stdout.write(`[${i + 1}/${toArchive.length}] ${product.title.substring(0, 50).padEnd(50)} ... `);
      
      if (await archiveProduct(product)) {
        console.log('✅');
        success++;
      } else {
        console.log('❌');
        failed++;
      }
      
      // Rate limit
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n✅ Archived: ${success}`);
    console.log(`❌ Failed: ${failed}`);
  } else {
    console.log('\n💡 To archive these duplicates, run:');
    console.log('   npx tsx scripts/archive-duplicates.ts --execute');
  }
}

main().catch(console.error);

