/**
 * Publish Active Products to Online Store
 * 
 * This script publishes all ACTIVE products to the Online Store sales channel
 * so they appear in the Storefront API.
 * 
 * Run with: npx tsx scripts/publish-products.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Online Store publication ID
const ONLINE_STORE_PUBLICATION_ID = 'gid://shopify/Publication/275745898798';
// Headless publication ID
const HEADLESS_PUBLICATION_ID = 'gid://shopify/Publication/285178102062';

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
  }
  
  return json.data;
}

interface Product {
  id: string;
  title: string;
  status: string;
}

async function getActiveProducts(): Promise<Product[]> {
  const products: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
    query GetActiveProducts($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "status:ACTIVE") {
        edges {
          cursor
          node {
            id
            title
            status
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

    if (!data?.products?.edges) break;

    products.push(...data.products.edges.map((e) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return products;
}

async function publishProduct(productId: string, publicationId: string): Promise<boolean> {
  try {
    const result = await adminFetch<{
      publishablePublish: {
        userErrors: { field: string[]; message: string }[];
      };
    }>(`
      mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors { field message }
        }
      }
    `, {
      id: productId,
      input: [{ publicationId }]
    });

    if (result?.publishablePublish?.userErrors?.length > 0) {
      // "Already published" is not really an error
      const hasRealError = result.publishablePublish.userErrors.some(
        e => !e.message.toLowerCase().includes('already published')
      );
      if (hasRealError) {
        console.error(`    Error: ${result.publishablePublish.userErrors[0].message}`);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error(`    Failed to publish: ${err}`);
    return false;
  }
}

async function main() {
  console.log('📦 Publish Products to Sales Channels\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}\n`);

  console.log('Fetching active products...');
  const products = await getActiveProducts();
  console.log(`Found ${products.length} active products\n`);

  if (products.length === 0) {
    console.log('No active products to publish.');
    return;
  }

  console.log('Publishing to Online Store and Headless channels...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    process.stdout.write(`[${i + 1}/${products.length}] ${product.title.substring(0, 50).padEnd(50)} ... `);
    
    // Publish to both channels
    const onlineSuccess = await publishProduct(product.id, ONLINE_STORE_PUBLICATION_ID);
    const headlessSuccess = await publishProduct(product.id, HEADLESS_PUBLICATION_ID);
    
    if (onlineSuccess && headlessSuccess) {
      console.log('✅');
      successCount++;
    } else {
      console.log('⚠️');
      errorCount++;
    }
    
    // Rate limiting
    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`\n✅ Published: ${successCount}`);
  console.log(`⚠️ Warnings/Errors: ${errorCount}`);
  console.log('\n🎉 Done! Products should now appear in the Storefront API.');
}

main().catch(console.error);

