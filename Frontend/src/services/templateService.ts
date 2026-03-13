import axios from 'axios'
import type { Template, CreateTemplateDto, UpdateTemplateDto } from '../types/template.types'

const BASE = '/api/templates'

export const templateService = {
  getAll: () =>
    axios.get<Template[]>(BASE).then(r => r.data),

  getById: (id: number) =>
    axios.get<Template>(`${BASE}/${id}`).then(r => r.data),

  create: (dto: CreateTemplateDto) =>
    axios.post<Template>(BASE, dto).then(r => r.data),

  update: (id: number, dto: UpdateTemplateDto) =>
    axios.put<Template>(`${BASE}/${id}`, dto).then(r => r.data),

  delete: (id: number) =>
    axios.delete(`${BASE}/${id}`),
}
