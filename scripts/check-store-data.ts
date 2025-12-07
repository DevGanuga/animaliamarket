/**
 * Quick script to check what collections and products exist in the Shopify store
 */

const SHOPIFY_STORE_DOMAIN = 'ut7c8y-5h.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '83ae3fb7cb0769334670136573cc4451';
const SHOPIFY_API_VERSION = '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function fetchShopifyData() {
  // Get collections
  const collectionsQuery = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            productsCount
            products(first: 5) {
              edges {
                node {
                  id
                  title
                  vendor
                }
              }
            }
          }
        }
      }
    }
  `;

  // Get products
  const productsQuery = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            vendor
            productType
            availableForSale
            tags
          }
        }
      }
    }
  `;

  try {
    console.log('🔍 Fetching collections from Shopify...\n');
    const collectionsResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: collectionsQuery, variables: { first: 50 } }),
      // @ts-ignore - signal property for timeout
      signal: AbortSignal.timeout(30000),
    });

    const collectionsData = await collectionsResponse.json();

    if (collectionsData.errors) {
      console.error('❌ Collections errors:', collectionsData.errors);
    } else {
      const collections = collectionsData.data?.collections?.edges || [];
      console.log(`📦 Found ${collections.length} collections:\n`);
      collections.forEach((edge: any) => {
        const c = edge.node;
        console.log(`  • ${c.title} (${c.handle})`);
        console.log(`    Products: ${c.productsCount || c.products.edges.length}`);
        if (c.products.edges.length > 0) {
          console.log(`    Sample products:`);
          c.products.edges.forEach((p: any) => {
            console.log(`      - ${p.node.title} by ${p.node.vendor}`);
          });
        }
        console.log('');
      });
    }

    console.log('\n🛍️  Fetching products from Shopify...\n');
    const productsResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: productsQuery, variables: { first: 100 } }),
      // @ts-ignore - signal property for timeout
      signal: AbortSignal.timeout(30000),
    });

    const productsData = await productsResponse.json();

    if (productsData.errors) {
      console.error('❌ Products errors:', productsData.errors);
    } else {
      const products = productsData.data?.products?.edges || [];
      console.log(`📦 Found ${products.length} products:\n`);

      // Group by vendor
      const byVendor: Record<string, any[]> = {};
      products.forEach((edge: any) => {
        const p = edge.node;
        const vendor = p.vendor || 'Unknown';
        if (!byVendor[vendor]) byVendor[vendor] = [];
        byVendor[vendor].push(p);
      });

      console.log('\n📊 Products by Vendor:');
      Object.entries(byVendor).forEach(([vendor, prods]) => {
        console.log(`\n  ${vendor} (${prods.length} products):`);
        prods.slice(0, 5).forEach((p: any) => {
          console.log(`    • ${p.title} ${p.availableForSale ? '✅' : '❌'}`);
        });
        if (prods.length > 5) {
          console.log(`    ... and ${prods.length - 5} more`);
        }
      });

      // Summary
      console.log('\n\n📈 Summary:');
      console.log(`  Total Collections: ${collections.length}`);
      console.log(`  Total Products: ${products.length}`);
      console.log(`  Unique Vendors: ${Object.keys(byVendor).length}`);
      console.log(`  Available Products: ${products.filter((p: any) => p.node.availableForSale).length}`);
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }
}

fetchShopifyData();
