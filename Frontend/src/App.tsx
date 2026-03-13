import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TemplateListPage from './pages/TemplateListPage'
import TemplateEditorPage from './pages/TemplateEditorPage'
import GeneratorPage from './pages/GeneratorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratorPage />} />
        <Route path="/templates" element={<TemplateListPage />} />
        <Route path="/templates/new" element={<TemplateEditorPage />} />
        <Route path="/templates/:id" element={<TemplateEditorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
