import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { tasks } from '../data/mockData'
import { Phone, Mail, Linkedin, CheckCircle, Circle, Clock, Filter, Plus, MoreHorizontal } from 'lucide-react'

const typeConfig = {
  call: { icon: Phone, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Call' },
  email: { icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Email' },
  linkedin: { icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-600/10', label: 'LinkedIn' },
}

const priorityVariant = { high: 'red', medium: 'yellow', low: 'gray' }

export default function Tasks() {
  const [taskList, setTaskList] = useState(tasks)
  const [activeFilter, setActiveFilter] = useState('all')

  const toggle = (id) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const filters = [
    { id: 'all', label: 'All Tasks', count: taskList.length },
    { id: 'today', label: 'Due Today', count: taskList.filter(t => t.due === 'Today').length },
    { id: 'pending', label: 'Pending', count: taskList.filter(t => !t.completed).length },
    { id: 'completed', label: 'Completed', count: taskList.filter(t => t.completed).length },
  ]

  const filtered = taskList.filter(t => {
    if (activeFilter === 'today') return t.due === 'Today'
    if (activeFilter === 'pending') return !t.completed
    if (activeFilter === 'completed') return t.completed
    return true
  })

  const grouped = {
    'Today': filtered.filter(t => t.due === 'Today'),
    'Tomorrow': filtered.filter(t => t.due === 'Tomorrow'),
    'Later': filtered.filter(t => !['Today', 'Tomorrow'].includes(t.due)),
  }

  return (
    <Layout title="Tasks" subtitle="Manage your daily outreach activities">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-48 shrink-0 border-r border-white/5 p-3">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Views</p>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center justify-between transition-colors ${
                activeFilter === f.id ? 'bg-apollo-purple/20 text-apollo-purple-light' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.label}
              <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{f.count}</span>
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider px-2 mb-2">Task Type</p>
            {Object.entries(typeConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <button key={key} className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2">
                  <Icon size={13} className={config.color} />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="font-medium text-white">{taskList.filter(t => !t.completed).length}</span> tasks remaining
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="btn-secondary h-8 px-3 text-xs">
                <Filter size={13} /> Filter
              </button>
              <button className="btn-primary h-8 px-3 text-xs">
                <Plus size={13} /> Add Task
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {Object.entries(grouped).map(([group, groupTasks]) => {
              if (groupTasks.length === 0) return null
              return (
                <div key={group}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-white">{group}</h3>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-slate-500">{groupTasks.length} tasks</span>
                  </div>
                  <div className="space-y-2">
                    {groupTasks.map(task => {
                      const config = typeConfig[task.type]
                      const Icon = config.icon
                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all cursor-pointer group ${
                            task.completed
                              ? 'border-white/5 bg-white/2 opacity-50'
                              : 'border-white/5 bg-apollo-navy-light hover:border-white/10'
                          }`}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => toggle(task.id)}
                            className="mt-0.5 shrink-0 text-slate-500 hover:text-white transition-colors"
                          >
                            {task.completed
                              ? <CheckCircle size={18} className="text-green-400" />
                              : <Circle size={18} />
                            }
                          </button>

                          {/* Type icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                            <Icon size={14} className={config.color} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`font-medium text-sm ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                {task.contact}
                              </span>
                              <span className="text-slate-500 text-xs">·</span>
                              <span className="text-slate-400 text-xs">{task.company}</span>
                            </div>
                            <p className="text-slate-400 text-xs">{task.note}</p>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Clock size={11} />
                              {task.due}
                            </div>
                            <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreHorizontal size={13} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
