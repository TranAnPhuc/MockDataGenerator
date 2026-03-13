import type { FieldConfig, DataType } from '../types/template.types'
import { useTranslation } from 'react-i18next'
import styles from './FieldRow.module.css'

const DATA_TYPES: DataType[] = ['Name', 'Email', 'Phone', 'Address', 'Date', 'Custom Regex']

interface Props {
  field: FieldConfig
  index: number
  onChange: (id: string, key: keyof Omit<FieldConfig, 'id'>, value: string) => void
  onDelete: (id: string) => void
  canDelete: boolean
}

export const FieldRow = ({ field, index, onChange, onDelete, canDelete }: Props) => {
  const { t } = useTranslation()
  return (
    <div className={styles.row}>
      <span className={styles.index}>{index + 1}</span>

      <input
        className={styles.input}
        type="text"
        placeholder={t('options.placeholders.columnName')}
        value={field.columnName}
        onChange={e => onChange(field.id, 'columnName', e.target.value)}
      />

    <div className={styles.typeGroup}>
      <select
        className={styles.select}
        value={field.dataType}
        onChange={e => onChange(field.id, 'dataType', e.target.value as DataType)}
      >
        {DATA_TYPES.map(dt => (
          <option key={dt} value={dt}>
            {dt}
          </option>
        ))}
      </select>

      {field.dataType === 'Custom Regex' && (
        <input
          className={styles.regexInput}
          type="text"
          placeholder={t('options.placeholders.regex')}
          value={field.regexPattern || ''}
          onChange={e => onChange(field.id, 'regexPattern', e.target.value)}
        />
      )}
    </div>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(field.id)}
        disabled={!canDelete}
        title={t('setup.deleteRow')}
        aria-label="delete row"
      >
        ✕
      </button>
    </div>
  )
}
