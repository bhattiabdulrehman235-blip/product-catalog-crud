import { Pencil, Star, Trash2 } from 'lucide-react'

export default function ProductCard({ product, onEdit, onDelete }) {
  const discountedPrice = (
    product.price * (1 - (product.discount_percentage || 0) / 100)
  ).toFixed(2)
  const hasDiscount = product.discount_percentage > 0

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
            -{Math.round(product.discount_percentage)}%
          </span>
        )}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(product)}
            aria-label="Edit product"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow hover:bg-white"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(product)}
            aria-label="Delete product"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-600 shadow hover:bg-white"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {product.category || 'Uncategorized'}
          </span>
          <span className="flex items-center gap-0.5 text-xs font-medium text-amber-500">
            <Star size={12} fill="currentColor" />
            {product.rating?.toFixed(1)}
          </span>
        </div>

        <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white" title={product.title}>
          {product.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">${discountedPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  )
}
