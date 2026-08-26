import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import ReviewSection from '../../components/ReviewSection.jsx';
import { productsApi } from '../../lib/api.js';
import { resolveProductImage } from '../../lib/productImages.js';
import { useAuth } from '../../context/auth-context.js';
import { useCart } from '../../context/cart-context.js';
import { useAsync } from '../../hooks/useAsync.js';

const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const { data: product, loading, error } = useAsync(() => productsApi.get(id), [id]);
  const notFound = Boolean(error);
  const [cartMessage, setCartMessage] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    setAdding(true);
    setCartMessage('');
    try {
      await addItem(product._id, 1);
      setCartMessage('Added to cart!');
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col">
        <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-zinc-500">Loading product...</p>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex w-full flex-col">
        <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Product not found</h1>
            <Button to="/products" variant="primary" className="mt-6">Back to Products</Button>
          </div>
        </section>
      </div>
    );
  }

  const image = resolveProductImage(product.images);

  return (
    <div className="flex w-full flex-col">

      {/* Product header */}
      <section className="relative overflow-hidden bg-nu-blue px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-6">
            <Button to="/products" variant="outline">← Back to Products</Button>
          </div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            {product.category?.name}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-extrabold text-nu-gold">{formatPrice(product.price)}</span>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className="aspect-4/3 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-4/3 items-center justify-center bg-zinc-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-20 w-20 text-zinc-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
              )}
            </div>


            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">
                  Product Details
                </p>
                <div className="mt-4 space-y-3">
                  <p className="text-sm leading-7 text-zinc-600">{product.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">Price</p>
                  <p className="text-2xl font-extrabold text-nu-blue">{formatPrice(product.price)}</p>
                </div>
                {cartMessage && (
                  <p className="mt-3 text-sm font-medium text-nu-blue">{cartMessage}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="gold"
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                  >
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button to="/products" variant="secondary">Back to Products</Button>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-10">
            <ReviewSection productId={product._id} />
          </div>
        </div>
      </section>

    </div>
  );
}

export default ProductPage;
