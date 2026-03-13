import { useEffect, useState } from 'react'
import { generateService } from '../services/generateService'
import styles from './SavedTemplatesSidebar.module.css'

interface SidebarProps {
  onLoadTemplate: (schemaConfig: string, name: string) => void
}

export const SavedTemplatesSidebar = ({ onLoadTemplate }: SidebarProps) => {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const data = await generateService.getTemplates()
      setTemplates(data)
    } catch (err) {
      console.error('Lỗi khi tải danh sách mẫu:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Mẫu đã lưu</h3>
        <button onClick={fetchTemplates} className={styles.refreshBtn}>🔄</button>
      </div>
      
      {loading ? (
        <p className={styles.loading}>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {templates.length === 0 ? (
            <p className={styles.empty}>Chưa có mẫu nào</p>
          ) : (
            templates.map(t => (
              <button 
                key={t.id} 
                className={styles.item}
                onClick={() => onLoadTemplate(t.schemaConfig, t.templateName)}
              >
                <div className={styles.itemName}>{t.templateName}</div>
                <div className={styles.itemDate}>{new Date(t.createdDate).toLocaleDateString()}</div>
              </button>
            ))
          )}
        </div>
      )}
    </aside>
  )
}
