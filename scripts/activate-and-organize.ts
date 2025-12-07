/**
 * Activate Products & Organize Collections
 *
 * This script will:
 * 1. Identify products that need merging (same product, different sizes)
 * 2. Filter out weak products (keep in DRAFT)
 * 3. Activate strong products
 * 4. Ensure navbar collections have products
 *
 * Run with: npx tsx scripts/activate-and-organize.ts
 */

import { config } from 'dotenv';
import * as fs from 'fs';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Collections referenced in navbar mega menu
const NAVBAR_COLLECTIONS = [
  // Dogs - Food
  'canine-dry-food',
  'canine-wet-food',
  'canine-dehydrated-goods',
  'organic-canine-food',
  // Dogs - Supplements
  'organic-canine-supplements-hip-and-joint',
  'organic-supplements',
  // Cats - Food
  'feline-dry-foods',
  'feline-dehydrated-goods',
  'feline-freeze-dried-goods',
  // Cats - Supplements
  'calm-feline-supplements',
  'feline-supplements-hip-joint',
  'feline-dental-supplements',
  'feline-digestive-supplements',
  // General
  'frontpage'
];

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} - ${text}`);
  }

  const json = await response.json();
  if (json.errors) {
    console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  productType: string;
  vendor: string;
  tags: string[];
  totalInventory: number;
  priceRangeV2: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage: { url: string; altText: string | null } | null;
  variants: { edges: { node: { id: string; title: string; sku: string; price: string } }[] };
  collections: { edges: { node: { id: string; title: string; handle: string } }[] };
}

// Determine if a product is "weak" and should stay in draft
function isWeakProduct(product: Product): boolean {
  const reasons: string[] = [];

  // No description or very short
  if (!product.description || product.description.length < 50) {
    reasons.push('Description missing or too short');
  }

  // No featured image
  if (!product.featuredImage || !product.featuredImage.url) {
    reasons.push('No featured image');
  }

  // No inventory
  if (product.totalInventory === 0) {
    reasons.push('Zero inventory');
  }

  // Price is $0 or invalid
  const price = parseFloat(product.priceRangeV2?.minVariantPrice?.amount || '0');
  if (price === 0) {
    reasons.push('Invalid price ($0)');
  }

  // Discontinued vendor
  if (product.vendor?.toLowerCase() === 'discontinued') {
    reasons.push('Discontinued vendor');
  }

  // Has "test" or "sample" in title
  if (product.title?.toLowerCase().includes('test') || product.title?.toLowerCase().includes('sample')) {
    reasons.push('Test/Sample product');
  }

  if (reasons.length > 0) {
    return true;
  }

  return false;
}

// Identify products that are the same but with different sizes
function identifyMergeGroups(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>();

  products.forEach(product => {
    // Extract base name without size indicators
    let baseName = product.title
      .replace(/\d+\s*(ct|oz|lb|g|kg|ml|Count|Ounce|Pound)/gi, '') // Remove size with units
      .replace(/\s+-\s+\d+\s*(ct|oz|lb)/gi, '') // Remove " - 30 ct" patterns
      .replace(/\(.*?\)/g, '') // Remove anything in parentheses
      .replace(/\s+/g, ' ')
      .trim();

    const key = `${baseName}|${product.vendor}`.toLowerCase();

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(product);
  });

  // Filter to only groups with multiple products
  const mergeGroups = new Map<string, Product[]>();
  groups.forEach((products, key) => {
    if (products.length > 1) {
      mergeGroups.set(key, products);
    }
  });

  return mergeGroups;
}

async function activateProduct(productId: string): Promise<boolean> {
  try {
    const mutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const result = await adminFetch<any>(mutation, {
      input: {
        id: productId,
        status: 'ACTIVE'
      }
    });

    if (result.productUpdate.userErrors.length > 0) {
      console.error(`   ❌ Error: ${result.productUpdate.userErrors[0].message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Failed: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Product Activation & Organization\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}\n`);

  const executeMode = process.argv.includes('--execute');

  // Load cached data
  let data: any;
  try {
    const cached = fs.readFileSync('scripts/shopify-data.json', 'utf-8');
    data = JSON.parse(cached);
    console.log(`✅ Loaded ${data.products.length} products from cache\n`);
  } catch {
    console.error('❌ Could not load cached data. Please run fetch-shopify-data.ts first.');
    process.exit(1);
  }

  const products: Product[] = data.products;
  const collections = data.collections;

  console.log('═'.repeat(60));
  console.log('STEP 1: IDENTIFY MERGE CANDIDATES');
  console.log('═'.repeat(60) + '\n');

  const mergeGroups = identifyMergeGroups(products);
  console.log(`Found ${mergeGroups.size} product groups that could be merged:\n`);

  let mergeCount = 0;
  mergeGroups.forEach((group, key) => {
    const [baseName, vendor] = key.split('|');
    console.log(`📦 ${baseName} (${vendor})`);
    group.forEach(p => {
      const size = p.title.replace(baseName, '').trim();
      console.log(`   - ${p.title} (${p.status}) - ${size || 'default'}`);
    });
    console.log('');
    mergeCount += group.length;
  });

  console.log(`Total products in merge groups: ${mergeCount}`);
  console.log(`\n⚠️  Note: Merging will be done separately. This script will activate products.\n`);

  console.log('═'.repeat(60));
  console.log('STEP 2: IDENTIFY WEAK PRODUCTS');
  console.log('═'.repeat(60) + '\n');

  const weakProducts = products.filter(p => p.status === 'DRAFT' && isWeakProduct(p));
  const strongDraftProducts = products.filter(p => p.status === 'DRAFT' && !isWeakProduct(p));

  console.log(`🔴 Weak products (will stay DRAFT): ${weakProducts.length}`);
  weakProducts.slice(0, 10).forEach(p => {
    console.log(`   - ${p.title} (${p.vendor})`);
  });
  if (weakProducts.length > 10) {
    console.log(`   ... and ${weakProducts.length - 10} more`);
  }

  console.log(`\n✅ Strong products (ready to activate): ${strongDraftProducts.length}`);
  strongDraftProducts.slice(0, 10).forEach(p => {
    console.log(`   - ${p.title} (${p.vendor}) - $${p.priceRangeV2.minVariantPrice.amount}`);
  });
  if (strongDraftProducts.length > 10) {
    console.log(`   ... and ${strongDraftProducts.length - 10} more`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('STEP 3: CHECK NAVBAR COLLECTIONS');
  console.log('═'.repeat(60) + '\n');

  const collectionStatus = NAVBAR_COLLECTIONS.map(handle => {
    const collection = collections.find((c: any) => c.handle === handle);
    const productCount = collection?.productsCount?.count || 0;
    return { handle, found: !!collection, productCount, collection };
  });

  collectionStatus.forEach(({ handle, found, productCount }) => {
    const status = !found ? '❌ NOT FOUND' : productCount === 0 ? '⚠️  EMPTY' : `✅ ${productCount} products`;
    console.log(`${status.padEnd(20)} ${handle}`);
  });

  console.log('\n' + '═'.repeat(60));
  console.log('STEP 4: ACTIVATION PLAN');
  console.log('═'.repeat(60) + '\n');

  console.log(`📊 Current Status:`);
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Active: ${products.filter(p => p.status === 'ACTIVE').length}`);
  console.log(`   Draft (Weak): ${weakProducts.length}`);
  console.log(`   Draft (Strong): ${strongDraftProducts.length}`);
  console.log(``);
  console.log(`📈 After Activation:`);
  console.log(`   Active: ${products.filter(p => p.status === 'ACTIVE').length + strongDraftProducts.length}`);
  console.log(`   Draft: ${weakProducts.length}`);
  console.log(``);

  // Ask for confirmation
  console.log('⚠️  READY TO ACTIVATE PRODUCTS');
  console.log(`   This will activate ${strongDraftProducts.length} products`);
  console.log(`   Weak products (${weakProducts.length}) will remain in DRAFT`);
  console.log('');

  // Save activation plan for review
  const activationPlan = {
    timestamp: new Date().toISOString(),
    toActivate: strongDraftProducts.map(p => ({
      id: p.id,
      title: p.title,
      vendor: p.vendor,
      price: p.priceRangeV2.minVariantPrice.amount,
      inventory: p.totalInventory,
      collections: p.collections.edges.map(e => e.node.handle)
    })),
    stayingDraft: weakProducts.map(p => ({
      id: p.id,
      title: p.title,
      vendor: p.vendor,
      reason: 'Weak product - missing data or discontinued'
    })),
    mergeGroups: Array.from(mergeGroups.entries()).map(([key, prods]) => ({
      baseName: key.split('|')[0],
      vendor: key.split('|')[1],
      products: prods.map(p => ({ id: p.id, title: p.title }))
    })),
    navbarCollections: collectionStatus
  };

  fs.writeFileSync('scripts/activation-plan.json', JSON.stringify(activationPlan, null, 2));
  console.log('✅ Activation plan saved to scripts/activation-plan.json');
  console.log('');

  if (!executeMode) {
    console.log('📝 Review the plan and run with --execute flag to proceed:');
    console.log('   npx tsx scripts/activate-and-organize.ts --execute');
    return;
  }

  // EXECUTE MODE
  console.log('═'.repeat(60));
  console.log('EXECUTING ACTIVATION');
  console.log('═'.repeat(60) + '\n');

  let successCount = 0;
  let failCount = 0;

  console.log(`Activating ${strongDraftProducts.length} products...\n`);

  for (let i = 0; i < strongDraftProducts.length; i++) {
    const product = strongDraftProducts[i];
    const progress = `[${i + 1}/${strongDraftProducts.length}]`;

    process.stdout.write(`${progress} ${product.title.substring(0, 50).padEnd(50)} ... `);

    const success = await activateProduct(product.id);

    if (success) {
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }

    // Rate limiting - pause every 10 requests
    if ((i + 1) % 10 === 0) {
      console.log(`   (Pausing for rate limit...)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('ACTIVATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`✅ Successfully activated: ${successCount} products`);
  console.log(`❌ Failed: ${failCount} products`);
  console.log(`📊 Total now active: ${19 + successCount} products`);
  console.log(`📋 Remaining draft: ${weakProducts.length} (weak products)`);
  console.log('');
  console.log('🎉 Done! Your store is ready for action.');
  console.log('');
  console.log('Next steps:');
  console.log('   1. Review activated products in Shopify Admin');
  console.log('   2. Run merge-products script to combine size variants');
  console.log('   3. Add products to feline-freeze-dried-goods collection (currently empty)');
  console.log('   4. Test the storefront to ensure everything displays correctly');
}

main().catch(console.error);
