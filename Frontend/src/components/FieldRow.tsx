import type { FieldConfig, DataType } from '../types/template.types'
import { useTranslation } from 'react-i18next'
import styles from './FieldRow.module.css'

const DATA_TYPES: DataType[] = [
  'Name', 'Email', 'Phone', 'Address', 'Date', 'DateTime',
  'Custom Regex', 'Custom List', 'Avatar', 'ProductName', 'Price',
  'CreditCard', 'Company', 'JobTitle', 'Department', 'Guid',
  'Integer', 'Decimal', 'Boolean', 'IPv4', 'MACAddress'
]

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
        className="input-field"
        type="text"
        placeholder={t('options.placeholders.columnName')}
        value={field.columnName}
        onChange={e => onChange(field.id, 'columnName', e.target.value)}
      />

    <div className={styles.typeGroup}>
      <select
        className="input-field"
        style={{ width: 'auto', minWidth: '150px' }}
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
          className="input-field"
          type="text"
          placeholder={t('options.placeholders.regex')}
          value={field.regexPattern || ''}
          onChange={e => onChange(field.id, 'regexPattern', e.target.value)}
        />
      )}

      {field.dataType === 'Custom List' && (
        <input
          className="input-field"
          type="text"
          placeholder="e.g. Gold, Silver, Bronze"
          value={field.customListOptions || ''}
          onChange={e => onChange(field.id, 'customListOptions', e.target.value)}
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
