import { resolveProductImage } from '../lib/productImages';

const ProductThumbnail = ({ product }) => {
  const image = resolveProductImage(product);

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
      {image ? (
        <img src={image} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">No image</span>
      )}
    </div>
  );
};

export default ProductThumbnail;
