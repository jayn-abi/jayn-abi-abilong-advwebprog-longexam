import Button from '../../components/Button';
import { ordersApi } from '../../lib/api';
import { useAsync } from '../../hooks/useAsync';

const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;

const statusClasses = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-blue-50 text-blue-600',
  ready_for_claiming: 'bg-indigo-50 text-indigo-600',
  claimed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  ready_for_claiming: 'Ready for Claiming',
  claimed: 'Claimed',
  cancelled: 'Cancelled',
};

const OrdersPage = () => {
  const { data, loading, error } = useAsync(() => ordersApi.mine(), []);
  const orders = data?.orders ?? [];

  return (
    <div className="flex w-full flex-col">
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            Orders
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Your Orders
          </h1>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {loading && <p className="text-sm text-zinc-500">Loading orders...</p>}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-zinc-500">You haven't placed any orders yet.</p>
              <Button to="/products" variant="primary" className="mt-6">Browse Products</Button>
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusClasses[order.status] ?? 'bg-zinc-100 text-zinc-600'}`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.product} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-700">
                        {item.name} <span className="text-zinc-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium text-zinc-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                  <div className="text-sm text-zinc-500">
                    <p>{order.shippingAddress}</p>
                    <p>{order.paymentMethod}</p>
                  </div>
                  <p className="text-lg font-extrabold text-nu-blue">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrdersPage;
