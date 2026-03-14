import axios from 'axios'
import type { GenerateRequest, GenerateResponse } from '../types/template.types'

/**
 * POST /api/generate
 * Sends the field configuration and desired row count to the backend.
 * Returns an array of generated records.
 */
export const generateService = {
  generate: (payload: GenerateRequest): Promise<GenerateResponse> =>
    axios
      .post<GenerateResponse>('/api/generate', payload)
      .then(r => r.data),

  getTemplates: (): Promise<any[]> =>
    axios.get('/api/templates').then(r => r.data),

  saveTemplate: (payload: any): Promise<any> =>
    axios.post('/api/templates', payload).then(r => r.data),

  generateFromSql: (payload: { sqlScript: string, rowCount: number, formatType: string, dbDialect: string }): Promise<GenerateResponse> =>
    axios.post<GenerateResponse>('/api/generate/sql', payload).then(r => r.data),
}
