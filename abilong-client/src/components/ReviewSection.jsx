import { useCallback, useEffect, useState } from 'react';
import FormError from './FormError';
import Button from './Button';
import { useAuth } from '../context/auth-context';
import { reviewsApi } from '../lib/api';

const Stars = ({ rating }) => (
  <span className="text-nu-gold" aria-label={`${rating} out of 5 stars`}>
    {'★'.repeat(rating)}
    <span className="text-zinc-200">{'★'.repeat(5 - rating)}</span>
  </span>
);

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reviewsApi.forProduct(productId);
      setReviews(data.reviews ?? []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await reviewsApi.create({ productId, rating: Number(rating), comment });
      setComment('');
      setRating(5);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">Reviews</p>

      {loading && <p className="mt-4 text-sm text-zinc-500">Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p className="mt-4 text-sm text-zinc-500">No reviews yet. Be the first to share your thoughts.</p>
      )}

      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-900">
                {review.user?.firstName} {review.user?.lastName}
              </p>
              <Stars rating={review.rating} />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-zinc-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {user?.type === 'customer' ? (
        <form className="mt-6 space-y-3 border-t border-zinc-100 pt-5" onSubmit={handleSubmit}>
          <FormError message={error} />
          <div>
            <label htmlFor="review-rating" className="text-sm font-semibold text-zinc-700">Your Rating</label>
            <select
              id="review-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 focus:border-nu-blue focus:bg-white"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review-comment" className="text-sm font-semibold text-zinc-700">Your Review</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Share your experience with this product..."
              className="mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white"
            />
          </div>
          <Button type="submit" variant="gold" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Review'}
          </Button>
        </form>
      ) : (
        !user && (
          <p className="mt-6 border-t border-zinc-100 pt-5 text-sm text-zinc-500">
            Sign in as a customer to write a review.
          </p>
        )
      )}
    </div>
  );
};

export default ReviewSection;
