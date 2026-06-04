import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import ScoreBadge from '../components/ui/ScoreBadge'
import { contacts } from '../data/mockData'
import {
  Search, Filter, Download, Mail, Phone, Linkedin,
  ChevronDown, SlidersHorizontal, Star, MoreHorizontal,
  Plus, ListFilter, Grid, CheckSquare
} from 'lucide-react'

const statusVariant = { new: 'blue', contacted: 'yellow', qualified: 'green', unqualified: 'red' }

const filters = ['All Contacts', 'My Contacts', 'Starred', 'Recently Added', 'Hot Leads']

export default function People() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Contacts')
  const [viewMode, setViewMode] = useState('table')

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const allSelected = filtered.length > 0 && filtered.every(c => selected.includes(c.id))
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(c => c.id))

  return (
    <Layout title="People" subtitle={`${contacts.length.toLocaleString()} contacts`}>
      <div className="flex h-full">
        {/* Filter sidebar */}
        <div className="w-48 shrink-0 border-r border-white/5 p-3 space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Views</p>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeFilter === f
                  ? 'bg-apollo-purple/20 text-apollo-purple-light font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Filters</p>
            {['Job Title', 'Company Size', 'Location', 'Industry', 'Keywords'].map(f => (
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
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-secondary h-8 px-3 text-xs">
              <Filter size={13} /> Filter
            </button>
            <button className="btn-secondary h-8 px-3 text-xs">
              <SlidersHorizontal size={13} /> Sort
            </button>
            <div className="ml-auto flex items-center gap-2">
              {selected.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs text-slate-400">{selected.length} selected</span>
                  <button className="btn-primary h-7 px-2.5 text-xs">
                    <Mail size={12} /> Email
                  </button>
                  <button className="btn-secondary h-7 px-2.5 text-xs">
                    <Download size={12} /> Export
                  </button>
                </div>
              )}
              <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                >
                  <ListFilter size={13} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                >
                  <Grid size={13} />
                </button>
              </div>
              <button className="btn-primary h-8 px-3 text-xs">
                <Plus size={13} /> Add Contact
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-white/20 bg-white/5 accent-apollo-purple"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(contact => (
                  <tr key={contact.id} className="table-row group">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        className="rounded border-white/20 bg-white/5 accent-apollo-purple"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={contact.avatar} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white text-sm font-medium hover:text-apollo-purple-light cursor-pointer">
                              {contact.name}
                            </span>
                            {contact.linkedin && <Linkedin size={11} className="text-blue-400" />}
                          </div>
                          <span className="text-slate-500 text-xs">{contact.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{contact.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-sm hover:text-white cursor-pointer">{contact.company}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{contact.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[contact.status]}>
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={contact.score} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Send email">
                          <Mail size={13} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Call">
                          <Phone size={13} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Star">
                          <Star size={13} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <span className="text-xs text-slate-500">Showing {filtered.length} of {contacts.length} contacts</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 12].map((p, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded text-xs flex items-center justify-center transition-colors ${
                      p === 1 ? 'bg-apollo-purple text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
