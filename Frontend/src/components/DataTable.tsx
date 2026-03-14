import { useState } from 'react'
import type { GenerateResponse } from '../types/template.types'

interface Props {
  data: GenerateResponse
}

export const DataTable = ({ data }: Props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  if (typeof data === 'string' || !data.length) return null

  const columns = Object.keys(data[0])
  const totalPages = Math.ceil(data.length / pageSize)
  
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = data.slice(startIndex, startIndex + pageSize)

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse bg-white/30 dark:bg-slate-900/30">
          <thead>
            <tr className="bg-slate-100/50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">#</th>
              {columns.map(col => (
                <th key={col} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.map((row: Record<string, any>, i: number) => (
              <tr key={i} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-400 dark:text-slate-500">{startIndex + i + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
            Page <span className="text-slate-900 dark:text-slate-200 font-bold">{currentPage}</span> of {totalPages}
          </div>

          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
