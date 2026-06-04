import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import ScoreBadge from '../components/ui/ScoreBadge'
import { contacts, companies } from '../data/mockData'
import { Search, Filter, SlidersHorizontal, Users, Building2, Mail, Phone, Linkedin, Plus, Sparkles } from 'lucide-react'

const jobTitles = ['CEO', 'CTO', 'VP Engineering', 'VP Sales', 'Director', 'Head of Product', 'Engineering Manager']
const industries = ['SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'Developer Tools', 'Marketing']
const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Remote']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('people')
  const [selectedFilters, setSelectedFilters] = useState({ titles: [], industries: [], sizes: [], locations: [] })
  const [selected, setSelected] = useState([])

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }))
  }

  const filteredPeople = contacts.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.company.toLowerCase().includes(query.toLowerCase()) ||
    c.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Layout title="Search" subtitle="Find and prospect leads">
      <div className="flex h-full">
        {/* Filter panel */}
        <div className="w-64 shrink-0 border-r border-white/5 overflow-y-auto p-4 space-y-5">
          {/* AI Search */}
          <div className="card bg-gradient-to-br from-apollo-purple/15 to-indigo-900/10 border-apollo-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-apollo-purple-light" />
              <span className="text-xs font-medium text-apollo-purple-light">AI-Powered Search</span>
            </div>
            <input
              type="text"
              placeholder="Describe your ideal prospect..."
              className="input w-full text-xs h-8"
            />
            <button className="btn-primary w-full justify-center mt-2 text-xs h-7">
              <Sparkles size={12} /> Search with AI
            </button>
          </div>

          {[
            { label: 'Job Title', key: 'titles', options: jobTitles },
            { label: 'Industry', key: 'industries', options: industries },
            { label: 'Company Size', key: 'sizes', options: companySizes },
            { label: 'Location', key: 'locations', options: locations },
          ].map(({ label, key, options }) => (
            <div key={key}>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
              <div className="space-y-1">
                {options.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedFilters[key].includes(opt)}
                      onChange={() => toggleFilter(key, opt)}
                      className="rounded border-white/20 bg-white/5 accent-apollo-purple"
                    />
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {Object.values(selectedFilters).some(f => f.length > 0) && (
            <button
              onClick={() => setSelectedFilters({ titles: [], industries: [], sizes: [], locations: [] })}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input w-full pl-9 h-9"
                placeholder="Search by name, company, title, location..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setActiveTab('people')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === 'people' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Users size={13} /> People
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{filteredPeople.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === 'companies' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Building2 size={13} /> Companies
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{companies.length}</span>
              </button>
            </div>

            {selected.length > 0 && (
              <button className="btn-primary h-8 px-3 text-xs">
                <Plus size={13} /> Add {selected.length} to Sequence
              </button>
            )}
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'people' ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-apollo-navy/90 backdrop-blur-sm">
                  <tr className="border-b border-white/5">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 accent-apollo-purple" />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Person</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map(c => (
                    <tr key={c.id} className="table-row group">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(c.id)}
                          onChange={() => setSelected(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                          className="rounded border-white/20 bg-white/5 accent-apollo-purple"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={c.avatar} size="sm" />
                          <div>
                            <p className="text-white text-sm font-medium">{c.name}</p>
                            <p className="text-slate-500 text-xs">{c.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{c.company}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{c.location}</td>
                      <td className="px-4 py-3"><ScoreBadge score={c.score} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {c.linkedin && <Linkedin size={12} className="text-blue-400" />}
                          <Mail size={12} className="text-slate-500" />
                          <Phone size={12} className="text-slate-500" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="btn-primary h-6 px-2 text-xs">
                            <Plus size={11} /> Add
                          </button>
                          <button className="btn-secondary h-6 px-2 text-xs">
                            <Mail size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 grid gap-3">
                {companies.map(c => (
                  <div key={c.id} className="card flex items-center gap-4 hover:border-white/10 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-white font-medium text-sm">{c.name}</p>
                        <p className="text-slate-500 text-xs">{c.domain}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Industry</p>
                        <p className="text-slate-300 text-sm">{c.industry}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Employees</p>
                        <p className="text-slate-300 text-sm">{c.employees}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Location</p>
                        <p className="text-slate-300 text-sm">{c.location}</p>
                      </div>
                    </div>
                    <ScoreBadge score={c.score} />
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-primary h-6 px-2 text-xs">
                        <Plus size={11} /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
