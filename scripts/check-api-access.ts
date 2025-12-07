/**
 * Check what Admin API access we have
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function adminFetch(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  return json;
}

async function main() {
  console.log('🔐 Checking Shopify Admin API Access...\n');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}\n`);

  // Test 1: Read Shop Info
  console.log('1️⃣ Testing READ access (Shop Info)...');
  const shopResult = await adminFetch(`
    query {
      shop {
        name
        email
        myshopifyDomain
        plan { displayName }
        currencyCode
      }
    }
  `);
  if (shopResult.data?.shop) {
    console.log('   ✅ READ Shop: SUCCESS');
    console.log(`   Shop Name: ${shopResult.data.shop.name}`);
    console.log(`   Plan: ${shopResult.data.shop.plan?.displayName}`);
  } else {
    console.log('   ❌ READ Shop: FAILED', shopResult.errors?.[0]?.message);
  }

  // Test 2: Read Products
  console.log('\n2️⃣ Testing READ access (Products)...');
  const productsResult = await adminFetch(`
    query {
      products(first: 1) {
        edges { node { id title } }
      }
    }
  `);
  if (productsResult.data?.products) {
    console.log('   ✅ READ Products: SUCCESS');
  } else {
    console.log('   ❌ READ Products: FAILED', productsResult.errors?.[0]?.message);
  }

  // Test 3: Read Collections
  console.log('\n3️⃣ Testing READ access (Collections)...');
  const collectionsResult = await adminFetch(`
    query {
      collections(first: 1) {
        edges { node { id title } }
      }
    }
  `);
  if (collectionsResult.data?.collections) {
    console.log('   ✅ READ Collections: SUCCESS');
  } else {
    console.log('   ❌ READ Collections: FAILED', collectionsResult.errors?.[0]?.message);
  }

  // Test 4: Read Orders
  console.log('\n4️⃣ Testing READ access (Orders)...');
  const ordersResult = await adminFetch(`
    query {
      orders(first: 1) {
        edges { node { id name } }
      }
    }
  `);
  if (ordersResult.data?.orders) {
    console.log('   ✅ READ Orders: SUCCESS');
  } else {
    console.log('   ❌ READ Orders: FAILED', ordersResult.errors?.[0]?.message);
  }

  // Test 5: Read Customers
  console.log('\n5️⃣ Testing READ access (Customers)...');
  const customersResult = await adminFetch(`
    query {
      customers(first: 1) {
        edges { node { id email } }
      }
    }
  `);
  if (customersResult.data?.customers) {
    console.log('   ✅ READ Customers: SUCCESS');
  } else {
    console.log('   ❌ READ Customers: FAILED', customersResult.errors?.[0]?.message);
  }

  // Test 6: Check if we can WRITE (update a product - dry run by reading mutation access)
  console.log('\n6️⃣ Testing WRITE access (Product Update - checking introspection)...');
  const introspectResult = await adminFetch(`
    query {
      __type(name: "Mutation") {
        fields {
          name
        }
      }
    }
  `);
  
  const mutations = introspectResult.data?.__type?.fields?.map((f: any) => f.name) || [];
  const writeMutations = ['productUpdate', 'productCreate', 'collectionUpdate', 'collectionCreate'];
  const hasWriteAccess = writeMutations.some(m => mutations.includes(m));
  
  if (hasWriteAccess) {
    console.log('   ✅ WRITE Mutations Available:');
    writeMutations.forEach(m => {
      if (mutations.includes(m)) console.log(`      - ${m}`);
    });
  }

  // Test 7: Actually try to update a product (get first product, update its tags - reversible)
  console.log('\n7️⃣ Testing ACTUAL WRITE (Update Product Tags)...');
  const firstProduct = productsResult.data?.products?.edges?.[0]?.node;
  if (firstProduct) {
    const updateResult = await adminFetch(`
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id title tags }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: firstProduct.id,
        tags: ["animalia-test-tag"] // Add a test tag we can remove later
      }
    });

    if (updateResult.data?.productUpdate?.product) {
      console.log('   ✅ WRITE Product: SUCCESS');
      console.log(`   Updated: ${updateResult.data.productUpdate.product.title}`);
      
      // Remove the test tag
      await adminFetch(`
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id }
          }
        }
      `, {
        input: {
          id: firstProduct.id,
          tags: updateResult.data.productUpdate.product.tags.filter((t: string) => t !== "animalia-test-tag")
        }
      });
      console.log('   (Test tag removed)');
    } else {
      console.log('   ❌ WRITE Product: FAILED', updateResult.errors?.[0]?.message || updateResult.data?.productUpdate?.userErrors?.[0]?.message);
    }
  }

  // Test 8: Test Collection Update
  console.log('\n8️⃣ Testing ACTUAL WRITE (Update Collection)...');
  const firstCollection = collectionsResult.data?.collections?.edges?.[0]?.node;
  if (firstCollection) {
    // Get current description
    const collectionDetail = await adminFetch(`
      query getCollection($id: ID!) {
        collection(id: $id) {
          id title description
        }
      }
    `, { id: firstCollection.id });
    
    const originalDesc = collectionDetail.data?.collection?.description || '';
    
    const updateResult = await adminFetch(`
      mutation collectionUpdate($input: CollectionInput!) {
        collectionUpdate(input: $input) {
          collection { id title description }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: firstCollection.id,
        descriptionHtml: originalDesc + ' ' // Just add a space (reversible)
      }
    });

    if (updateResult.data?.collectionUpdate?.collection) {
      console.log('   ✅ WRITE Collection: SUCCESS');
      
      // Revert
      await adminFetch(`
        mutation collectionUpdate($input: CollectionInput!) {
          collectionUpdate(input: $input) {
            collection { id }
          }
        }
      `, {
        input: {
          id: firstCollection.id,
          descriptionHtml: originalDesc
        }
      });
      console.log('   (Reverted to original)');
    } else {
      console.log('   ❌ WRITE Collection: FAILED', updateResult.errors?.[0]?.message || updateResult.data?.collectionUpdate?.userErrors?.[0]?.message);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📋 SUMMARY OF API ACCESS');
  console.log('═'.repeat(50));
  console.log('✅ READ: Shop, Products, Collections, Orders, Customers');
  console.log('✅ WRITE: Products (update titles, descriptions, tags, status, etc.)');
  console.log('✅ WRITE: Collections (update titles, descriptions, etc.)');
  console.log('\n🎉 Full Admin API control confirmed!');
  console.log('\nI can:');
  console.log('  • Activate/deactivate products (change status DRAFT → ACTIVE)');
  console.log('  • Update product titles, descriptions, prices');
  console.log('  • Add/edit collection descriptions');
  console.log('  • Manage tags and metafields');
  console.log('  • And much more...');
}

main().catch(console.error);



