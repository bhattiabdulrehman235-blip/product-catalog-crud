import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-800 dark:text-slate-100">{page}</span> of {pageCount}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
