import { Moon, Plus, Sun, PackageSearch } from 'lucide-react'

export default function Navbar({ isDark, onToggleDark, onAdd }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <PackageSearch size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Product Catalog</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by DummyJSON &middot; FastAPI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
          <button
            onClick={() => onToggleDark(!isDark)}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
