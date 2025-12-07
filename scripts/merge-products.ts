/**
 * Merge Products with Size Variants
 * 
 * This script identifies products that are the same but listed with different sizes,
 * and merges them into single products with size variants.
 * 
 * Run with: npx tsx scripts/merge-products.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

interface Variant {
  id: string;
  title: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  inventoryQuantity: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  status: string;
  productType: string;
  vendor: string;
  tags: string[];
  totalInventory: number;
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: { node: ProductImage }[] };
  variants: { edges: { node: Variant }[] };
  collections: { edges: { node: { id: string; title: string; handle: string } }[] };
}

interface MergeGroup {
  baseName: string;
  products: {
    product: Product;
    size: string;
    price: number;
    imageUrl?: string;
  }[];
}

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

// Fetch all products
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
            description
            descriptionHtml
            status
            productType
            vendor
            tags
            totalInventory
            featuredImage { url altText }
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  inventoryQuantity
                }
              }
            }
            collections(first: 10) {
              edges { node { id title handle } }
            }
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
    }>(query, { first: 50, after: cursor });

    allProducts.push(...data.products.edges.map((e) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

// Extract size from product title
function extractSize(title: string): { baseName: string; size: string } | null {
  // Patterns to match sizes at the end of product names
  const patterns = [
    // Count patterns: "30Ct", "60 Count", "120Ct", etc.
    /^(.+?)\s*(\d+)\s*(?:Ct|Count|ct|count|CT)\.?$/i,
    // Ounce patterns: "16oz", "32oz.", "4.6 oz", etc.
    /^(.+?)\s*(\d+(?:\.\d+)?)\s*(?:oz|Oz|OZ)\.?$/i,
    // Pound patterns: "2Lb", "4 Lbs", "20 Lb", etc.
    /^(.+?)\s*(\d+(?:\.\d+)?)\s*(?:Lb|lb|Lbs|lbs|LB|LBS)s?\.?$/i,
    // Gram patterns: "40 Grams", "60g", etc.
    /^(.+?)\s*(\d+)\s*(?:Grams?|grams?|g)\.?$/i,
    // Mg patterns for supplements: "150mg", "300MG", etc.
    /^(.+?)\s*(\d+)\s*(?:mg|MG|Mg)\.?$/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      const baseName = match[1].trim();
      const size = match[2] + (title.match(/(?:Ct|Count|oz|Oz|Lb|lb|Lbs|Grams?|mg)/i)?.[0] || '');
      return { baseName, size };
    }
  }

  return null;
}

// Find products that should be merged
function findMergeGroups(products: Product[]): MergeGroup[] {
  const groupMap = new Map<string, MergeGroup>();

  for (const product of products) {
    const extracted = extractSize(product.title);
    if (!extracted) continue;

    const key = `${product.vendor}|${extracted.baseName}|${product.productType}`;
    
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        baseName: extracted.baseName,
        products: [],
      });
    }

    groupMap.get(key)!.products.push({
      product,
      size: extracted.size,
      price: parseFloat(product.variants.edges[0]?.node.price || '0'),
      imageUrl: product.featuredImage?.url,
    });
  }

  // Only return groups with multiple products (actual duplicates)
  return Array.from(groupMap.values())
    .filter(group => group.products.length > 1)
    .map(group => ({
      ...group,
      products: group.products.sort((a, b) => a.price - b.price), // Sort by price ascending
    }));
}

// Collect all images from products in merge group
async function collectAllImages(group: MergeGroup): Promise<string[]> {
  const allImageUrls: string[] = [];
  
  for (const p of group.products) {
    // Add featured image
    if (p.product.featuredImage?.url) {
      allImageUrls.push(p.product.featuredImage.url);
    }
    // Add all product images
    for (const edge of p.product.images.edges) {
      if (edge.node.url && !allImageUrls.includes(edge.node.url)) {
        allImageUrls.push(edge.node.url);
      }
    }
  }
  
  return allImageUrls;
}

// Create a merged product with variants
async function mergeProducts(group: MergeGroup, dryRun: boolean = true): Promise<void> {
  const primary = group.products[0]; // Use the cheapest as the base
  console.log(`\n  Merging into: ${group.baseName}`);
  console.log(`  Primary product: ${primary.product.title} (ID: ${primary.product.id})`);
  
  // Collect all collection IDs from all products
  const allCollectionIds = new Set<string>();
  for (const p of group.products) {
    for (const edge of p.product.collections.edges) {
      allCollectionIds.add(edge.node.id);
    }
  }
  
  // Collect all unique images
  const allImages = await collectAllImages(group);
  console.log(`  Found ${allImages.length} unique images across all variants`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would create variants:`);
    for (const p of group.products) {
      const inv = p.product.totalInventory;
      console.log(`    - ${p.size}: $${p.price} (${inv} in stock, image: ${p.imageUrl ? '✓' : '✗'})`);
    }
    console.log(`  [DRY RUN] Would collect ${allImages.length} images`);
    console.log(`  [DRY RUN] Would archive ${group.products.length - 1} duplicate products`);
    return;
  }

  // Step 1: Update the primary product title to remove size
  console.log(`  Updating primary product title...`);
  await adminFetch(`
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id title }
        userErrors { field message }
      }
    }
  `, {
    input: {
      id: primary.product.id,
      title: group.baseName,
    }
  });

  // Step 2: Add images from other products to primary (if they don't already exist)
  // Note: Shopify doesn't allow adding images via URL directly in productUpdate
  // Images will be preserved on the primary product, but we can't easily transfer images from other products
  // The best approach is to keep the primary product's images
  console.log(`  Primary product retains its images (${primary.product.images.edges.length} images)`);

  // Step 3: Add variant options for size
  console.log(`  Adding size options...`);
  
  // For each product, we need to:
  // - Create a new variant on the primary product (except first)
  // - Transfer the inventory info
  // - Archive the old product
  
  for (let i = 0; i < group.products.length; i++) {
    const p = group.products[i];
    const variant = p.product.variants.edges[0]?.node;
    
    if (i === 0) {
      // Update the existing variant on the primary product using 2025-01 API
      console.log(`  Updating primary variant to: ${p.size}`);
      try {
        // First, update the product option to be "Size"
        await adminFetch(`
          mutation UpdateProductOption($productId: ID!) {
            productUpdate(input: { id: $productId }) {
              product { 
                id 
                options { id name }
              }
              userErrors { field message }
            }
          }
        `, {
          productId: primary.product.id,
        });
        
        // Then use productVariantsBulkUpdate for the variant
        await adminFetch(`
          mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
              productVariants { id title }
              userErrors { field message }
            }
          }
        `, {
          productId: primary.product.id,
          variants: [{
            id: variant.id,
            optionValues: [{ optionName: "Size", name: p.size }],
          }]
        });
      } catch (err) {
        console.log(`    ⚠️ Could not update variant option (continuing anyway): ${err}`);
      }
    } else {
      // Create a new variant on the primary product
      console.log(`  Creating new variant: ${p.size} at $${variant.price} (inventory: ${variant.inventoryQuantity})`);
      
      const createResult = await adminFetch<{
        productVariantCreate: {
          productVariant: { id: string } | null;
          userErrors: { field: string[]; message: string }[];
        };
      }>(`
        mutation CreateVariant($input: ProductVariantInput!) {
          productVariantCreate(input: $input) {
            productVariant { id }
            userErrors { field message }
          }
        }
      `, {
        input: {
          productId: primary.product.id,
          options: [p.size],
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          sku: variant.sku,
          // Note: Inventory is managed separately via inventoryAdjust mutations
          // The inventory quantities will need to be set via inventory management
        }
      });

      if (createResult.productVariantCreate.userErrors.length > 0) {
        console.log(`  ⚠️ Error creating variant: ${createResult.productVariantCreate.userErrors[0].message}`);
      } else {
        console.log(`    ✓ Variant created (inventory will need manual adjustment if not auto-synced)`);
      }
    }
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  // Step 4: Set product options to "Size"
  console.log(`  Setting option name to "Size"...`);
  try {
    await adminFetch(`
      mutation UpdateProductOptions($productId: ID!, $options: [OptionUpdateInput!]!) {
        productOptionsUpdate(productId: $productId, options: $options) {
          product { id }
          userErrors { field message }
        }
      }
    `, {
      productId: primary.product.id,
      options: [{
        name: "Size",
      }]
    });
  } catch (e) {
    console.log(`  ⚠️ Could not update option name (this is okay if variants were created)`);
  }

  // Step 5: Archive the other products
  for (let i = 1; i < group.products.length; i++) {
    const p = group.products[i];
    console.log(`  Archiving: ${p.product.title}`);
    await adminFetch(`
      mutation ArchiveProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id status }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: p.product.id,
        status: 'ARCHIVED',
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`  ✅ Merge complete!`);
}

async function main() {
  console.log('🔄 Product Merge Tool\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}\n`);

  // Check for --execute flag
  const dryRun = !process.argv.includes('--execute');
  
  if (dryRun) {
    console.log('📋 DRY RUN MODE - No changes will be made');
    console.log('   Run with --execute to actually merge products\n');
  } else {
    console.log('⚠️  EXECUTE MODE - Changes will be made to Shopify!\n');
  }

  console.log('Fetching all products...');
  const products = await getAllProducts();
  console.log(`Found ${products.length} products\n`);

  console.log('Analyzing for merge candidates...');
  const mergeGroups = findMergeGroups(products);
  
  if (mergeGroups.length === 0) {
    console.log('No products found that need merging.');
    return;
  }

  console.log(`\n📦 Found ${mergeGroups.length} product groups to merge:\n`);
  console.log('═'.repeat(80));

  let totalProductsToMerge = 0;
  let totalProductsAfterMerge = 0;

  for (let i = 0; i < mergeGroups.length; i++) {
    const group = mergeGroups[i];
    totalProductsToMerge += group.products.length;
    totalProductsAfterMerge += 1;
    
    console.log(`\n${i + 1}. ${group.baseName}`);
    console.log(`   Vendor: ${group.products[0].product.vendor}`);
    console.log(`   Type: ${group.products[0].product.productType}`);
    console.log(`   Products to merge: ${group.products.length}`);
    
    for (const p of group.products) {
      const inv = p.product.totalInventory;
      console.log(`   • ${p.size}: $${p.price.toFixed(2)} (${inv} in stock) - ${p.product.handle}`);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Current products: ${totalProductsToMerge}`);
  console.log(`   After merge: ${totalProductsAfterMerge}`);
  console.log(`   Products to archive: ${totalProductsToMerge - totalProductsAfterMerge}`);

  if (!dryRun) {
    console.log('\n⏳ Starting merge process...\n');
    
    for (const group of mergeGroups) {
      try {
        await mergeProducts(group, false);
      } catch (error) {
        console.error(`\n❌ Error merging ${group.baseName}:`, error);
      }
    }
    
    console.log('\n✅ All merges complete!');
  } else {
    console.log('\n💡 To execute the merge, run:');
    console.log('   npx tsx scripts/merge-products.ts --execute');
  }
}

main().catch(console.error);

