/**
 * Script to fetch all products and collections from Shopify Admin API
 * Run with: npx tsx scripts/fetch-shopify-data.ts
 */

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

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} - ${text}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

async function getAllProducts() {
  const allProducts: any[] = [];
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
            status
            productType
            vendor
            tags
            totalInventory
            priceRangeV2 {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  inventoryQuantity
                }
              }
            }
            collections(first: 5) {
              edges {
                node { id title handle }
              }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  while (hasNextPage) {
    const data = await adminFetch<any>(query, { first: 50, after: cursor });
    allProducts.push(...data.products.edges.map((e: any) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

async function getAllCollections() {
  const allCollections: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
    query GetCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            image { url altText }
            productsCount { count }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  while (hasNextPage) {
    const data = await adminFetch<any>(query, { first: 50, after: cursor });
    allCollections.push(...data.collections.edges.map((e: any) => e.node));
    hasNextPage = data.collections.pageInfo.hasNextPage;
    cursor = data.collections.pageInfo.endCursor;
  }

  return allCollections;
}

async function main() {
  console.log('🔌 Connecting to Shopify Admin API...');
  console.log(`   Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`   API Version: ${SHOPIFY_API_VERSION}\n`);

  try {
    // Fetch products
    console.log('📦 Fetching products...');
    const products = await getAllProducts();
    console.log(`   Found ${products.length} products\n`);

    // Fetch collections
    console.log('📁 Fetching collections...');
    const collections = await getAllCollections();
    console.log(`   Found ${collections.length} collections\n`);

    // Output summary
    console.log('═'.repeat(60));
    console.log('COLLECTIONS');
    console.log('═'.repeat(60));
    collections.forEach((c, i) => {
      console.log(`\n${i + 1}. ${c.title}`);
      console.log(`   Handle: ${c.handle}`);
      console.log(`   Products: ${c.productsCount?.count || 0}`);
      console.log(`   Description: ${c.description?.substring(0, 100) || '(none)'}${c.description?.length > 100 ? '...' : ''}`);
      console.log(`   ID: ${c.id}`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('PRODUCTS');
    console.log('═'.repeat(60));
    products.forEach((p, i) => {
      const price = p.priceRangeV2?.minVariantPrice;
      console.log(`\n${i + 1}. ${p.title}`);
      console.log(`   Handle: ${p.handle}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Price: ${price ? `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}` : 'N/A'}`);
      console.log(`   Inventory: ${p.totalInventory}`);
      console.log(`   Type: ${p.productType || '(none)'}`);
      console.log(`   Vendor: ${p.vendor || '(none)'}`);
      console.log(`   Tags: ${p.tags?.join(', ') || '(none)'}`);
      console.log(`   Collections: ${p.collections?.edges?.map((e: any) => e.node.title).join(', ') || '(none)'}`);
      console.log(`   Description: ${p.description?.substring(0, 100) || '(none)'}${p.description?.length > 100 ? '...' : ''}`);
      console.log(`   ID: ${p.id}`);
    });

    // Save to JSON for reference
    const data = { products, collections, fetchedAt: new Date().toISOString() };
    const fs = await import('fs');
    fs.writeFileSync('scripts/shopify-data.json', JSON.stringify(data, null, 2));
    console.log('\n✅ Data saved to scripts/shopify-data.json');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();



