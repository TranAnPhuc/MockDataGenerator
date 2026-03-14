import { useState } from 'react'
import type { GenerateResponse } from '../types/template.types'
import styles from './DataTable.module.css'

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              {columns.map(col => (
                <th key={col} className={styles.th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row: Record<string, any>, i: number) => (
              <tr key={i} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td className={styles.td}>{startIndex + i + 1}</td>
                {columns.map(col => (
                  <td key={col} className={styles.td}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className={styles.pageInfo}>
            Page <strong>{currentPage}</strong> of {totalPages}
          </div>

          <button 
            className={styles.pageBtn}
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
