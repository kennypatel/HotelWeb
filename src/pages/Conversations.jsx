import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { contacts } from '../data/mockData'
import { Search, Send, Paperclip, Smile, MoreHorizontal, Phone, Video } from 'lucide-react'

const threads = contacts.slice(0, 6).map((c, i) => ({
  id: c.id,
  contact: c.name,
  company: c.company,
  avatar: c.avatar,
  lastMessage: [
    "Thanks for reaching out! I'd love to learn more about your solution.",
    "Can we schedule a call next week to discuss the pricing?",
    "I forwarded your email to our CTO. She'll be in touch.",
    "This looks interesting. Do you have any case studies?",
    "We're currently evaluating solutions. What's your timeline?",
    "Please send over the proposal when you get a chance.",
  ][i],
  time: ['2m ago', '14m ago', '1h ago', '3h ago', 'Yesterday', 'Jan 22'][i],
  unread: [true, true, false, false, false, false][i],
  status: ['replied', 'replied', 'opened', 'opened', 'sent', 'sent'][i],
}))

const sampleMessages = [
  { id: 1, from: 'me', text: "Hi Sarah, I wanted to reach out about Apollo's data intelligence platform. We help companies like Stripe accelerate outbound sales by 3x.", time: '10:02 AM' },
  { id: 2, from: 'them', text: "Thanks for reaching out! I'd love to learn more about your solution.", time: '10:15 AM' },
  { id: 3, from: 'me', text: "Great! Would you be open to a 20-minute demo this week? I can show you exactly how teams like yours are using Apollo to book more meetings.", time: '10:18 AM' },
  { id: 4, from: 'them', text: "Sure, Thursday at 2pm works for me. Can you send a calendar invite?", time: '10:31 AM' },
  { id: 5, from: 'me', text: "Perfect! Sending the invite now. Looking forward to it!", time: '10:33 AM' },
]

export default function Conversations() {
  const [activeThread, setActiveThread] = useState(threads[0])
  const [message, setMessage] = useState('')

  return (
    <Layout title="Conversations" subtitle="Inbox & email threads">
      <div className="flex h-full" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Thread list */}
        <div className="w-72 shrink-0 border-r border-white/5 flex flex-col">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input w-full pl-8 h-8 text-xs" placeholder="Search conversations..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                  activeThread?.id === thread.id ? 'bg-apollo-purple/10' : 'hover:bg-white/3'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <Avatar initials={thread.avatar} size="md" />
                    {thread.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-apollo-purple border-2 border-apollo-navy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-medium truncate ${thread.unread ? 'text-white' : 'text-slate-300'}`}>
                        {thread.contact}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0 ml-2">{thread.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{thread.company}</p>
                    <p className={`text-xs mt-1 truncate ${thread.unread ? 'text-slate-300' : 'text-slate-500'}`}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        {activeThread && (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Thread header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
              <Avatar initials={activeThread.avatar} size="md" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{activeThread.contact}</p>
                <p className="text-slate-500 text-xs">{activeThread.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="green">replied</Badge>
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <Phone size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <Video size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {sampleMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'them' && (
                    <Avatar initials={activeThread.avatar} size="sm" className="mr-2 mt-1 shrink-0" />
                  )}
                  <div className={`max-w-md ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'me'
                        ? 'bg-apollo-purple text-white rounded-br-sm'
                        : 'bg-white/8 text-slate-100 rounded-bl-sm border border-white/10'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-slate-600">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/5 p-4">
              <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <textarea
                  rows={2}
                  placeholder="Write a reply..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 resize-none focus:outline-none"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <Paperclip size={14} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <Smile size={14} />
                  </button>
                  <button className="btn-primary h-8 px-3 text-xs">
                    <Send size={13} /> Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
