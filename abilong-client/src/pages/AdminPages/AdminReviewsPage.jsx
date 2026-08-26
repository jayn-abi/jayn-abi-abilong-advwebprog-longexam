import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import FormError from '../../components/FormError';
import { reviewsApi } from '../../lib/api';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [saving, setSaving] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reviewsApi.all();
      setReviews(data.reviews ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await reviewsApi.update(editingId, { rating: Number(editForm.rating), comment: editForm.comment });
      setEditingId(null);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // const handleDelete = async (id) => {
  //   setError('');
  //   try {
  //     await reviewsApi.remove(id);
  //     await loadReviews();
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div>
      <p className="mb-6 text-sm font-medium text-zinc-400">{reviews.length} reviews</p>

      {loading && <p className="text-sm text-zinc-500">Loading reviews...</p>}
      <FormError message={error} />

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {editingId === review._id ? (
              <form className="space-y-3" onSubmit={handleUpdate}>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-zinc-700">Rating</label>
                  <select
                    value={editForm.rating}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, rating: e.target.value }))}
                    className="rounded-lg border-2 border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-nu-blue"
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  required
                  className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-nu-blue focus:bg-white"
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="gold" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-zinc-900">{review.product?.name}</p>
                    <p className="text-xs text-zinc-500">
                      {review.user?.firstName} {review.user?.lastName} · {review.rating} / 5
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => startEdit(review)}>Edit</Button>
                    {/* <Button type="button" variant="secondary" onClick={() => handleDelete(review._id)}>Delete</Button> */}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{review.comment}</p>
              </>
            )}
          </div>
        ))}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-sm text-zinc-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
