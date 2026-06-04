import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { User, Bell, Shield, CreditCard, Mail, Link2, Zap, Check } from 'lucide-react'

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & Credits', icon: CreditCard },
  { id: 'email', label: 'Email Settings', icon: Mail },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'api', label: 'API & Webhooks', icon: Zap },
]

const integrations = [
  { name: 'Salesforce', description: 'Sync contacts and accounts', connected: true, logo: '☁️' },
  { name: 'HubSpot', description: 'Two-way CRM sync', connected: false, logo: '🧲' },
  { name: 'Gmail', description: 'Send emails via Gmail', connected: true, logo: '📧' },
  { name: 'Outlook', description: 'Send emails via Outlook', connected: false, logo: '📬' },
  { name: 'Slack', description: 'Get notifications in Slack', connected: true, logo: '💬' },
  { name: 'LinkedIn Sales Navigator', description: 'Import leads from LinkedIn', connected: false, logo: '🔗' },
  { name: 'Zapier', description: 'Connect 5,000+ apps', connected: false, logo: '⚡' },
  { name: 'Webhooks', description: 'Custom event triggers', connected: false, logo: '🔔' },
]

function Toggle2({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-apollo-purple' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    emailOpens: true,
    replies: true,
    meetings: true,
    tasks: false,
    weeklyDigest: true,
  })

  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      <div className="flex h-full">
        {/* Settings nav */}
        <div className="w-52 shrink-0 border-r border-white/5 p-3">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Account</p>
          {sections.map(s => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-colors ${
                  activeSection === s.id
                    ? 'bg-apollo-purple/20 text-apollo-purple-light'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 max-w-2xl">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-semibold mb-1">Profile</h2>
                <p className="text-sm text-slate-500">Manage your personal information</p>
              </div>

              <div className="card space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-apollo-purple to-purple-600 flex items-center justify-center text-xl font-bold">
                    KP
                  </div>
                  <div>
                    <p className="text-white font-medium">Kenny Patel</p>
                    <p className="text-slate-400 text-sm">patelkenny17@gmail.com</p>
                    <button className="text-xs text-apollo-purple-light hover:text-white transition-colors mt-1">
                      Change avatar
                    </button>
                  </div>
                </div>

                {[
                  { label: 'First Name', value: 'Kenny', type: 'text' },
                  { label: 'Last Name', value: 'Patel', type: 'text' },
                  { label: 'Email', value: 'patelkenny17@gmail.com', type: 'email' },
                  { label: 'Job Title', value: 'Sales Manager', type: 'text' },
                  { label: 'Company', value: 'My Company', type: 'text' },
                  { label: 'Phone', value: '+1 (555) 000-0000', type: 'tel' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs text-slate-500 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="input w-full"
                    />
                  </div>
                ))}

                <button className="btn-primary w-full justify-center">Save Changes</button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-semibold mb-1">Notifications</h2>
                <p className="text-sm text-slate-500">Control what alerts you receive</p>
              </div>

              <div className="card space-y-4">
                {[
                  { key: 'emailOpens', label: 'Email Opens', desc: 'When a contact opens your email' },
                  { key: 'replies', label: 'Replies', desc: 'When a contact replies to your email' },
                  { key: 'meetings', label: 'Meeting Bookings', desc: 'When a meeting is scheduled' },
                  { key: 'tasks', label: 'Task Reminders', desc: 'Reminders for upcoming tasks' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly performance summary email' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs">{item.desc}</p>
                    </div>
                    <Toggle2
                      checked={notifications[item.key]}
                      onChange={v => setNotifications(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-semibold mb-1">Integrations</h2>
                <p className="text-sm text-slate-500">Connect Apollo with your existing tools</p>
              </div>

              <div className="grid gap-3">
                {integrations.map(int => (
                  <div key={int.name} className="card flex items-center gap-4 hover:border-white/10 transition-all">
                    <div className="text-2xl w-10 text-center shrink-0">{int.logo}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{int.name}</p>
                      <p className="text-slate-500 text-xs">{int.description}</p>
                    </div>
                    {int.connected ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Check size={11} /> Connected
                        </span>
                        <button className="btn-secondary h-7 px-2.5 text-xs">Disconnect</button>
                      </div>
                    ) : (
                      <button className="btn-primary h-7 px-3 text-xs">Connect</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white font-semibold mb-1">Billing & Credits</h2>
                <p className="text-sm text-slate-500">Manage your subscription and credit usage</p>
              </div>

              <div className="card bg-gradient-to-r from-apollo-purple/20 to-indigo-900/20 border-apollo-purple/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Current Plan</p>
                    <p className="text-2xl font-bold text-white">Pro Plan</p>
                    <p className="text-slate-400 text-sm mt-1">$99/month · Billed monthly</p>
                  </div>
                  <button className="btn-secondary text-xs">Upgrade to Team</button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Credits Used</span>
                    <span className="text-white font-medium">6,842 / 10,000</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-apollo-purple rounded-full" style={{ width: '68.42%' }} />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-medium text-white mb-3">Credit Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Email Finder', used: 742, total: 3000, color: '#6366f1' },
                    { label: 'Contact Exports', used: 4120, total: 5000, color: '#10b981' },
                    { label: 'Enrichments', used: 1980, total: 2000, color: '#f59e0b' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{item.used.toLocaleString()} / {item.total.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.used / item.total) * 100}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!['profile', 'notifications', 'integrations', 'billing'].includes(activeSection) && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                {(() => { const S = sections.find(s => s.id === activeSection); return S ? <S.icon size={20} className="text-slate-400" /> : null })()}
              </div>
              <p className="text-white font-medium">{sections.find(s => s.id === activeSection)?.label}</p>
              <p className="text-slate-500 text-sm mt-1">Settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
