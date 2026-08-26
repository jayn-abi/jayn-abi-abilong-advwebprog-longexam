import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import { ordersApi } from '../../lib/api';

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

const nextActions = {
  pending: [{ label: 'Confirm Order', status: 'confirmed' }, { label: 'Cancel', status: 'cancelled' }],
  confirmed: [{ label: 'Mark Ready for Claiming', status: 'ready_for_claiming' }, { label: 'Cancel', status: 'cancelled' }],
  ready_for_claiming: [{ label: 'Mark Claimed', status: 'claimed' }],
  claimed: [],
  cancelled: [],
};

const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ordersApi.all(statusFilter);
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await ordersApi.updateStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-400">{orders.length} orders</p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border-2 border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-nu-blue"
        >
          <option value="">All Statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-zinc-500">Loading orders...</p>}
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">
                  Order #{order._id.slice(-8)}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {order.user?.firstName} {order.user?.lastName} · {order.user?.email}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusClasses[order.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">{item.name} <span className="text-zinc-400">x{item.quantity}</span></span>
                  <span className="font-medium text-zinc-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
              <p className="text-lg font-extrabold text-nu-blue">{formatPrice(order.totalAmount)}</p>
              <div className="flex flex-wrap gap-2">
                {(nextActions[order.status] ?? []).map((action) => (
                  <Button
                    key={action.status}
                    type="button"
                    variant={action.status === 'cancelled' ? 'secondary' : 'gold'}
                    disabled={updatingId === order._id}
                    onClick={() => handleStatusChange(order._id, action.status)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-zinc-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
