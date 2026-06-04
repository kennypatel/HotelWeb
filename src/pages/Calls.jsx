import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { contacts } from '../data/mockData'
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Mic, MicOff, Video, Clock, Search, Plus } from 'lucide-react'

const callLog = contacts.slice(0, 8).map((c, i) => ({
  id: c.id,
  contact: c.name,
  company: c.company,
  avatar: c.avatar,
  type: ['outbound', 'inbound', 'missed', 'outbound', 'inbound', 'outbound', 'missed', 'inbound'][i],
  duration: ['4:32', '12:18', '—', '8:05', '23:41', '2:17', '—', '15:30'][i],
  outcome: ['voicemail', 'connected', 'missed', 'connected', 'connected', 'voicemail', 'missed', 'connected'][i],
  date: ['Today, 10:30 AM', 'Today, 9:15 AM', 'Today, 8:45 AM', 'Yesterday, 3:20 PM', 'Yesterday, 11:00 AM', 'Jan 22, 2:15 PM', 'Jan 22, 10:00 AM', 'Jan 21, 4:30 PM'][i],
}))

const typeConfig = {
  outbound: { icon: PhoneOutgoing, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  inbound: { icon: PhoneIncoming, color: 'text-green-400', bg: 'bg-green-500/10' },
  missed: { icon: PhoneMissed, color: 'text-red-400', bg: 'bg-red-500/10' },
}

const outcomeVariant = { connected: 'green', voicemail: 'yellow', missed: 'red' }

export default function Calls() {
  return (
    <Layout title="Calls" subtitle="Track and manage your call activity">
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Calls Today', value: '12', icon: Phone, color: 'text-blue-400 bg-blue-500/10' },
            { label: 'Connected', value: '7', icon: PhoneIncoming, color: 'text-green-400 bg-green-500/10' },
            { label: 'Missed', value: '3', icon: PhoneMissed, color: 'text-red-400 bg-red-500/10' },
            { label: 'Avg Duration', value: '8:24', icon: Clock, color: 'text-purple-400 bg-purple-500/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={13} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Dialer + Log */}
        <div className="grid grid-cols-5 gap-4">
          {/* Dialer */}
          <div className="col-span-2 card">
            <h3 className="font-semibold text-white mb-4">Dialer</h3>
            <div className="bg-apollo-navy rounded-xl border border-white/10 p-4 mb-4 text-center">
              <p className="text-2xl font-mono text-white tracking-widest mb-1">+1 (555) ---</p>
              <p className="text-xs text-slate-500">Enter number or select contact</p>
            </div>

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(k => (
                <button
                  key={k}
                  className="h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-colors border border-white/5"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10">
                <MicOff size={16} />
              </button>
              <button className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors shadow-lg shadow-green-500/20">
                <Phone size={22} />
              </button>
              <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10">
                <Video size={16} />
              </button>
            </div>
          </div>

          {/* Call log */}
          <div className="col-span-3 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Call Log</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input className="input pl-7 h-7 text-xs w-40" placeholder="Search calls..." />
                </div>
                <button className="btn-primary h-7 px-2.5 text-xs">
                  <Plus size={12} /> Log Call
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {callLog.map(call => {
                const config = typeConfig[call.type]
                const Icon = config.icon
                return (
                  <div key={call.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors cursor-pointer border border-white/0 hover:border-white/5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon size={14} className={config.color} />
                    </div>
                    <Avatar initials={call.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{call.contact}</span>
                        <span className="text-slate-500 text-xs">· {call.company}</span>
                      </div>
                      <span className="text-slate-500 text-xs">{call.date}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock size={11} />
                        {call.duration}
                      </div>
                      <Badge variant={outcomeVariant[call.outcome]}>{call.outcome}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
