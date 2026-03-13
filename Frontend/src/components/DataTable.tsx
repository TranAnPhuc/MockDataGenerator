import type { GenerateResponse } from '../types/template.types'
import styles from './DataTable.module.css'

interface Props {
  data: GenerateResponse
}

export const DataTable = ({ data }: Props) => {
  if (typeof data === 'string' || !data.length) return null

  const columns = Object.keys(data[0])

  return (
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
          {data.map((row: Record<string, any>, i: number) => (
            <tr key={i} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td className={styles.td}>{i + 1}</td>
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
  )
}
