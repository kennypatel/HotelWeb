import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Badge from '../components/ui/Badge'
import ScoreBadge from '../components/ui/ScoreBadge'
import { companies } from '../data/mockData'
import { Search, Filter, Plus, ExternalLink, Users, MoreHorizontal, Globe, Building2 } from 'lucide-react'

const statusVariant = { active: 'green', prospect: 'blue', inactive: 'gray' }

const industryColors = {
  'Fintech': 'text-green-400',
  'CRM / SaaS': 'text-blue-400',
  'Productivity': 'text-purple-400',
  'Design Tools': 'text-pink-400',
  'Marketing': 'text-orange-400',
  'Developer Tools': 'text-cyan-400',
  'Project Management': 'text-yellow-400',
}

function CompanyLogo({ name }) {
  const initials = name.slice(0, 2).toUpperCase()
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-red-500']
  const color = colors[name.length % colors.length]
  return (
    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

export default function Companies() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <Layout title="Companies" subtitle={`${companies.length} accounts`}>
      <div className="flex h-full">
        {/* Filter sidebar */}
        <div className="w-48 shrink-0 border-r border-white/5 p-3 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Views</p>
          {['All Companies', 'My Accounts', 'Active', 'Prospects', 'Inactive'].map(f => (
            <button key={f} className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5">
              {f}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Filters</p>
            {['Industry', 'Company Size', 'Revenue', 'Location', 'Technologies'].map(f => (
              <button key={f} className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-between group">
                {f}
                <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input w-full pl-8 h-8 text-xs"
                placeholder="Search companies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-secondary h-8 px-3 text-xs">
              <Filter size={13} /> Filter
            </button>
            <div className="ml-auto">
              <button className="btn-primary h-8 px-3 text-xs">
                <Plus size={13} /> Add Company
              </button>
            </div>
          </div>

          {/* Grid of company cards */}
          <div className="flex-1 overflow-auto p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
              {filtered.map(company => (
                <div
                  key={company.id}
                  className="card hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(company.id)}
                        onChange={() => toggleSelect(company.id)}
                        className="rounded border-white/20 bg-white/5 accent-apollo-purple mt-0.5"
                      />
                      <CompanyLogo name={company.name} />
                      <div>
                        <h3 className="text-white font-semibold text-sm group-hover:text-apollo-purple-light transition-colors">
                          {company.name}
                        </h3>
                        <a href="#" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
                          <Globe size={10} />
                          {company.domain}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={company.score} />
                      <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10">
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div>
                      <span className="text-slate-500">Industry</span>
                      <p className={`font-medium mt-0.5 ${industryColors[company.industry] || 'text-slate-300'}`}>
                        {company.industry}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Employees</span>
                      <p className="text-slate-300 font-medium mt-0.5">{company.employees}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Revenue</span>
                      <p className="text-slate-300 font-medium mt-0.5">{company.revenue}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Location</span>
                      <p className="text-slate-300 font-medium mt-0.5 truncate">{company.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Users size={12} />
                      <span>{company.contacts} contacts</span>
                    </div>
                    <Badge variant={statusVariant[company.status]}>{company.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
