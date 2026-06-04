import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { creditUsage } from '../data/mockData'
import { Zap, Upload, Search, CheckCircle, AlertCircle, Clock, Download, Plus } from 'lucide-react'

const recentEnrichments = [
  { id: 1, name: 'Stripe Executive List', type: 'bulk', count: 234, status: 'completed', date: 'Jan 23, 2024', matched: 198 },
  { id: 2, name: 'SaaS CTOs Q1', type: 'bulk', count: 87, status: 'completed', date: 'Jan 22, 2024', matched: 79 },
  { id: 3, name: 'Manual Lookup - Sarah Chen', type: 'single', count: 1, status: 'completed', date: 'Jan 22, 2024', matched: 1 },
  { id: 4, name: 'Tech Startup Founders', type: 'bulk', count: 512, status: 'processing', date: 'Jan 24, 2024', matched: 341 },
  { id: 5, name: 'Enterprise Decision Makers', type: 'bulk', count: 1024, status: 'failed', date: 'Jan 21, 2024', matched: 0 },
]

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Completed' },
  processing: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Processing' },
  failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
}

export default function Enrichment() {
  const [tab, setTab] = useState('bulk')
  const [email, setEmail] = useState('')
  const usedPct = (creditUsage.used / creditUsage.total) * 100

  return (
    <Layout title="Enrichment" subtitle="Enrich contact and company data">
      <div className="p-6 space-y-6">
        {/* Credits */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 card">
            <p className="text-xs text-slate-500 mb-2">Credits Remaining</p>
            <p className="text-2xl font-bold text-white mb-2">{(creditUsage.total - creditUsage.used).toLocaleString()}</p>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-apollo-purple rounded-full" style={{ width: `${usedPct}%` }} />
            </div>
            <p className="text-xs text-slate-500">{creditUsage.used.toLocaleString()} / {creditUsage.total.toLocaleString()} used</p>
          </div>
          {[
            { label: 'Email Lookups', value: creditUsage.emailFinder, color: '#6366f1' },
            { label: 'Contact Exports', value: creditUsage.exports, color: '#10b981' },
            { label: 'Enrichments', value: creditUsage.enrichments, color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} className="card">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">credits used</p>
            </div>
          ))}
        </div>

        {/* Enrichment tool */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Enrich Data</h3>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10 w-fit mb-5">
            {[
              { id: 'bulk', label: 'Bulk Upload' },
              { id: 'single', label: 'Single Lookup' },
              { id: 'api', label: 'API' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  tab === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'bulk' && (
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer group">
              <Upload size={24} className="mx-auto mb-3 text-slate-500 group-hover:text-slate-400 transition-colors" />
              <p className="text-white font-medium mb-1">Upload CSV file</p>
              <p className="text-slate-500 text-sm mb-4">Drag and drop or click to browse. Supports up to 50,000 rows.</p>
              <button className="btn-primary mx-auto">
                <Upload size={14} /> Choose File
              </button>
              <p className="text-xs text-slate-600 mt-3">1 credit per enriched contact</p>
            </div>
          )}

          {tab === 'single' && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input flex-1"
                  />
                  <button className="btn-primary px-4">
                    <Search size={14} /> Lookup
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500">Or search by name + company:</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="First name" className="input" />
                <input type="text" placeholder="Last name" className="input" />
                <input type="text" placeholder="Company" className="input col-span-2" />
              </div>
              <button className="btn-primary w-full justify-center">
                <Zap size={14} /> Enrich Contact
              </button>
            </div>
          )}

          {tab === 'api' && (
            <div className="space-y-4 max-w-xl">
              <div className="bg-apollo-navy rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-mono">Your API Key</span>
                  <button className="text-xs text-apollo-purple-light hover:text-white transition-colors">Regenerate</button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-green-400">ap_k3y_••••••••••••••••••••••••••••••••</code>
                  <button className="btn-secondary text-xs h-7 px-2.5">Copy</button>
                </div>
              </div>
              <div className="bg-apollo-navy rounded-xl border border-white/10 p-4">
                <p className="text-xs text-slate-500 mb-2 font-mono">Example Request</p>
                <pre className="text-xs text-green-400 font-mono overflow-auto">{`POST https://api.apollo.io/v1/people/match
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "email": "contact@company.com",
  "reveal_personal_emails": true
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Recent enrichments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Enrichments</h3>
            <button className="btn-secondary h-7 px-3 text-xs">
              <Plus size={12} /> New
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Type', 'Records', 'Matched', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left py-2 text-xs font-medium text-slate-500 uppercase tracking-wider pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEnrichments.map(e => {
                const config = statusConfig[e.status]
                const Icon = config.icon
                return (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4 text-white font-medium">{e.name}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${e.type === 'bulk' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{e.count.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-slate-300">{e.matched > 0 ? `${e.matched} (${Math.round(e.matched/e.count*100)}%)` : '—'}</td>
                    <td className="py-3 pr-4">
                      <div className={`inline-flex items-center gap-1.5 text-xs ${config.color}`}>
                        <Icon size={12} />
                        {config.label}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{e.date}</td>
                    <td className="py-3">
                      {e.status === 'completed' && (
                        <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <Download size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
