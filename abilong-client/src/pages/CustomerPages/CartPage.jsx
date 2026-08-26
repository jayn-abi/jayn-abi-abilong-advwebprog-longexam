import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth-context';
import { useCart } from '../../context/cart-context';
import { ordersApi } from '../../lib/api';

const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;

const CartPage = () => {
  const { user } = useAuth();
  const { cart, updateItem, removeItem, refresh } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address ?? '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const items = cart?.items ?? [];

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      await ordersApi.create({ shippingAddress, paymentMethod });
      await refresh();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            Cart
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Your Cart
          </h1>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-zinc-500">Your cart is empty.</p>
              <Button to="/products" variant="primary" className="mt-6">Browse Products</Button>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-zinc-900">{item.product.name}</p>
                      <p className="text-sm text-zinc-500">{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 rounded-full border-2 border-zinc-200 text-zinc-500 transition hover:border-nu-blue hover:text-nu-blue cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateItem(item.product._id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full border-2 border-zinc-200 text-zinc-500 transition hover:border-nu-blue hover:text-nu-blue cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-24 text-right font-bold text-nu-blue">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product._id)}
                      className="text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">Total</p>
                  <p className="text-2xl font-extrabold text-nu-blue">{formatPrice(cart.totalPrice)}</p>
                </div>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
                )}

                <form className="mt-4 space-y-4" onSubmit={handlePlaceOrder}>
                  <div>
                    <label htmlFor="shipping-address" className="text-sm font-semibold text-zinc-700">
                      Shipping Address
                    </label>
                    <input
                      id="shipping-address"
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 focus:border-nu-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="payment-method" className="text-sm font-semibold text-zinc-700">
                      Payment Method
                    </label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 focus:border-nu-blue focus:bg-white"
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="Card">Card</option>
                      <option value="GCash">GCash</option>
                    </select>
                  </div>
                  <Button type="submit" variant="gold" className="w-full py-3 text-xs tracking-[0.2em]" disabled={placing}>
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
