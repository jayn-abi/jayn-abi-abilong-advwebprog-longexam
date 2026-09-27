import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import ProductForm from '../../components/ProductForm';
import ProductThumbnail from '../../components/ProductThumbnail';
import { categoriesApi, productsApi } from '../../lib/api';
import { useAsync } from '../../hooks/useAsync';

const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;

const SupplierProductsPage = () => {
  const { data: categoriesData } = useAsync(() => categoriesApi.list(), []);
  const categories = categoriesData?.categories ?? [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.mine();
      setProducts(data.products ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    if (editingProduct) {
      await productsApi.update(editingProduct._id, payload);
    } else {
      await productsApi.create(payload);
    }
    setShowForm(false);
    setEditingProduct(null);
    await loadProducts();
  };

  return (
    <div className="flex w-full flex-col">
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            Supplier Dashboard
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            My Products
          </h1>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">{products.length} products</p>
            {!showForm && (
              <Button type="button" variant="gold" onClick={openCreateForm}>+ Add Product</Button>
            )}
          </div>

          {showForm && (
            <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </p>
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                submitLabel={editingProduct ? 'Update Product' : 'Create Product'}
              />
            </div>
          )}

          {loading && <p className="text-sm text-zinc-500">Loading your products...</p>}
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

          {!loading && !error && products.length === 0 && !showForm && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-zinc-500">You haven't listed any products yet.</p>
              <Button type="button" variant="primary" className="mt-6" onClick={openCreateForm}>Add Your First Product</Button>
            </div>
          )}

          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <ProductThumbnail product={product} />
                  <div>
                    <p className="font-bold text-zinc-900">{product.name}</p>
                    <p className="text-sm text-zinc-500">{product.category?.name} · {formatPrice(product.price)} · {product.stock} in stock</p>
                    {!product.isActive && (
                      <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Inactive</span>
                    )}
                  </div>
                </div>
                <Button type="button" variant="secondary" onClick={() => openEditForm(product)}>Edit</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupplierProductsPage;
