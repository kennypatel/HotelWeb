import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { meetings } from '../data/mockData'
import { Calendar, Clock, Video, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const typeColor = {
  demo: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  discovery: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'follow-up': 'bg-green-500/10 text-green-400 border-green-500/20',
  intro: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  technical: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']

export default function Meetings() {
  return (
    <Layout title="Meetings" subtitle="Track and manage your scheduled calls">
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'This Week', value: meetings.length, sub: 'meetings' },
            { label: 'Confirmed', value: meetings.filter(m => m.status === 'confirmed').length, sub: 'confirmed' },
            { label: 'Hours Booked', value: Math.round(meetings.reduce((a, m) => a + m.duration, 0) / 60 * 10) / 10, sub: 'hours' },
            { label: 'Show Rate', value: '94%', sub: 'avg show rate' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Calendar view */}
          <div className="col-span-3 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Week of Jan 22 – 28</h3>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-slate-400 px-2">January 2024</span>
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </button>
                <button className="btn-primary h-7 px-3 text-xs ml-2">
                  <Plus size={12} /> Book Meeting
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-8 gap-0 text-xs">
              {/* Day headers */}
              <div className="text-slate-600 py-2" />
              {days.map((d, i) => (
                <div key={d} className={`text-center py-2 font-medium ${i === 2 ? 'text-apollo-purple-light' : 'text-slate-400'}`}>
                  <div className={`text-xs ${i === 2 ? 'text-apollo-purple-light' : 'text-slate-500'}`}>{d}</div>
                  <div className={`w-6 h-6 rounded-full mx-auto mt-1 flex items-center justify-center text-xs font-semibold ${
                    i === 2 ? 'bg-apollo-purple text-white' : 'text-slate-300'
                  }`}>{22 + i}</div>
                </div>
              ))}

              {/* Time slots */}
              {hours.map((hour, hi) => (
                <>
                  <div key={`time-${hi}`} className="text-slate-600 text-right pr-2 py-3 text-xs border-t border-white/5">
                    {hour}
                  </div>
                  {days.map((d, di) => {
                    const meeting = meetings.find(m => {
                      const h = parseInt(m.time)
                      const ampm = m.time.includes('AM') ? 'AM' : 'PM'
                      const hour12 = ampm === 'PM' && h !== 12 ? h + 12 : h
                      return hour12 === (9 + hi) && di === (new Date(m.date).getDay() - 1 + 7) % 7
                    })
                    return (
                      <div key={`${d}-${hi}`} className={`border-t border-white/5 ${di === 2 ? 'bg-apollo-purple/3' : ''}`}>
                        {meeting && (
                          <div className={`m-0.5 p-1.5 rounded text-xs cursor-pointer border ${typeColor[meeting.type] || 'bg-white/5 text-slate-300 border-white/10'}`}>
                            <div className="font-medium truncate">{meeting.contact.split(' ')[0]}</div>
                            <div className="opacity-70 truncate">{meeting.duration}m</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>

          {/* Meeting list */}
          <div className="col-span-2 space-y-3">
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Upcoming</h3>
              <div className="space-y-3">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="flex gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors cursor-pointer group border border-white/0 hover:border-white/5">
                    <div className="w-1 rounded-full shrink-0" style={{ background: typeColor[meeting.type]?.match(/text-(\w+-\d+)/)?.[0] ? '' : '#6366f1', minHeight: 40 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white text-sm font-medium group-hover:text-apollo-purple-light transition-colors truncate">
                            {meeting.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar initials={meeting.contact.split(' ').map(n=>n[0]).join('')} size="sm" className="w-4 h-4 text-xs" />
                            <span className="text-slate-400 text-xs">{meeting.contact}</span>
                          </div>
                        </div>
                        <Badge variant={meeting.status === 'confirmed' ? 'green' : 'yellow'}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {meeting.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {meeting.time} · {meeting.duration}m
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="flex items-center gap-1 text-xs text-apollo-purple-light hover:text-white transition-colors">
                          <Video size={11} /> Join
                        </button>
                        <span className="text-white/10">·</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${typeColor[meeting.type] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                          {meeting.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
