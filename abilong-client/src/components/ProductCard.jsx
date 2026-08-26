import Button from './Button';
import { resolveProductImage } from '../lib/productImages';

const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;

const ProductCard = ({ product }) => {
  const image = resolveProductImage(product.images);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-200 hover:shadow-lg hover:-translate-y-0.5">

      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-zinc-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
        )}
      </div>


      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">
          {product.category?.name}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-zinc-900">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-base font-extrabold text-nu-blue">{formatPrice(product.price)}</p>
          <Button to={`/products/${product._id}`} variant="primary">View</Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
