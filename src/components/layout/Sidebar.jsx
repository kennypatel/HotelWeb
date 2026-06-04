import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Mail, CheckSquare,
  Calendar, BarChart3, MessageSquare, Zap, Settings,
  ChevronLeft, ChevronRight, Search, Bell, CreditCard,
  Rocket, Phone, Inbox
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { divider: true },
  { icon: Users, label: 'People', path: '/people' },
  { icon: Building2, label: 'Companies', path: '/companies' },
  { divider: true },
  { icon: Mail, label: 'Sequences', path: '/sequences' },
  { icon: Inbox, label: 'Conversations', path: '/conversations' },
  { icon: Phone, label: 'Calls', path: '/calls' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Meetings', path: '/meetings' },
  { divider: true },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Zap, label: 'Enrichment', path: '/enrichment' },
]

const bottomItems = [
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: CreditCard, label: 'Credits & Usage', path: '/credits' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

function NavItem({ item, collapsed }) {
  if (item.divider) {
    return <div className="my-1.5 border-t border-white/5" />
  }
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        clsx('sidebar-nav-item', { active: isActive })
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'flex flex-col bg-apollo-sidebar border-r border-white/5 transition-all duration-200 shrink-0',
        collapsed ? 'w-14' : 'w-56'
      )}
      style={{ height: '100vh', position: 'sticky', top: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-apollo-purple flex items-center justify-center shrink-0">
          <Rocket size={14} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-base tracking-tight">Apollo</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'ml-auto p-1 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-colors',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => (
          <NavItem key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
        {bottomItems.map((item, i) => (
          <NavItem key={i} item={item} collapsed={collapsed} />
        ))}
        {/* User avatar */}
        <div className={clsx(
          'flex items-center gap-3 px-3 py-2 mt-1 rounded-lg cursor-pointer hover:bg-white/5 transition-colors',
          collapsed && 'justify-center'
        )}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-apollo-purple to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
            KP
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">Kenny Patel</p>
              <p className="text-slate-500 text-xs truncate">Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
