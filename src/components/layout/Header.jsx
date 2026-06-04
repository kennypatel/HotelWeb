import { Search, Bell, ChevronDown, Plus, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export default function Header({ title, subtitle }) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="flex items-center gap-4 px-6 py-3 border-b border-white/5 bg-apollo-navy/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Global search */}
      <div className={`relative flex items-center ${searchFocused ? 'w-80' : 'w-64'} transition-all duration-200`}>
        <Search size={14} className="absolute left-3 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search people, companies..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="input w-full pl-8 h-8"
        />
        <kbd className="absolute right-3 text-slate-600 text-xs bg-white/5 border border-white/10 rounded px-1 py-0.5">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="btn-primary h-8 px-3 text-xs">
          <Plus size={14} />
          Add Contact
        </button>

        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-apollo-purple"></span>
        </button>

        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <HelpCircle size={16} />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-apollo-purple to-purple-600 flex items-center justify-center text-xs font-bold">
            KP
          </div>
          <span className="text-sm text-white font-medium">Kenny</span>
          <ChevronDown size={13} className="text-slate-500" />
        </button>
      </div>
    </header>
  )
}
