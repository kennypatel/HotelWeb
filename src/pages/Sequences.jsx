import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Badge from '../components/ui/Badge'
import { sequences } from '../data/mockData'
import { Plus, Search, Play, Pause, MoreHorizontal, Mail, Users, TrendingUp, MessageSquare, Calendar } from 'lucide-react'

const statusVariant = { active: 'green', paused: 'yellow', draft: 'gray' }
const statusIcon = { active: Play, paused: Pause, draft: Mail }

function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{value}%</span>
    </div>
  )
}

export default function Sequences() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Sequences', count: sequences.length },
    { id: 'active', label: 'Active', count: sequences.filter(s => s.status === 'active').length },
    { id: 'paused', label: 'Paused', count: sequences.filter(s => s.status === 'paused').length },
    { id: 'draft', label: 'Draft', count: sequences.filter(s => s.status === 'draft').length },
  ]

  const filtered = sequences.filter(s =>
    (activeTab === 'all' || s.status === activeTab) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="Sequences" subtitle="Automated email campaigns">
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Sequences', value: sequences.filter(s => s.status === 'active').length, icon: Play, color: 'text-green-400 bg-green-500/10' },
            { label: 'Total Contacts', value: sequences.reduce((a, s) => a + s.contacts, 0).toLocaleString(), icon: Users, color: 'text-blue-400 bg-blue-500/10' },
            { label: 'Avg Open Rate', value: `${Math.round(sequences.filter(s => s.contacts > 0).reduce((a, s) => a + s.openRate, 0) / sequences.filter(s => s.contacts > 0).length)}%`, icon: TrendingUp, color: 'text-purple-400 bg-purple-500/10' },
            { label: 'Meetings Booked', value: sequences.reduce((a, s) => a + s.meetings, 0), icon: Calendar, color: 'text-orange-400 bg-orange-500/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs">{label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={13} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-apollo-purple text-white' : 'bg-white/10 text-slate-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input pl-8 h-8 w-56 text-xs"
              placeholder="Search sequences..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary h-8 px-3 text-xs">
            <Plus size={13} /> New Sequence
          </button>
        </div>

        {/* Sequence cards */}
        <div className="space-y-3">
          {filtered.map(seq => {
            const StatusIcon = statusIcon[seq.status]
            return (
              <div key={seq.id} className="card hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    seq.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    seq.status === 'paused' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-white/5 text-slate-500'
                  }`}>
                    <StatusIcon size={16} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium text-sm group-hover:text-apollo-purple-light transition-colors">
                        {seq.name}
                      </h3>
                      <Badge variant={statusVariant[seq.status]}>{seq.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail size={11} /> {seq.steps} steps</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {seq.contacts} contacts</span>
                      <span>Created {seq.created}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Open Rate</p>
                      {seq.contacts > 0 ? (
                        <ProgressBar value={seq.openRate} max={100} color="#6366f1" />
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Reply Rate</p>
                      {seq.contacts > 0 ? (
                        <ProgressBar value={seq.replyRate} max={100} color="#10b981" />
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Meetings</p>
                      <p className="text-lg font-bold text-white">{seq.meetings}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      {seq.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
