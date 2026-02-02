/**
 * Activate ALL Products
 * 
 * This script will activate ALL draft products - no filtering.
 * Per user request: "we can keep all of them"
 *
 * Run with: npx tsx scripts/activate-all-products.ts
 * 
 * Add --execute flag to actually make changes:
 *   npx tsx scripts/activate-all-products.ts --execute
 */

import { config } from 'dotenv';
import * as fs from 'fs';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Shopify Admin API error: ${response.status} - ${text}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`GraphQL Error: ${json.errors[0]?.message}`);
    }
    return json.data;
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out - store may be unreachable');
    }
    throw error;
  }
}

async function testConnection(): Promise<boolean> {
  console.log('🔌 Testing Shopify connection...\n');
  console.log(`   Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`   API Version: ${SHOPIFY_API_VERSION}\n`);

  try {
    const result = await adminFetch<{ shop: { name: string } }>(`
      query {
        shop {
          name
        }
      }
    `);
    console.log(`   ✅ Connected to: ${result.shop.name}\n`);
    return true;
  } catch (error: any) {
    console.log(`   ❌ Connection failed: ${error.message}\n`);
    return false;
  }
}

async function getAllProducts(): Promise<any[]> {
  console.log('📦 Fetching all products...\n');
  
  const allProducts: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              status
              vendor
              totalInventory
              featuredImage { url }
            }
          }
        }
      }
    `;

    const result = await adminFetch<any>(query, { 
      first: 250,
      after: cursor 
    });

    const products = result.products.edges.map((e: any) => e.node);
    allProducts.push(...products);

    hasNextPage = result.products.pageInfo.hasNextPage;
    cursor = result.products.pageInfo.endCursor;

    process.stdout.write(`   Fetched ${allProducts.length} products...\r`);
  }

  console.log(`   ✅ Total products: ${allProducts.length}\n`);
  return allProducts;
}

async function activateProduct(productId: string): Promise<boolean> {
  try {
    const result = await adminFetch<any>(`
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id status }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: productId,
        status: 'ACTIVE'
      }
    });

    if (result.productUpdate.userErrors.length > 0) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 ANIMALIA - ACTIVATE ALL PRODUCTS');
  console.log('═'.repeat(60) + '\n');

  const executeMode = process.argv.includes('--execute');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot proceed - store is not accessible.\n');
    console.log('Please check:');
    console.log('   1. Store is not paused in Shopify Admin');
    console.log('   2. Store is not password-protected');
    console.log('   3. API tokens are valid in .env.local');
    console.log('   4. Network connection is working\n');
    process.exit(1);
  }

  // Get all products
  const products = await getAllProducts();

  const activeProducts = products.filter(p => p.status === 'ACTIVE');
  const draftProducts = products.filter(p => p.status === 'DRAFT');
  const archivedProducts = products.filter(p => p.status === 'ARCHIVED');

  console.log('📊 Current Status:');
  console.log(`   Active:   ${activeProducts.length}`);
  console.log(`   Draft:    ${draftProducts.length}`);
  console.log(`   Archived: ${archivedProducts.length}`);
  console.log(`   Total:    ${products.length}\n`);

  if (draftProducts.length === 0) {
    console.log('✅ All products are already active! Nothing to do.\n');
    return;
  }

  // Group draft products by vendor for visibility
  const byVendor: Record<string, any[]> = {};
  draftProducts.forEach(p => {
    const vendor = p.vendor || 'Unknown';
    if (!byVendor[vendor]) byVendor[vendor] = [];
    byVendor[vendor].push(p);
  });

  console.log('📋 Draft Products by Vendor:');
  Object.entries(byVendor)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15)
    .forEach(([vendor, prods]) => {
      console.log(`   ${vendor}: ${prods.length} products`);
    });
  if (Object.keys(byVendor).length > 15) {
    console.log(`   ... and ${Object.keys(byVendor).length - 15} more vendors`);
  }
  console.log('');

  if (!executeMode) {
    console.log('═'.repeat(60));
    console.log('📝 DRY RUN - No changes made');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`This would activate ${draftProducts.length} products.`);
    console.log('');
    console.log('To execute, run:');
    console.log('   npx tsx scripts/activate-all-products.ts --execute');
    console.log('');
    return;
  }

  // EXECUTE MODE
  console.log('═'.repeat(60));
  console.log('⚡ EXECUTING - Activating all draft products');
  console.log('═'.repeat(60) + '\n');

  let successCount = 0;
  let failCount = 0;
  const failed: any[] = [];

  for (let i = 0; i < draftProducts.length; i++) {
    const product = draftProducts[i];
    const progress = `[${i + 1}/${draftProducts.length}]`;
    const shortTitle = product.title.substring(0, 45).padEnd(45);

    process.stdout.write(`${progress} ${shortTitle} `);

    const success = await activateProduct(product.id);

    if (success) {
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
      failed.push(product);
    }

    // Rate limiting - pause every 10 requests
    if ((i + 1) % 10 === 0 && i + 1 < draftProducts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 ACTIVATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`   ✅ Successfully activated: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📊 Total now active: ${activeProducts.length + successCount}`);
  console.log('');

  if (failed.length > 0) {
    console.log('Failed products:');
    failed.forEach(p => console.log(`   - ${p.title}`));
    console.log('');
  }

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    previouslyActive: activeProducts.length,
    activated: successCount,
    failed: failCount,
    totalActive: activeProducts.length + successCount,
    failedProducts: failed.map(p => ({ id: p.id, title: p.title, vendor: p.vendor }))
  };

  fs.writeFileSync('scripts/activation-results.json', JSON.stringify(results, null, 2));
  console.log('📁 Results saved to scripts/activation-results.json\n');

  console.log('Next steps:');
  console.log('   1. Visit your store and verify products are visible');
  console.log('   2. Run: npm run dev');
  console.log('   3. Check http://localhost:3000\n');
}

main().catch(console.error);
