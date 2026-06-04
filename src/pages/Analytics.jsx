import Layout from '../components/layout/Layout'
import { analyticsData, sequences } from '../data/mockData'
import { TrendingUp, Mail, MessageSquare, Calendar, Download, ChevronDown } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList,
  Cell, AreaChart, Area, PieChart, Pie, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-apollo-navy-mid border border-white/10 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-white font-medium">{p.value}{p.name.includes('Rate') ? '%' : ''}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const pieData = [
  { name: 'Opened', value: 612, color: '#6366f1' },
  { name: 'Clicked', value: 187, color: '#8b5cf6' },
  { name: 'Bounced', value: 43, color: '#ef4444' },
  { name: 'Unsubscribed', value: 12, color: '#f59e0b' },
]

export default function Analytics() {
  return (
    <Layout title="Analytics" subtitle="Track your outreach performance">
      <div className="p-6 space-y-6">
        {/* Date selector + export */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['7d', '30d', '90d', 'Custom'].map((p, i) => (
              <button
                key={p}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  i === 1 ? 'bg-apollo-purple text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="btn-secondary h-8 px-3 text-xs">
            <Download size={13} /> Export Report
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Emails Sent', value: '12,483', change: '+18%', color: 'text-blue-400', icon: Mail },
            { label: 'Open Rate', value: '47.2%', change: '+3.1%', color: 'text-green-400', icon: TrendingUp },
            { label: 'Reply Rate', value: '18.6%', change: '+5.4%', color: 'text-purple-400', icon: MessageSquare },
            { label: 'Meetings', value: '87', change: '+12%', color: 'text-orange-400', icon: Calendar },
          ].map(kpi => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                  <Icon size={14} className={kpi.color} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                <span className="text-xs text-green-400 font-medium">{kpi.change} vs last period</span>
              </div>
            )
          })}
        </div>

        {/* Main chart + pie */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Email Performance Over Time</h3>
              <button className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:text-white transition-colors">
                Emails Sent <ChevronDown size={12} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analyticsData.emailsSent}>
                <defs>
                  <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#emailGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold text-white mb-4">Email Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a2540', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Open + Reply rate charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold text-white mb-4">Open Rate Trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={analyticsData.openRates}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" name="Open Rate" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold text-white mb-4">Meetings Booked</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={analyticsData.meetings}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Meetings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sequence performance table */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Sequence Performance</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Sequence</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Contacts</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Open Rate</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Reply Rate</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Meetings</th>
              </tr>
            </thead>
            <tbody>
              {sequences.filter(s => s.contacts > 0).map(seq => (
                <tr key={seq.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 text-white font-medium">{seq.name}</td>
                  <td className="py-3 text-right text-slate-300">{seq.contacts}</td>
                  <td className="py-3 text-right">
                    <span className={seq.openRate >= 40 ? 'text-green-400' : 'text-yellow-400'}>{seq.openRate}%</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={seq.replyRate >= 20 ? 'text-green-400' : 'text-yellow-400'}>{seq.replyRate}%</span>
                  </td>
                  <td className="py-3 text-right text-white font-semibold">{seq.meetings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
