import Link from "next/link";
import { getAllProducts, getAllCollections } from "@/lib/shopify/admin";

/**
 * Admin Dashboard
 * 
 * This page fetches ALL products and collections from your Shopify store
 * using the Admin API. Use this to see what data you have available.
 * 
 * NOTE: This requires SHOPIFY_ADMIN_ACCESS_TOKEN to be set in .env.local
 */
export default async function AdminPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let collections: Awaited<ReturnType<typeof getAllCollections>> = [];
  let error: string | null = null;

  try {
    [products, collections] = await Promise.all([
      getAllProducts(),
      getAllCollections(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch data from Shopify";
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-[var(--sage-600)] hover:underline mb-2 inline-block">
              ← Back to Store
            </Link>
            <h1 className="font-serif text-3xl font-semibold text-[var(--stone-800)]">
              Shopify Data Overview
            </h1>
            <p className="text-[var(--stone-500)] mt-1">
              View all products and collections from your Shopify store
            </p>
          </div>
          <a
            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[var(--stone-800)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sage-600)] transition-colors"
          >
            Open Shopify Admin →
          </a>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="bg-red-100 rounded-lg p-4 text-sm font-mono text-red-800">
              <p className="mb-2">Make sure your .env.local has:</p>
              <code>SHOPIFY_STORE_DOMAIN=your-store.myshopify.com</code><br/>
              <code>SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx</code>
            </div>
          </div>
        )}

        {/* Stats */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[var(--stone-200)]">
              <p className="text-sm text-[var(--stone-500)] uppercase tracking-wider">Total Products</p>
              <p className="text-4xl font-semibold text-[var(--stone-800)] mt-1">{products.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[var(--stone-200)]">
              <p className="text-sm text-[var(--stone-500)] uppercase tracking-wider">Collections</p>
              <p className="text-4xl font-semibold text-[var(--stone-800)] mt-1">{collections.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[var(--stone-200)]">
              <p className="text-sm text-[var(--stone-500)] uppercase tracking-wider">Active Products</p>
              <p className="text-4xl font-semibold text-[var(--sage-600)] mt-1">
                {products.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        )}

        {/* Collections */}
        {!error && collections.length > 0 && (
          <section className="mb-12">
            <h2 className="font-semibold text-xl text-[var(--stone-800)] mb-4">Collections</h2>
            <div className="bg-white rounded-xl border border-[var(--stone-200)] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[var(--stone-50)] border-b border-[var(--stone-200)]">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Handle</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Products</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Description</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--stone-100)]">
                  {collections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-[var(--stone-50)]">
                      <td className="px-6 py-4">
                        <span className="font-medium text-[var(--stone-800)]">{collection.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-[var(--sage-600)] bg-[var(--sage-50)] px-2 py-1 rounded">
                          {collection.handle}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-[var(--stone-600)]">
                        {collection.productsCount.count}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--stone-500)] max-w-xs truncate">
                        {collection.description || <span className="italic text-[var(--stone-400)]">No description</span>}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/collections/${collection.id.split('/').pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--sage-600)] hover:underline"
                        >
                          Edit in Shopify
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Products */}
        {!error && products.length > 0 && (
          <section>
            <h2 className="font-semibold text-xl text-[var(--stone-800)] mb-4">Products</h2>
            <div className="bg-white rounded-xl border border-[var(--stone-200)] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[var(--stone-50)] border-b border-[var(--stone-200)]">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Handle</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Inventory</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Collections</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-[var(--stone-600)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--stone-100)]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[var(--stone-50)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.featuredImage ? (
                            <img
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText || product.title}
                              className="w-10 h-10 rounded-lg object-cover bg-[var(--stone-100)]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[var(--stone-100)] flex items-center justify-center text-[var(--stone-400)]">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-[var(--stone-800)] block">{product.title}</span>
                            {product.vendor && (
                              <span className="text-xs text-[var(--stone-500)]">{product.vendor}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-[var(--sage-600)] bg-[var(--sage-50)] px-2 py-1 rounded">
                          {product.handle}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700' 
                            : product.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-[var(--stone-100)] text-[var(--stone-600)]'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--stone-600)]">
                        ${parseFloat(product.priceRangeV2.minVariantPrice.amount).toFixed(2)}
                        {product.priceRangeV2.minVariantPrice.amount !== product.priceRangeV2.maxVariantPrice.amount && (
                          <span className="text-[var(--stone-400)]">
                            {' - '}${parseFloat(product.priceRangeV2.maxVariantPrice.amount).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${product.totalInventory > 0 ? 'text-[var(--stone-600)]' : 'text-red-500'}`}>
                          {product.totalInventory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.collections.edges.slice(0, 2).map((c) => (
                            <span key={c.node.id} className="text-xs bg-[var(--stone-100)] text-[var(--stone-600)] px-2 py-1 rounded">
                              {c.node.title}
                            </span>
                          ))}
                          {product.collections.edges.length > 2 && (
                            <span className="text-xs text-[var(--stone-400)]">
                              +{product.collections.edges.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/products/${product.handle}`}
                            className="text-sm text-[var(--stone-600)] hover:text-[var(--stone-800)]"
                          >
                            Preview
                          </Link>
                          <a
                            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/products/${product.id.split('/').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--sage-600)] hover:underline"
                          >
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && collections.length === 0 && (
          <div className="bg-white rounded-xl border border-[var(--stone-200)] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--stone-800)] mb-2">No products yet</h3>
            <p className="text-[var(--stone-500)] mb-6">Add products in Shopify to see them here.</p>
            <a
              href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/products/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-4 py-2 bg-[var(--sage-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--sage-700)] transition-colors"
            >
              Add Your First Product
            </a>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-12 bg-[var(--stone-800)] text-white rounded-xl p-8">
          <h3 className="font-semibold text-lg mb-4">How to Edit Products & Collections</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-[var(--sage-300)] mb-2">Option 1: Shopify Admin (Recommended)</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Click &quot;Edit in Shopify&quot; next to any product or collection to open the Shopify admin editor. 
                This is the easiest way to update titles, descriptions, images, pricing, and inventory.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-[var(--sage-300)] mb-2">Option 2: Programmatic (Admin API)</h4>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Use the Admin API functions we&apos;ve set up for bulk updates or automation:
              </p>
              <pre className="bg-white/10 rounded-lg p-3 text-sm overflow-x-auto">
{`import { updateProduct } from '@/lib/shopify/admin';

await updateProduct({
  id: 'gid://shopify/Product/123',
  title: 'New Title',
  descriptionHtml: '<p>New description</p>',
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



