import { useEffect, useMemo, useRef, useState } from 'react';
import Button from './Button';
import FormError from './FormError';
import { ALLOWED_IMAGE_TYPES, resolveProductImage, validateImageFile } from '../lib/productImages';

const inputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white';

const errorInputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-red-400';

const fieldErrorClasses = 'mt-1.5 text-xs font-semibold text-red-600';

const toFormState = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? '',
  stock: product?.stock ?? '',
  category: product?.category?._id ?? product?.category ?? '',
  supplier: product?.supplier?._id ?? product?.supplier ?? '',
  isActive: product?.isActive ?? true,
});

const ProductForm = ({ product, categories = [], suppliers, onSubmit, onCancel, submitLabel = 'Save Product' }) => {
  const [form, setForm] = useState(() => toFormState(product));
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const hasUploadedImage = Boolean(product?.image?.url);
  // When the uploaded image is marked for removal, show what the store will fall back to
  const currentImage = resolveProductImage(removeImage ? { images: product?.images } : product);

  // Local preview of the selected file; revoked when it changes or unmounts
  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ''), [imageFile]);
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const clearFileInput = () => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    setFieldErrors((prev) => ({ ...prev, image: '' }));
    if (!file) {
      setImageFile(null);
      return;
    }

    const imageError = await validateImageFile(file);
    if (imageError) {
      clearFileInput();
      setFieldErrors((prev) => ({ ...prev, image: imageError }));
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
  };

  const handleRemoveCurrentImage = () => {
    clearFileInput();
    setRemoveImage(true);
  };

  const updateField = (field) => (e) => {
    const value = field === 'isActive' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const validate = () => {
    const errors = {};
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      errors.price = 'Price cannot be negative.';
    }
    if (form.stock === '' || Number.isNaN(Number(form.stock)) || Number(form.stock) <= 0) {
      errors.stock = 'Stock must be greater than 0.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fix the highlighted fields below.');
      return;
    }

    setSubmitting(true);
    try {
      // Sent as multipart/form-data so the image file travels with the product fields
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('description', form.description);
      payload.append('price', Number(form.price));
      payload.append('stock', Number(form.stock));
      payload.append('category', form.category);
      payload.append('isActive', form.isActive);
      if (suppliers && form.supplier) payload.append('supplier', form.supplier);
      if (imageFile) payload.append('image', imageFile);
      else if (removeImage) payload.append('removeImage', 'true');

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
            aria-invalid={Boolean(fieldErrors.price)}
            className={fieldErrors.price ? errorInputClasses : inputClasses}
          />
          {fieldErrors.price && <p className={fieldErrorClasses}>{fieldErrors.price}</p>}
        </div>
        <div>
          <label htmlFor="product-stock" className="text-sm font-semibold text-zinc-700">Stock</label>
          <input
            id="product-stock"
            type="number"
            min="1"
            value={form.stock}
            onChange={updateField('stock')}
            required
            aria-invalid={Boolean(fieldErrors.stock)}
            className={fieldErrors.stock ? errorInputClasses : inputClasses}
          />
          {fieldErrors.stock && <p className={fieldErrorClasses}>{fieldErrors.stock}</p>}
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
        <label htmlFor="product-image" className="text-sm font-semibold text-zinc-700">Product Image</label>
        <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50">
            {previewUrl || currentImage ? (
              <img
                src={previewUrl || currentImage}
                alt={previewUrl ? 'Selected image preview' : 'Current product image'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-3 text-center text-xs text-zinc-400">No image</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              id="product-image"
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              onChange={handleImageChange}
              aria-invalid={Boolean(fieldErrors.image)}
              className="block w-full text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-nu-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-nu-blue-light"
            />
            <p className="mt-2 text-xs leading-5 text-zinc-400">JPEG, PNG, or WEBP. Maximum 5 MB.</p>
            {previewUrl && (
              <p className="mt-1 text-xs font-semibold text-nu-blue">
                Preview: {imageFile.name}. It will be uploaded when you save.
              </p>
            )}
            {fieldErrors.image && <p className={fieldErrorClasses}>{fieldErrors.image}</p>}

            <div className="mt-3 flex flex-wrap gap-2">
              {imageFile && (
                <Button type="button" variant="secondary" onClick={clearFileInput}>Clear Selection</Button>
              )}
              {!imageFile && hasUploadedImage && !removeImage && (
                <Button type="button" variant="secondary" onClick={handleRemoveCurrentImage}>Remove Current Image</Button>
              )}
              {removeImage && (
                <Button type="button" variant="secondary" onClick={() => setRemoveImage(false)}>Undo Remove</Button>
              )}
            </div>
            {removeImage && (
              <p className="mt-1 text-xs font-semibold text-red-600">The current image will be removed when you save.</p>
            )}
          </div>
        </div>
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
