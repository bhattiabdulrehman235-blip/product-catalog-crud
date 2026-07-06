import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { PackageX } from 'lucide-react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import ConfirmDialog from './components/ConfirmDialog'
import Pagination from './components/Pagination'
import { useDarkMode } from './lib/useDarkMode'
import { createProduct, deleteProduct, fetchCategories, fetchProducts, updateProduct } from './lib/api'

const PAGE_SIZE = 12

export default function App() {
  const [isDark, setIsDark] = useDarkMode()

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        category,
      })
      setProducts(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, category])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])

  function openAddModal() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  async function handleSubmit(payload) {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product added')
      }
      setModalOpen(false)
      loadProducts()
      fetchCategories().then(setCategories).catch(() => {})
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return
    setDeleteLoading(true)
    try {
      await deleteProduct(deletingProduct.id)
      toast.success('Product deleted')
      setDeletingProduct(null)
      if (products.length === 1 && page > 1) {
        setPage((p) => p - 1)
      } else {
        loadProducts()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete product')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Toaster position="top-right" />
      <Navbar isDark={isDark} onToggleDark={setIsDark} onAdd={openAddModal} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SearchBar search={search} onSearch={setSearch} category={category} onCategory={setCategory} categories={categories} />

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {loading ? 'Loading products...' : `${total} product${total === 1 ? '' : 's'} found`}
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}. Is the backend running on port 8000?
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
            <PackageX size={40} />
            <p>No products match your filters.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditModal}
                onDelete={setDeletingProduct}
              />
            ))}
          </div>
        )}

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </main>

      {modalOpen && (
        <ProductModal product={editingProduct} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}

      {deletingProduct && (
        <ConfirmDialog
          product={deletingProduct}
          onCancel={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
