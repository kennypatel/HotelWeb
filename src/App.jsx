import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import People from './pages/People'
import Companies from './pages/Companies'
import Sequences from './pages/Sequences'
import Tasks from './pages/Tasks'
import Meetings from './pages/Meetings'
import Analytics from './pages/Analytics'
import Conversations from './pages/Conversations'
import Settings from './pages/Settings'
import Enrichment from './pages/Enrichment'
import SearchPage from './pages/SearchPage'
import Calls from './pages/Calls'

function Placeholder({ name }) {
  return (
    <div className="flex-1 flex items-center justify-center text-slate-500 p-12">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center text-2xl">
          📋
        </div>
        <p className="text-white font-semibold text-lg">{name}</p>
        <p className="text-slate-500 text-sm mt-1">Page coming soon</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/people" element={<People />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/sequences" element={<Sequences />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/enrichment" element={<Enrichment />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Placeholder name="Notifications" />} />
        <Route path="/credits" element={<Placeholder name="Credits & Usage" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
