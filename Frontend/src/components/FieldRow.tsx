import type { FieldConfig, DataType } from '../types/template.types'
import { useTranslation } from 'react-i18next'

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
    <div className="grid grid-cols-[3rem_1fr_1fr_3rem] gap-4 items-center bg-white/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 transition-all group">
      <span className="text-sm font-bold text-slate-400 dark:text-slate-500 text-center">{index + 1}</span>

      <input
        className="input-field py-2"
        type="text"
        placeholder={t('options.placeholders.columnName')}
        value={field.columnName}
        onChange={e => onChange(field.id, 'columnName', e.target.value)}
      />

      <div className="flex gap-2">
        <select
          className="input-field py-2"
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
            className="input-field py-2 flex-1"
            type="text"
            placeholder={t('options.placeholders.regex')}
            value={field.regexPattern || ''}
            onChange={e => onChange(field.id, 'regexPattern', e.target.value)}
          />
        )}

        {field.dataType === 'Custom List' && (
          <input
            className="input-field py-2 flex-1"
            type="text"
            placeholder="e.g. Gold, Silver, Bronze"
            value={field.customListOptions || ''}
            onChange={e => onChange(field.id, 'customListOptions', e.target.value)}
          />
        )}
      </div>

      <button
        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 bg-transparent rounded-lg border border-transparent hover:border-red-100 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-0"
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
