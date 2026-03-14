import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateService } from '../services/generateService'

interface SidebarProps {
  onLoadTemplate: (schemaConfig: string, name: string) => void
}

export const SavedTemplatesSidebar = ({ onLoadTemplate }: SidebarProps) => {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const data = await generateService.getTemplates()
      setTemplates(data)
    } catch (err) {
      console.error(t('sidebar.loadError'), err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="glass-panel p-6 h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0">
            {t('sidebar.title')}
          </h3>
          <button 
            onClick={fetchTemplates} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all text-sm" 
            title={t('sidebar.refresh')}
          >
            🔄
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {templates.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-400">{t('sidebar.empty')}</p>
              </div>
            ) : (
              templates.map(t => (
                <button 
                  key={t.id} 
                  className="flex flex-col gap-1 p-4 text-left rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group"
                  onClick={() => onLoadTemplate(t.schemaConfig, t.templateName)}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {t.templateName}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                    {new Date(t.createdDate).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
