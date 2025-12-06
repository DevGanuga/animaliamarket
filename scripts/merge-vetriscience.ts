/**
 * Merge VetriScience Products - Fixed for 2025-01 API
 * 
 * Run with: npx tsx scripts/merge-vetriscience.ts
 * Execute: npx tsx scripts/merge-vetriscience.ts --execute
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
    console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
  }
  
  return json.data;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  status: string;
  totalInventory: number;
  options: { id: string; name: string; values: string[] }[];
  variants: { 
    edges: { 
      node: { 
        id: string; 
        title: string;
        sku: string;
        price: string;
        compareAtPrice: string | null;
        inventoryQuantity: number;
      } 
    }[] 
  };
}

// Get a single product by handle
async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await adminFetch<{ productByHandle: Product | null }>(`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        status
        totalInventory
        options { id name values }
        variants(first: 10) {
          edges {
            node { id title sku price compareAtPrice inventoryQuantity }
          }
        }
      }
    }
  `, { handle });
  
  return data.productByHandle;
}

// Merge Strategy: For products with "Default Title" variants, we can add new variants
async function mergeIntoProduct(
  primaryHandle: string,
  newTitle: string,
  productsToMerge: { handle: string; variantLabel: string }[],
  optionName: string,
  dryRun: boolean
): Promise<void> {
  console.log(`\n📦 Merging products into: ${newTitle}`);
  
  // Fetch all products
  const primary = await getProductByHandle(primaryHandle);
  if (!primary) {
    console.log(`   ❌ Primary product not found: ${primaryHandle}`);
    return;
  }
  
  const otherProducts: { product: Product; variantLabel: string }[] = [];
  for (const toMerge of productsToMerge) {
    if (toMerge.handle === primaryHandle) continue;
    const prod = await getProductByHandle(toMerge.handle);
    if (prod) {
      otherProducts.push({ product: prod, variantLabel: toMerge.variantLabel });
    } else {
      console.log(`   ⚠️ Product not found: ${toMerge.handle}`);
    }
  }
  
  const primaryVariantLabel = productsToMerge.find(p => p.handle === primaryHandle)?.variantLabel || "Default";
  
  console.log(`   Primary: ${primary.title} → "${primaryVariantLabel}"`);
  for (const p of otherProducts) {
    console.log(`   + Merge: ${p.product.title} → "${p.variantLabel}"`);
  }
  
  if (dryRun) {
    console.log(`   [DRY RUN] Would create ${optionName} variants: ${[primaryVariantLabel, ...otherProducts.map(p => p.variantLabel)].join(', ')}`);
    return;
  }
  
  // === EXECUTE ===
  
  // Step 1: Update product title if needed
  if (primary.title !== newTitle) {
    console.log(`   Step 1: Updating title to "${newTitle}"...`);
    await adminFetch(`
      mutation UpdateProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id title }
          userErrors { field message }
        }
      }
    `, { input: { id: primary.id, title: newTitle } });
    console.log(`   ✓ Title updated`);
  } else {
    console.log(`   Step 1: Title already correct`);
  }
  
  // Step 2: Create new variants using bulk create
  console.log(`   Step 2: Creating variants...`);
  
  // First, rename the option from "Title" to the desired name
  const optionId = primary.options[0]?.id;
  if (optionId) {
    await adminFetch(`
      mutation UpdateOption($productId: ID!, $option: OptionUpdateInput!) {
        productOptionUpdate(productId: $productId, option: $option) {
          product { id }
          userErrors { field message }
        }
      }
    `, {
      productId: primary.id,
      option: { id: optionId, name: optionName }
    });
    console.log(`   ✓ Option renamed to "${optionName}"`);
  }
  
  // Update the existing variant to have the correct option value
  const existingVariant = primary.variants.edges[0]?.node;
  if (existingVariant) {
    const updateResult = await adminFetch<{
      productVariantsBulkUpdate: {
        productVariants: { id: string; title: string }[] | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(`
      mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants { id title }
          userErrors { field message }
        }
      }
    `, {
      productId: primary.id,
      variants: [{
        id: existingVariant.id,
        optionValues: [{ optionName: optionName, name: primaryVariantLabel }],
      }]
    });
    
    if (updateResult.productVariantsBulkUpdate.userErrors.length > 0) {
      console.log(`   ⚠️ Error updating variant: ${updateResult.productVariantsBulkUpdate.userErrors[0].message}`);
    } else {
      console.log(`   ✓ Primary variant updated to "${primaryVariantLabel}"`);
    }
  }
  
  // Create variants for other products
  for (const p of otherProducts) {
    const variant = p.product.variants.edges[0]?.node;
    if (!variant) continue;
    
    console.log(`   Creating variant: ${p.variantLabel}...`);
    
    const createResult = await adminFetch<{
      productVariantsBulkCreate: {
        productVariants: { id: string }[] | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(`
      mutation CreateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variants) {
          productVariants { id }
          userErrors { field message }
        }
      }
    `, {
      productId: primary.id,
      variants: [{
        optionValues: [{ optionName: optionName, name: p.variantLabel }],
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        inventoryItem: { sku: variant.sku },
      }]
    });
    
    if (createResult.productVariantsBulkCreate.userErrors.length > 0) {
      console.log(`   ⚠️ Error: ${createResult.productVariantsBulkCreate.userErrors[0].message}`);
    } else {
      console.log(`   ✓ Created variant: ${p.variantLabel}`);
    }
  }
  
  // Step 3: Archive other products
  console.log(`   Step 3: Archiving merged products...`);
  for (const p of otherProducts) {
    await adminFetch(`
      mutation ArchiveProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id status }
          userErrors { field message }
        }
      }
    `, { input: { id: p.product.id, status: 'ARCHIVED' } });
    console.log(`   ✓ Archived: ${p.product.title}`);
  }
  
  console.log(`   ✅ Merge complete!`);
}

async function main() {
  console.log('🧪 VetriScience Product Merge Tool (Fixed)\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  
  const dryRun = !process.argv.includes('--execute');
  
  if (dryRun) {
    console.log('\n📋 DRY RUN MODE - No changes will be made');
    console.log('   Run with --execute to actually merge products\n');
  } else {
    console.log('\n⚠️  EXECUTE MODE - Changes will be made!\n');
  }
  
  // === MERGE GROUP 1: Dog Glycoflex Regular (60ct + 120ct) ===
  await mergeIntoProduct(
    'vetri-science-dog-glycoflex-60ct',
    'VetriScience Dog GlycoFlex Plus Joint Support',
    [
      { handle: 'vetri-science-dog-glycoflex-60ct', variantLabel: '60 Count' },
      { handle: 'vetriscience-dog-glycoflex-120ct', variantLabel: '120 Count' },
    ],
    'Count',
    dryRun
  );
  
  // === MERGE GROUP 2: Dog Glycoflex Flavored ===
  await mergeIntoProduct(
    'vetriscience-dog-glycoflex-bacon-45ct',
    'VetriScience Dog GlycoFlex Plus Flavored Chews 45ct',
    [
      { handle: 'vetriscience-dog-glycoflex-bacon-45ct', variantLabel: 'Bacon' },
      { handle: 'vetriscience-dog-glycoflex-duck-45ct', variantLabel: 'Duck' },
      { handle: 'vetriscience-dog-glycoflex-pb-45ct', variantLabel: 'Peanut Butter' },
    ],
    'Flavor',
    dryRun
  );
  
  // === MERGE GROUP 3: Dog Composure Flavored ===
  await mergeIntoProduct(
    'vetriscience-dog-composure-bacon-5-64-oz',
    'VetriScience Dog Composure Calming Chews',
    [
      { handle: 'vetriscience-dog-composure-bacon-5-64-oz', variantLabel: 'Bacon' },
      { handle: 'vetriscience-dog-composure-chicken-4-76-oz', variantLabel: 'Chicken' },
      { handle: 'vetriscience-dog-composure-peanut-butter-5-64-oz', variantLabel: 'Peanut Butter' },
      { handle: 'vetriscience-dog-composure-5-64-oz', variantLabel: 'Original' },
    ],
    'Flavor',
    dryRun
  );
  
  console.log('\n' + '═'.repeat(60));
  
  if (dryRun) {
    console.log('\n💡 To execute, run: npx tsx scripts/merge-vetriscience.ts --execute');
  } else {
    console.log('\n✅ All merges complete!');
  }
}

main().catch(console.error);
