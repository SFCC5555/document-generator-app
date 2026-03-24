import { Navigate, Route, Routes } from "react-router-dom"
import CasesListPage from "./pages/CasesListPage"
import CaseDetailPage from "./pages/CaseDetailPage"
import CreateCasePage from "./pages/CreateCasePage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CasesListPage />} />
      <Route path="/cases/new" element={<CreateCasePage />} />
      <Route path="/cases/:caseId" element={<CaseDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
