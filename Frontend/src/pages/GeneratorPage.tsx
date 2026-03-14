import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldRow } from '../components/FieldRow'
import { DataTable } from '../components/DataTable'
import { SavedTemplatesSidebar } from '../components/SavedTemplatesSidebar'
import { generateService } from '../services/generateService'
import type { FieldConfig, GenerateResponse } from '../types/template.types'

const createField = (): FieldConfig => ({
  id: crypto.randomUUID(),
  columnName: '',
  dataType: 'Name',
})

interface Props {
  theme?: string
  toggleTheme?: () => void
}

const GeneratorPage = ({ theme, toggleTheme }: Props) => {
  const { t, i18n } = useTranslation()
  const [fields, setFields] = useState<FieldConfig[]>([createField()])
  const [rowCount, setRowCount] = useState(10)
  const [formatType, setFormatType] = useState<'json' | 'csv' | 'sql'>('json')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [sqlScript, setSqlScript] = useState('')
  const [isSqlMode, setIsSqlMode] = useState(false)
  const [dbDialect, setDbDialect] = useState('sqlserver')

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

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
      setError(t('messages.atLeastOneField'))
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await generateService.generate({
        fields: validFields.map(({ columnName, dataType, regexPattern, customListOptions }) => ({ 
          columnName, 
          dataType, 
          regexPattern,
          customListOptions
        })),
        rowCount: Math.max(1, rowCount),
        formatType,
        generationLocale: i18n.language.startsWith('zh') ? 'zh_TW' : 
                i18n.language.startsWith('vi') ? 'vi' : 'en'
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
        err instanceof Error ? err.message : t('messages.apiError')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateFromSql = async () => {
    if (!sqlScript.trim()) {
      setError(t('messages.enterSqlScript'))
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await generateService.generateFromSql({
        sqlScript,
        rowCount: Math.max(1, rowCount),
        formatType,
        dbDialect,
      })
      
      if (formatType === 'json') {
        setResult(data)
      } else {
        const blob = new Blob([data as string], { 
          type: formatType === 'csv' ? 'text/csv' : 'application/sql' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mock-data-sql-${Date.now()}.${formatType}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('messages.apiError')
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
      setError(t('messages.enterTemplateName'))
      return
    }
    try {
      await generateService.saveTemplate({
        templateName,
        schemaConfig: JSON.stringify(fields)
      })
      alert(t('messages.saveSuccess'))
    } catch (err) {
      setError(t('messages.saveError'))
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
      setError(t('messages.loadError'))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SavedTemplatesSidebar onLoadTemplate={handleLoadTemplate} />
          
          <div className="flex-1 space-y-8">
            {/* ── Header ─────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/50" />
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-300 mb-0">
                    {t('common.logo')}
                  </h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('common.subtitle')}</p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all shadow-sm"
                  onClick={toggleTheme} 
                  title="Toggle Theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <div className="relative">
                  <select 
                    value={i18n.language} 
                    onChange={handleLanguageChange}
                    className="appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="zh-tw">繁體中文</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </header>

            <main className="space-y-8">
              <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl w-fit">
                <button 
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isSqlMode ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  onClick={() => setIsSqlMode(false)}
                >
                  Custom Fields
                </button>
                <button 
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${isSqlMode ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  onClick={() => setIsSqlMode(true)}
                >
                  SQL Create Table
                </button>
              </div>

              {!isSqlMode ? (
                <section className="glass-panel p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">1</span>
                      <h2 className="text-xl font-bold dark:text-white mb-0">{t('setup.title')}</h2>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder={t('setup.templateName')} 
                        className="input-field py-2 max-w-[200px]" 
                        value={templateName}
                        onChange={e => setTemplateName(e.target.value)}
                      />
                      <button className="btn-primary py-2 px-4 text-sm" onClick={handleSaveTemplate}>{t('setup.saveTemplate')}</button>
                    </div>
                  </div>

                  {/* Column labels - Hidden on mobile */}
                  <div className="hidden md:grid grid-cols-[3rem_1fr_1fr_3rem] gap-4 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <span>#</span>
                    <span>{t('setup.columnName')}</span>
                    <span>{t('setup.dataType')}</span>
                    <span className="text-right">Action</span>
                  </div>

                  <div className="space-y-4">
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

                  <button 
                    className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:opacity-80 transition-all"
                    onClick={addField}
                  >
                    <span className="text-xl">＋</span>
                    {t('setup.addField')}
                  </button>
                </section>
              ) : (
                <section className="glass-panel p-8">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">1</span>
                      <h2 className="text-xl font-bold dark:text-white mb-0">{t('setup.sqlTitle') || 'SQL Create Table'}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Dialect:</label>
                      <select 
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        value={dbDialect}
                        onChange={e => setDbDialect(e.target.value)}
                      >
                        <option value="sqlserver">SQL Server</option>
                        <option value="mysql">MySQL</option>
                        <option value="mariadb">MariaDB</option>
                        <option value="postgresql">PostgreSQL</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    className="input-field h-64 font-mono text-sm"
                    placeholder="CREATE TABLE Users (Id INT, FullName NVARCHAR(100), ...)"
                    value={sqlScript}
                    onChange={e => setSqlScript(e.target.value)}
                  />
                </section>
              )}

              {/* ── Row Count + Generate ────────────────────── */}
              <section className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">2</span>
                  <h2 className="text-xl font-bold dark:text-white mb-0">{t('options.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300" htmlFor="rowCount">
                      {t('options.rowCount')}
                    </label>
                    <input
                      id="rowCount"
                      className="input-field"
                      type="number"
                      min={1}
                      max={10000}
                      value={rowCount}
                      onChange={e => setRowCount(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300" htmlFor="formatType">
                      {t('options.format')}
                    </label>
                    <select
                      id="formatType"
                      className="input-field"
                      value={formatType}
                      onChange={e => setFormatType(e.target.value as any)}
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="sql">SQL (Insert)</option>
                    </select>
                  </div>

                  <button
                    className="btn-primary flex items-center justify-center h-[50px]"
                    onClick={isSqlMode ? handleGenerateFromSql : handleGenerate}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('common.generating')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        {t('common.generate')}
                      </div>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3">
                    <span className="text-lg">⚠️</span> {error}
                  </div>
                )}
              </section>

              {/* ── Result ─────────────────────────────────── */}
              {result && typeof result !== 'string' && (
                <section className="glass-panel p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">3</span>
                      <h2 className="text-xl font-bold dark:text-white mb-0">
                        {t('results.title', { count: result.length })}
                      </h2>
                    </div>
                    <button className="btn-primary py-2 px-6 flex items-center gap-2" onClick={handleDownloadJSON}>
                      <span>⬇</span> {t('common.downloadJson')}
                    </button>
                  </div>

                  <DataTable data={result} />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratorPage
