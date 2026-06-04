import Layout from '../components/layout/Layout'
import StatCard from '../components/ui/StatCard'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { contacts, tasks, meetings, analyticsData } from '../data/mockData'
import { Users, Mail, Calendar, TrendingUp, ArrowRight, Phone, Linkedin, CheckCircle, Clock } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

function MiniChart({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        <Tooltip
          contentStyle={{ background: '#1a2540', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ display: 'none' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

const taskTypeIcons = { call: Phone, email: Mail, linkedin: Linkedin }
const taskTypeColors = { call: 'text-green-400', email: 'text-blue-400', linkedin: 'text-blue-500' }

export default function Dashboard() {
  const todayTasks = tasks.filter(t => t.due === 'Today')
  const upcomingMeetings = meetings.slice(0, 3)

  return (
    <Layout title="Home" subtitle="Wednesday, January 24, 2024">
      <div className="p-6 space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden card bg-gradient-to-r from-apollo-purple/20 to-indigo-900/20 border-apollo-purple/20">
          <div className="absolute inset-0 bg-gradient-to-r from-apollo-purple/5 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Good morning, Kenny 👋</h2>
              <p className="text-slate-400 text-sm">You have <span className="text-white font-medium">{todayTasks.length} tasks</span> due today and <span className="text-white font-medium">{upcomingMeetings.length} meetings</span> scheduled.</p>
            </div>
            <button className="btn-primary">
              Start Tasks <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Emails Sent" value="1,847" change={12.4} changeLabel="vs last week" icon={Mail} color="blue" />
          <StatCard label="Open Rate" value="47%" change={3.2} changeLabel="vs last week" icon={TrendingUp} color="green" />
          <StatCard label="Replies" value="234" change={8.1} changeLabel="vs last week" icon={Users} color="purple" />
          <StatCard label="Meetings Booked" value="23" change={-2.3} changeLabel="vs last week" icon={Calendar} color="orange" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Emails Sent', data: analyticsData.emailsSent, color: '#3b82f6' },
            { label: 'Open Rate %', data: analyticsData.openRates, color: '#10b981' },
            { label: 'Reply Rate %', data: analyticsData.replyRates, color: '#8b5cf6' },
            { label: 'Meetings', data: analyticsData.meetings, color: '#f59e0b' },
          ].map(({ label, data, color }) => (
            <div key={label} className="card">
              <p className="text-xs text-slate-500 mb-2">{label}</p>
              <MiniChart data={data} color={color} />
            </div>
          ))}
        </div>

        {/* Two-column: Tasks + Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Today's Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Today's Tasks</h3>
              <Badge variant="purple">{todayTasks.length} due</Badge>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => {
                const Icon = taskTypeIcons[task.type] || Mail
                return (
                  <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors cursor-pointer">
                    <div className={`mt-0.5 ${taskTypeColors[task.type]}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{task.contact}</span>
                        <span className="text-slate-500 text-xs">· {task.company}</span>
                      </div>
                      <p className="text-slate-400 text-xs truncate">{task.note}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'gray'}>
                        {task.priority}
                      </Badge>
                      {task.completed ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <Clock size={14} className="text-slate-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
              View all tasks <ArrowRight size={12} />
            </button>
          </div>

          {/* Upcoming Meetings */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Upcoming Meetings</h3>
              <button className="text-xs text-apollo-purple-light hover:text-white transition-colors">View calendar</button>
            </div>
            <div className="space-y-3">
              {meetings.map(meeting => (
                <div key={meeting.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-apollo-purple/10 border border-apollo-purple/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-apollo-purple-light text-xs font-bold leading-none">{meeting.time.split(':')[0]}</span>
                    <span className="text-slate-500 text-xs">{meeting.time.includes('AM') ? 'AM' : 'PM'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{meeting.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Avatar initials={meeting.contact.split(' ').map(n => n[0]).join('')} size="sm" className="w-4 h-4 text-xs" />
                      <span className="text-slate-400 text-xs">{meeting.contact} · {meeting.duration}m</span>
                    </div>
                  </div>
                  <Badge variant={meeting.status === 'confirmed' ? 'green' : 'yellow'}>
                    {meeting.status}
                  </Badge>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
              View all meetings <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Contacts</h3>
            <button className="text-xs text-apollo-purple-light hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {contacts.slice(0, 5).map(c => (
              <div key={c.id} className="p-3 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/3 transition-all cursor-pointer text-center">
                <Avatar initials={c.avatar} size="lg" className="mx-auto mb-2" />
                <p className="text-white text-xs font-medium truncate">{c.name}</p>
                <p className="text-slate-500 text-xs truncate">{c.title}</p>
                <p className="text-slate-500 text-xs truncate">{c.company}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
