import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const EMPTY_FORM = {
  title: '',
  brand: '',
  category: '',
  price: '',
  discount_percentage: '',
  stock: '',
  rating: '',
  thumbnail: '',
  description: '',
}

export default function ProductModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title ?? '',
        brand: product.brand ?? '',
        category: product.category ?? '',
        price: product.price ?? '',
        discount_percentage: product.discount_percentage ?? '',
        stock: product.stock ?? '',
        rating: product.rating ?? '',
        thumbnail: product.thumbnail ?? '',
        description: product.description ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [product])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price'
    if (form.stock !== '' && Number(form.stock) < 0) next.stock = 'Stock cannot be negative'
    if (form.discount_percentage !== '' && (Number(form.discount_percentage) < 0 || Number(form.discount_percentage) > 100))
      next.discount_percentage = 'Must be between 0 and 100'
    if (form.rating !== '' && (Number(form.rating) < 0 || Number(form.rating) > 5))
      next.rating = 'Must be between 0 and 5'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        brand: form.brand.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
        price: Number(form.price) || 0,
        discount_percentage: Number(form.discount_percentage) || 0,
        stock: Number(form.stock) || 0,
        rating: Number(form.rating) || 0,
        images: form.thumbnail ? [form.thumbnail.trim()] : [],
      })
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-500/20'
  const label = 'mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300'
  const errorText = 'mt-1 text-xs text-rose-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={label}>Title *</label>
            <input className={field} value={form.title} onChange={(e) => update('title', e.target.value)} />
            {errors.title && <p className={errorText}>{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Brand</label>
              <input className={field} value={form.brand} onChange={(e) => update('brand', e.target.value)} />
            </div>
            <div>
              <label className={label}>Category</label>
              <input className={field} value={form.category} onChange={(e) => update('category', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={label}>Price *</label>
              <input
                type="number"
                step="0.01"
                className={field}
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
              />
              {errors.price && <p className={errorText}>{errors.price}</p>}
            </div>
            <div>
              <label className={label}>Discount %</label>
              <input
                type="number"
                step="0.01"
                className={field}
                value={form.discount_percentage}
                onChange={(e) => update('discount_percentage', e.target.value)}
              />
              {errors.discount_percentage && <p className={errorText}>{errors.discount_percentage}</p>}
            </div>
            <div>
              <label className={label}>Stock</label>
              <input type="number" className={field} value={form.stock} onChange={(e) => update('stock', e.target.value)} />
              {errors.stock && <p className={errorText}>{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                className={field}
                value={form.rating}
                onChange={(e) => update('rating', e.target.value)}
              />
              {errors.rating && <p className={errorText}>{errors.rating}</p>}
            </div>
            <div>
              <label className={label}>Image URL</label>
              <input className={field} value={form.thumbnail} onChange={(e) => update('thumbnail', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea
              rows={3}
              className={field}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
