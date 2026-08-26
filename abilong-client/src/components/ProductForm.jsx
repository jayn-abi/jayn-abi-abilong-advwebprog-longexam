import { useState } from 'react';
import Button from './Button';
import FormError from './FormError';

const inputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white';

const toFormState = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? '',
  stock: product?.stock ?? '',
  category: product?.category?._id ?? product?.category ?? '',
  supplier: product?.supplier?._id ?? product?.supplier ?? '',
  images: (product?.images ?? []).join(', '),
  isActive: product?.isActive ?? true,
});

const ProductForm = ({ product, categories = [], suppliers, onSubmit, onCancel, submitLabel = 'Save Product' }) => {
  const [form, setForm] = useState(() => toFormState(product));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => {
    const value = field === 'isActive' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
        isActive: form.isActive,
      };
      if (suppliers && form.supplier) payload.supplier = form.supplier;

      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormError message={error} />

      <div>
        <label htmlFor="product-name" className="text-sm font-semibold text-zinc-700">Product Name</label>
        <input
          id="product-name"
          type="text"
          value={form.name}
          onChange={updateField('name')}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="product-description" className="text-sm font-semibold text-zinc-700">Description</label>
        <textarea
          id="product-description"
          value={form.description}
          onChange={updateField('description')}
          required
          rows={3}
          className={inputClasses}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-price" className="text-sm font-semibold text-zinc-700">Price (₱)</label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={updateField('price')}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="product-stock" className="text-sm font-semibold text-zinc-700">Stock</label>
          <input
            id="product-stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={updateField('stock')}
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-category" className="text-sm font-semibold text-zinc-700">Category</label>
        <select
          id="product-category"
          value={form.category}
          onChange={updateField('category')}
          required
          className={inputClasses}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {suppliers && (
        <div>
          <label htmlFor="product-supplier" className="text-sm font-semibold text-zinc-700">Supplier</label>
          <select
            id="product-supplier"
            value={form.supplier}
            onChange={updateField('supplier')}
            className={inputClasses}
          >
            <option value="">No supplier</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>{sup.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="product-images" className="text-sm font-semibold text-zinc-700">Image URLs</label>
        <input
          id="product-images"
          type="text"
          placeholder="https://example.com/a.jpg, https://example.com/b.jpg"
          value={form.images}
          onChange={updateField('images')}
          className={inputClasses}
        />
        <p className="mt-2 text-xs leading-5 text-zinc-400">Comma-separated image URLs.</p>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
        <input type="checkbox" checked={form.isActive} onChange={updateField('isActive')} className="h-4 w-4 rounded border-zinc-300 accent-nu-blue" />
        Active (visible in the store)
      </label>

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" variant="gold" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
