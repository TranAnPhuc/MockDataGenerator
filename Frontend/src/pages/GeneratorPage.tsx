import { useState, useCallback } from 'react'
import { FieldRow } from '../components/FieldRow'
import { DataTable } from '../components/DataTable'
import { SavedTemplatesSidebar } from '../components/SavedTemplatesSidebar'
import { generateService } from '../services/generateService'
import type { FieldConfig, GenerateResponse, DataType } from '../types/template.types'
import styles from './GeneratorPage.module.css'

const createField = (): FieldConfig => ({
  id: crypto.randomUUID(),
  columnName: '',
  dataType: 'Name',
})

const GeneratorPage = () => {
  const [fields, setFields] = useState<FieldConfig[]>([createField()])
  const [rowCount, setRowCount] = useState(10)
  const [formatType, setFormatType] = useState<'json' | 'csv' | 'sql'>('json')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')

  // ── field mutations ────────────────────────────────────────────────
  const addField = () => setFields(prev => [...prev, createField()])

  const deleteField = useCallback(
    (id: string) => setFields(prev => prev.filter(f => f.id !== id)),
    [],
  )

  const changeField = useCallback(
    (id: string, key: keyof Omit<FieldConfig, 'id'>, value: string) =>
      setFields(prev =>
        prev.map(f => (f.id === id ? { ...f, [key]: value } : f)),
      ),
    [],
  )

  // ── generate ───────────────────────────────────────────────────────
  const handleGenerate = async () => {
    const validFields = fields.filter(f => f.columnName.trim() !== '')
    if (validFields.length === 0) {
      setError('Vui lòng thêm ít nhất một trường dữ liệu hợp lệ.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await generateService.generate({
        fields: validFields.map(({ columnName, dataType, regexPattern }) => ({ columnName, dataType, regexPattern })),
        rowCount: Math.max(1, rowCount),
        formatType,
      })
      
      if (formatType === 'json') {
        setResult(data)
      } else {
        // Handle file download directly for CSV/SQL
        const blob = new Blob([data as string], { 
          type: formatType === 'csv' ? 'text/csv' : 'application/sql' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mock-data-${Date.now()}.${formatType}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Không thể kết nối tới API. Vui lòng kiểm tra backend.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── download JSON ──────────────────────────────────────────────────
  const handleDownloadJSON = () => {
    if (!result || typeof result === 'string') return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mock-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setError('Vui lòng nhập tên mẫu.')
      return
    }
    try {
      await generateService.saveTemplate({
        templateName,
        schemaConfig: JSON.stringify(fields)
      })
      alert('Đã lưu mẫu thành công!')
    } catch (err) {
      setError('Lỗi khi lưu mẫu.')
    }
  }

  const handleLoadTemplate = (schemaConfig: string, name: string) => {
    try {
      const loadedFields = JSON.parse(schemaConfig).map((f: any) => ({
        ...f,
        id: f.id || crypto.randomUUID()
      }))
      setFields(loadedFields)
      setTemplateName(name)
      setError(null)
    } catch (err) {
      setError('Lỗi khi tải mẫu: Dữ liệu không hợp lệ.')
    }
  }

  return (
    <div className={styles.layout}>
      <SavedTemplatesSidebar onLoadTemplate={handleLoadTemplate} />
      <div className={styles.page}>
      {/* ── Header ─────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoDot} />
            Mock Data Generator
          </div>
          <p className={styles.subtitle}>Tạo dữ liệu mẫu nhanh chóng cho ứng dụng của bạn</p>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── Configuration Card ─────────────────────── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <span className={styles.stepBadge}>1</span>
              Cấu hình trường dữ liệu
            </h2>
            <div className={styles.templateActions}>
              <input 
                type="text" 
                placeholder="Tên mẫu..." 
                className={styles.templateInput} 
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
              />
              <button className={styles.saveBtn} onClick={handleSaveTemplate}>Lưu mẫu</button>
            </div>
            <span className={styles.fieldCount}>{fields.length} trường</span>
          </div>

          {/* Column labels */}
          <div className={styles.columnLabels}>
            <span />
            <span>Tên cột</span>
            <span>Loại dữ liệu & Regex</span>
            <span />
          </div>

          {/* Dynamic rows */}
          <div className={styles.fieldList}>
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field}
                index={index}
                onChange={changeField}
                onDelete={deleteField}
                canDelete={fields.length > 1}
              />
            ))}
          </div>

          <button className={styles.addBtn} onClick={addField}>
            <span className={styles.addIcon}>＋</span>
            Thêm trường dữ liệu
          </button>
        </section>

        {/* ── Row Count + Generate ────────────────────── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <span className={styles.stepBadge}>2</span>
              Tuỳ chọn tạo dữ liệu
            </h2>
          </div>

          <div className={styles.generateRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="rowCount">
                Số lượng dòng
              </label>
              <input
                id="rowCount"
                className={styles.numberInput}
                type="number"
                min={1}
                max={10000}
                value={rowCount}
                onChange={e => setRowCount(Number(e.target.value))}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="formatType">
                Định dạng
              </label>
              <select
                id="formatType"
                className={styles.formatSelect}
                value={formatType}
                onChange={e => setFormatType(e.target.value as any)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="sql">SQL (Insert)</option>
              </select>
            </div>

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Tạo dữ liệu
                </>
              )}
            </button>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}
        </section>

        {/* ── Result ─────────────────────────────────── */}
        {result && typeof result !== 'string' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepBadge}>3</span>
                Kết quả — {result.length} dòng
              </h2>
              <button className={styles.downloadBtn} onClick={handleDownloadJSON}>
                ⬇ Tải xuống JSON
              </button>
            </div>

            <DataTable data={result} />
          </section>
        )}
      </main>
    </div>
    </div>
  )
}

export default GeneratorPage
