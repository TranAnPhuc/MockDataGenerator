// Domain types mirroring the backend models

export interface Template {
  id: number
  templateName: string
  schemaConfig: string          // raw JSON string from API
  createdDate: string           // ISO 8601 date string
}

export interface ColumnDefinition {
  columnName: string
  dataType: 'int' | 'string' | 'datetime' | 'boolean' | 'float' | 'guid'
  generator: string             // e.g. "fullName", "email", "autoIncrement"
  nullable?: boolean
  options?: Record<string, unknown>
}

export type CreateTemplateDto = Omit<Template, 'id' | 'createdDate'>
export type UpdateTemplateDto = Partial<CreateTemplateDto>

// ─── Generate API ───────────────────────────────────────────────────────────

export type DataType = 
  | 'Name' | 'Email' | 'Phone' | 'Address' | 'Date' | 'DateTime'
  | 'Custom Regex' | 'Custom List' | 'Avatar' | 'ProductName' | 'Price'
  | 'CreditCard' | 'Company' | 'JobTitle' | 'Department' | 'Guid'
  | 'Integer' | 'Decimal' | 'Boolean' | 'IPv4' | 'MACAddress'

export interface FieldConfig {
  /** Internal UI-only identifier */
  id: string
  columnName: string
  dataType: DataType
  regexPattern?: string
  customListOptions?: string
}

export interface GenerateRequest {
  fields: Array<Omit<FieldConfig, 'id'>>
  rowCount: number
  formatType: 'json' | 'csv' | 'sql'
  generationLocale?: string
}

/** The API returns an array of plain objects for JSON, or a string for CSV/SQL */
export type GenerateResponse = Record<string, any>[] | string
