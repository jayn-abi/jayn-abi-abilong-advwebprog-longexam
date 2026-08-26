import { useState } from 'react';
import Button from '../../components/Button.jsx';
import ProductList from '../../components/ProductList.jsx';
import { categoriesApi, productsApi } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';

const ProductListPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data: categoriesData } = useAsync(() => categoriesApi.list(), []);
  const categories = categoriesData?.categories ?? [];

  const {
    data: productsData,
    loading,
    error,
  } = useAsync(
    () =>
      productsApi.list({
        ...(activeCategory ? { category: activeCategory } : {}),
        ...(search ? { search } : {}),
      }),
    [activeCategory, search],
  );
  const products = productsData?.products ?? [];

  return (
    <div className="flex w-full flex-col">

      {/* Header */}
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            Products
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Shop campus essentials in one simple grid
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            Browse practical items for class, study, commute, and everyday campus routines.
          </p>
          <div className="mt-7">
            <Button to="/" variant="outline">Back Home</Button>
          </div>
        </div>
      </section>


      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-nu-blue/50">
                Featured Products
              </p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-900">All products</h2>
            </div>
            <p className="text-sm font-medium text-zinc-400">{products.length} items</p>
          </div>

          <div className="mb-6">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue"
            />
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('')}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition cursor-pointer ${
                activeCategory === '' ? 'bg-nu-blue text-white' : 'bg-white text-nu-blue border-2 border-zinc-200 hover:border-nu-blue'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setActiveCategory(cat._id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition cursor-pointer ${
                  activeCategory === cat._id ? 'bg-nu-blue text-white' : 'bg-white text-nu-blue border-2 border-zinc-200 hover:border-nu-blue'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading && <p className="text-sm text-zinc-500">Loading products...</p>}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          )}
          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-zinc-500">No products found in this category.</p>
          )}
          {!loading && !error && products.length > 0 && <ProductList products={products} />}
        </div>
      </section>

    </div>
  );
};

export default ProductListPage;
