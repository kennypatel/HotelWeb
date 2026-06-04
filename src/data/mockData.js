export const contacts = [
  { id: 1, name: 'Sarah Chen', title: 'VP of Engineering', company: 'Stripe', email: 's.chen@stripe.com', phone: '+1 415-555-0123', location: 'San Francisco, CA', status: 'new', score: 92, tags: ['hot', 'decision-maker'], avatar: 'SC', linkedin: true },
  { id: 2, name: 'Marcus Johnson', title: 'Director of Sales', company: 'Salesforce', email: 'm.johnson@salesforce.com', phone: '+1 650-555-0198', location: 'San Francisco, CA', status: 'contacted', score: 85, tags: ['warm'], avatar: 'MJ', linkedin: true },
  { id: 3, name: 'Priya Patel', title: 'CTO', company: 'Notion', email: 'priya@notion.so', phone: '+1 510-555-0142', location: 'San Francisco, CA', status: 'qualified', score: 97, tags: ['hot', 'c-suite'], avatar: 'PP', linkedin: true },
  { id: 4, name: 'James Wilson', title: 'Head of Product', company: 'Figma', email: 'j.wilson@figma.com', phone: '+1 415-555-0167', location: 'New York, NY', status: 'new', score: 78, tags: ['warm'], avatar: 'JW', linkedin: false },
  { id: 5, name: 'Emily Rodriguez', title: 'Chief Revenue Officer', company: 'Hubspot', email: 'emily.r@hubspot.com', phone: '+1 617-555-0189', location: 'Boston, MA', status: 'contacted', score: 91, tags: ['hot', 'c-suite'], avatar: 'ER', linkedin: true },
  { id: 6, name: 'David Kim', title: 'VP Marketing', company: 'Airtable', email: 'd.kim@airtable.com', phone: '+1 415-555-0134', location: 'San Francisco, CA', status: 'unqualified', score: 45, tags: ['cold'], avatar: 'DK', linkedin: true },
  { id: 7, name: 'Lisa Thompson', title: 'Engineering Manager', company: 'GitHub', email: 'l.thompson@github.com', phone: '+1 415-555-0156', location: 'San Francisco, CA', status: 'qualified', score: 88, tags: ['warm', 'technical'], avatar: 'LT', linkedin: true },
  { id: 8, name: 'Michael Torres', title: 'CEO', company: 'Linear', email: 'michael@linear.app', phone: '+1 650-555-0178', location: 'San Francisco, CA', status: 'new', score: 99, tags: ['hot', 'c-suite'], avatar: 'MT', linkedin: true },
  { id: 9, name: 'Anna Schmidt', title: 'VP of Partnerships', company: 'Vercel', email: 'anna@vercel.com', phone: '+1 415-555-0190', location: 'Remote', status: 'contacted', score: 76, tags: ['warm'], avatar: 'AS', linkedin: false },
  { id: 10, name: 'Ryan O\'Brien', title: 'Director of Operations', company: 'Cloudflare', email: 'ryan@cloudflare.com', phone: '+1 415-555-0112', location: 'San Francisco, CA', status: 'qualified', score: 83, tags: ['warm', 'technical'], avatar: 'RO', linkedin: true },
]

export const companies = [
  { id: 1, name: 'Stripe', domain: 'stripe.com', industry: 'Fintech', employees: '5,000-10,000', revenue: '$1B+', location: 'San Francisco, CA', score: 94, contacts: 12, status: 'active' },
  { id: 2, name: 'Salesforce', domain: 'salesforce.com', industry: 'CRM / SaaS', employees: '50,000+', revenue: '$30B+', location: 'San Francisco, CA', score: 88, contacts: 8, status: 'active' },
  { id: 3, name: 'Notion', domain: 'notion.so', industry: 'Productivity', employees: '200-500', revenue: '$100M+', location: 'San Francisco, CA', score: 97, contacts: 5, status: 'prospect' },
  { id: 4, name: 'Figma', domain: 'figma.com', industry: 'Design Tools', employees: '500-1,000', revenue: '$500M+', location: 'San Francisco, CA', score: 85, contacts: 3, status: 'active' },
  { id: 5, name: 'HubSpot', domain: 'hubspot.com', industry: 'Marketing', employees: '5,000-10,000', revenue: '$2B+', location: 'Boston, MA', score: 79, contacts: 7, status: 'prospect' },
  { id: 6, name: 'Airtable', domain: 'airtable.com', industry: 'Productivity', employees: '500-1,000', revenue: '$100M+', location: 'San Francisco, CA', score: 62, contacts: 2, status: 'inactive' },
  { id: 7, name: 'GitHub', domain: 'github.com', industry: 'Developer Tools', employees: '3,000-5,000', revenue: '$1B+', location: 'San Francisco, CA', score: 91, contacts: 9, status: 'active' },
  { id: 8, name: 'Linear', domain: 'linear.app', industry: 'Project Management', employees: '50-200', revenue: '$10M+', location: 'San Francisco, CA', score: 96, contacts: 1, status: 'prospect' },
]

export const sequences = [
  { id: 1, name: 'SaaS Outbound Q1', status: 'active', contacts: 284, steps: 6, openRate: 42, replyRate: 18, meetings: 23, created: '2024-01-05' },
  { id: 2, name: 'Enterprise Decision Makers', status: 'active', contacts: 112, steps: 8, openRate: 51, replyRate: 24, meetings: 31, created: '2024-01-12' },
  { id: 3, name: 'Re-Engagement Campaign', status: 'paused', contacts: 540, steps: 4, openRate: 29, replyRate: 9, meetings: 8, created: '2023-12-20' },
  { id: 4, name: 'Inbound Follow-Up', status: 'active', contacts: 89, steps: 3, openRate: 67, replyRate: 38, meetings: 41, created: '2024-01-18' },
  { id: 5, name: 'Technical Buyers - Engineers', status: 'draft', contacts: 0, steps: 5, openRate: 0, replyRate: 0, meetings: 0, created: '2024-01-22' },
  { id: 6, name: 'Competitor Displacement', status: 'active', contacts: 203, steps: 7, openRate: 38, replyRate: 15, meetings: 19, created: '2024-01-08' },
]

export const tasks = [
  { id: 1, type: 'call', contact: 'Sarah Chen', company: 'Stripe', priority: 'high', due: 'Today', note: 'Follow up on pricing discussion', completed: false },
  { id: 2, type: 'email', contact: 'Marcus Johnson', company: 'Salesforce', priority: 'medium', due: 'Today', note: 'Send product demo recording', completed: false },
  { id: 3, type: 'linkedin', contact: 'Priya Patel', company: 'Notion', priority: 'high', due: 'Today', note: 'Connect and send intro message', completed: true },
  { id: 4, type: 'call', contact: 'James Wilson', company: 'Figma', priority: 'low', due: 'Tomorrow', note: 'Discovery call scheduled', completed: false },
  { id: 5, type: 'email', contact: 'Emily Rodriguez', company: 'HubSpot', priority: 'high', due: 'Tomorrow', note: 'Send case studies', completed: false },
  { id: 6, type: 'call', contact: 'Michael Torres', company: 'Linear', priority: 'high', due: 'Jan 25', note: 'Intro call - warm intro from David', completed: false },
  { id: 7, type: 'email', contact: 'Lisa Thompson', company: 'GitHub', priority: 'medium', due: 'Jan 26', note: 'Technical deep-dive follow-up', completed: false },
]

export const meetings = [
  { id: 1, title: 'Product Demo - Stripe', contact: 'Sarah Chen', company: 'Stripe', date: '2024-01-24', time: '10:00 AM', duration: 30, type: 'demo', status: 'confirmed' },
  { id: 2, title: 'Discovery Call - Notion', contact: 'Priya Patel', company: 'Notion', date: '2024-01-24', time: '2:00 PM', duration: 45, type: 'discovery', status: 'confirmed' },
  { id: 3, title: 'Follow-up - HubSpot', contact: 'Emily Rodriguez', company: 'HubSpot', date: '2024-01-25', time: '11:00 AM', duration: 30, type: 'follow-up', status: 'pending' },
  { id: 4, title: 'Intro Call - Linear', contact: 'Michael Torres', company: 'Linear', date: '2024-01-25', time: '3:00 PM', duration: 60, type: 'intro', status: 'confirmed' },
  { id: 5, title: 'Technical Review - GitHub', contact: 'Lisa Thompson', company: 'GitHub', date: '2024-01-26', time: '9:00 AM', duration: 60, type: 'technical', status: 'confirmed' },
]

export const analyticsData = {
  emailsSent: [
    { date: 'Jan 1', value: 142 }, { date: 'Jan 5', value: 198 }, { date: 'Jan 8', value: 167 },
    { date: 'Jan 12', value: 234 }, { date: 'Jan 15', value: 189 }, { date: 'Jan 19', value: 276 },
    { date: 'Jan 22', value: 312 }, { date: 'Jan 25', value: 287 },
  ],
  openRates: [
    { date: 'Jan 1', value: 38 }, { date: 'Jan 5', value: 41 }, { date: 'Jan 8', value: 36 },
    { date: 'Jan 12', value: 45 }, { date: 'Jan 15', value: 43 }, { date: 'Jan 19', value: 49 },
    { date: 'Jan 22', value: 52 }, { date: 'Jan 25', value: 47 },
  ],
  replyRates: [
    { date: 'Jan 1', value: 12 }, { date: 'Jan 5', value: 15 }, { date: 'Jan 8', value: 11 },
    { date: 'Jan 12', value: 18 }, { date: 'Jan 15', value: 16 }, { date: 'Jan 19', value: 21 },
    { date: 'Jan 22', value: 24 }, { date: 'Jan 25', value: 19 },
  ],
  meetings: [
    { date: 'Jan 1', value: 3 }, { date: 'Jan 5', value: 5 }, { date: 'Jan 8', value: 4 },
    { date: 'Jan 12', value: 7 }, { date: 'Jan 15', value: 6 }, { date: 'Jan 19', value: 9 },
    { date: 'Jan 22', value: 11 }, { date: 'Jan 25', value: 8 },
  ],
  funnelData: [
    { stage: 'Contacted', value: 1248, color: '#6366f1' },
    { stage: 'Opened', value: 612, color: '#8b5cf6' },
    { stage: 'Replied', value: 234, color: '#a78bfa' },
    { stage: 'Meetings', value: 87, color: '#c4b5fd' },
    { stage: 'Closed', value: 23, color: '#ddd6fe' },
  ],
}

export const creditUsage = {
  total: 10000,
  used: 6842,
  exports: 4120,
  enrichments: 1980,
  emailFinder: 742,
}
