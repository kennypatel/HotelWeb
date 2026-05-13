const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Utility helpers ───────────────────────────────────────────────────────────

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Data generators ───────────────────────────────────────────────────────────

function generateTrafficData() {
  const days = [];
  const labels = [];
  const beforeOptimization = [];
  const afterOptimization = [];
  const bookings = [];
  const revenue = [];

  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    labels.push(label);

    const dayIndex = 29 - i;
    const seed = dayIndex * 17 + 3;

    // Comfort Inn Huntsville: realistic baseline ~120-180 visitors/day before optimization
    const baseVisitors = 130 + Math.floor(seededRandom(seed) * 60) - 30;
    beforeOptimization.push(baseVisitors);

    // After optimization: grows to ~280-380 visitors/day — realistic for a regional mid-scale hotel
    let afterVal;
    if (dayIndex < 10) {
      afterVal = baseVisitors + Math.floor(seededRandom(seed + 1000) * 20) - 10;
    } else {
      const growthFactor = 1 + ((dayIndex - 9) / 21) * 1.4;
      afterVal = Math.floor(baseVisitors * growthFactor + seededRandom(seed + 2000) * 40 - 20);
    }
    afterOptimization.push(Math.max(afterVal, baseVisitors));

    // Bookings: 4-8% conversion — realistic for direct hotel bookings
    const convRate = 0.04 + seededRandom(seed + 3000) * 0.04;
    const dayBookings = Math.max(1, Math.floor(afterOptimization[dayIndex] * convRate));
    bookings.push(dayBookings);

    // Revenue: $89-$149/night, avg 1.8 nights — Comfort Inn Huntsville pricing
    const avgRate = 89 + seededRandom(seed + 4000) * 60;
    const avgNights = 1.5 + seededRandom(seed + 5000) * 0.8;
    revenue.push(Math.floor(dayBookings * avgRate * avgNights));

    days.push({
      date: label,
      visitors: afterOptimization[dayIndex],
      bookings: dayBookings,
      revenue: Math.floor(dayBookings * avgRate * avgNights)
    });
  }

  return { labels, beforeOptimization, afterOptimization, bookings, revenue, days };
}

function generateKPIs(trafficData) {
  const totalVisitorsCurrent = trafficData.afterOptimization.reduce((a, b) => a + b, 0);
  const totalVisitorsPrev = trafficData.beforeOptimization.reduce((a, b) => a + b, 0);
  const visitorChange = (((totalVisitorsCurrent - totalVisitorsPrev) / totalVisitorsPrev) * 100).toFixed(1);

  const totalBookings = trafficData.bookings.reduce((a, b) => a + b, 0);
  const totalRevenue = trafficData.revenue.reduce((a, b) => a + b, 0);
  const conversionRate = ((totalBookings / totalVisitorsCurrent) * 100).toFixed(2);
  const avgBookingValue = (totalRevenue / totalBookings).toFixed(0);

  // Prev period bookings estimate
  const prevBookings = Math.floor(totalVisitorsPrev * 0.032);
  const prevRevenue = prevBookings * 287;
  const bookingChange = (((totalBookings - prevBookings) / prevBookings) * 100).toFixed(1);
  const revenueChange = (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1);

  const totalRooms = 70;
  const roomNights = totalBookings * 1.8;
  const occupancyRate = Math.min(((roomNights / (totalRooms * 30)) * 100), 95).toFixed(1);

  return {
    totalVisitors: totalVisitorsCurrent,
    visitorChange: `+${visitorChange}%`,
    totalBookings,
    bookingChange: `+${bookingChange}%`,
    totalRevenue,
    revenueChange: `+${revenueChange}%`,
    conversionRate: `${conversionRate}%`,
    avgBookingValue: `$${Number(avgBookingValue).toLocaleString()}`,
    occupancyRate: `${occupancyRate}%`
  };
}

function generateSEOData() {
  return {
    overallScore: 84,
    metrics: [
      { name: 'Page Title Optimization', score: 92, status: 'good' },
      { name: 'Meta Description Quality', score: 87, status: 'good' },
      { name: 'Image Alt Tags', score: 73, status: 'good' },
      { name: 'Mobile Friendliness', score: 96, status: 'good' },
      { name: 'Page Speed Score', score: 78, status: 'good' },
      { name: 'Backlink Quality', score: 65, status: 'needs-improvement' },
      { name: 'Content Freshness', score: 81, status: 'good' },
      { name: 'Schema Markup', score: 58, status: 'needs-improvement' }
    ],
    recommendations: [
      {
        id: 1,
        title: 'Implement Hotel Schema Markup',
        description: 'Add structured data for hotel amenities, pricing, and reviews to enhance SERP appearance.',
        impact: '+15% CTR',
        priority: 'high',
        status: 'pending',
        category: 'Technical SEO'
      },
      {
        id: 2,
        title: 'Optimize Core Web Vitals — LCP',
        description: 'Compress hero images and implement lazy loading to improve Largest Contentful Paint below 2.5s.',
        impact: '+0.8s load improvement',
        priority: 'high',
        status: 'in-progress',
        category: 'Performance'
      },
      {
        id: 3,
        title: 'Build Location-Based Landing Pages',
        description: 'Create dedicated pages for "hotel near [landmark]" keywords targeting high-intent travelers.',
        impact: '+200 visitors/mo',
        priority: 'high',
        status: 'pending',
        category: 'Content'
      },
      {
        id: 4,
        title: 'Improve Internal Linking Structure',
        description: 'Link room pages to amenities, dining, and spa pages to distribute link equity.',
        impact: '+12% page authority',
        priority: 'medium',
        status: 'pending',
        category: 'On-Page SEO'
      },
      {
        id: 5,
        title: 'Launch Monthly Travel Blog',
        description: 'Publish destination guides and local event coverage to capture informational search traffic.',
        impact: '+350 organic visitors/mo',
        priority: 'medium',
        status: 'in-progress',
        category: 'Content'
      },
      {
        id: 6,
        title: 'Build High-Authority Backlinks',
        description: 'Partner with travel bloggers and tourism boards for editorial backlinks.',
        impact: '+18 domain authority pts',
        priority: 'medium',
        status: 'pending',
        category: 'Off-Page SEO'
      },
      {
        id: 7,
        title: 'Fix Duplicate Meta Descriptions',
        description: '14 room pages share identical meta descriptions — differentiate each for better CTR.',
        impact: '+8% organic CTR',
        priority: 'low',
        status: 'completed',
        category: 'On-Page SEO'
      }
    ]
  };
}

function generatePerformanceData() {
  return {
    coreWebVitals: {
      lcp: { value: 2.1, unit: 's', label: 'Largest Contentful Paint', status: 'good', threshold: { good: 2.5, poor: 4.0 } },
      fid: { value: 48, unit: 'ms', label: 'First Input Delay', status: 'good', threshold: { good: 100, poor: 300 } },
      cls: { value: 0.04, unit: '', label: 'Cumulative Layout Shift', status: 'good', threshold: { good: 0.1, poor: 0.25 } },
      fcp: { value: 1.4, unit: 's', label: 'First Contentful Paint', status: 'good', threshold: { good: 1.8, poor: 3.0 } },
      ttfb: { value: 320, unit: 'ms', label: 'Time to First Byte', status: 'good', threshold: { good: 500, poor: 1500 } }
    },
    pageLoadSpeed: {
      mobile: 3.2,
      desktop: 1.8,
      target: 2.5
    },
    devicePerformance: {
      mobile: 74,
      desktop: 91,
      tablet: 82
    },
    uptimePercent: 99.97,
    avgResponseTime: 186,
    errorRate: 0.12
  };
}

function generateRevenueData() {
  // Comfort Inn Huntsville — 70 rooms, mid-scale business hotel near UAH
  const roomTypes = [
    { type: 'Standard Queen',    rooms: 28, rate: 99,  occupancy: 74, color: '#3b82f6' },
    { type: 'Standard King',     rooms: 22, rate: 109, occupancy: 71, color: '#10b981' },
    { type: 'Double Queen',      rooms: 12, rate: 119, occupancy: 78, color: '#f59e0b' },
    { type: 'King Suite',        rooms:  6, rate: 139, occupancy: 65, color: '#8b5cf6' },
    { type: 'Accessible Room',   rooms:  2, rate: 99,  occupancy: 60, color: '#ec4899' }
  ];

  const channels = [
    { channel: 'Direct Website', percentage: 38, color: '#3b82f6' },
    { channel: 'Booking.com', percentage: 24, color: '#10b981' },
    { channel: 'Expedia', percentage: 16, color: '#f59e0b' },
    { channel: 'Google Hotel Ads', percentage: 12, color: '#8b5cf6' },
    { channel: 'Travel Agent', percentage: 7, color: '#ec4899' },
    { channel: 'Other OTAs', percentage: 3, color: '#64748b' }
  ];

  // Calculate totals
  const totalRevenue30d = roomTypes.reduce((sum, r) => {
    return sum + (r.rooms * r.rate * (r.occupancy / 100) * 30);
  }, 0);

  const totalRooms = roomTypes.reduce((s, r) => s + r.rooms, 0);
  const weightedOccupancy = roomTypes.reduce((s, r) => s + r.rooms * (r.occupancy / 100), 0) / totalRooms;
  const adr = roomTypes.reduce((s, r) => s + r.rooms * r.rate * (r.occupancy / 100), 0) /
              roomTypes.reduce((s, r) => s + r.rooms * (r.occupancy / 100), 0);
  const revpar = adr * weightedOccupancy;

  // Generate 7-day moving average for revenue
  const trafficData = generateTrafficData();
  const movingAvg = [];
  for (let i = 0; i < 30; i++) {
    if (i < 6) {
      movingAvg.push(null);
    } else {
      const slice = trafficData.revenue.slice(i - 6, i + 1);
      movingAvg.push(Math.floor(slice.reduce((a, b) => a + b, 0) / 7));
    }
  }

  return {
    revpar: revpar.toFixed(2),
    adr: adr.toFixed(2),
    occupancyRate: (weightedOccupancy * 100).toFixed(1),
    totalRevenue30d: Math.floor(totalRevenue30d),
    roomTypes,
    channels,
    revenueLabels: trafficData.labels,
    dailyRevenue: trafficData.revenue,
    movingAvg
  };
}

function generateBookingFunnel() {
  // 30-day total visitors for a 70-room Comfort Inn (realistic post-optimization)
  const visitors = 8240;
  return [
    { stage: 'Website Visitors',     count: visitors,                    percentage: 100 },
    { stage: 'Room Pages Viewed',    count: Math.floor(visitors * 0.58), percentage: 58  },
    { stage: 'Checked Availability', count: Math.floor(visitors * 0.26), percentage: 26  },
    { stage: 'Started Booking',      count: Math.floor(visitors * 0.10), percentage: 10  },
    { stage: 'Booking Completed',    count: Math.floor(visitors * 0.055),percentage: 5.5 }
  ];
}

function generateTrafficSources() {
  // Scaled to realistic 30-day traffic for Comfort Inn Huntsville
  return [
    { source: 'Organic Search', visitors: 3210, percentage: 39.0, color: '#10b981' },
    { source: 'Direct',         visitors: 1870, percentage: 22.7, color: '#3b82f6' },
    { source: 'Paid Ads',       visitors: 1340, percentage: 16.3, color: '#f59e0b' },
    { source: 'Booking.com',    visitors:  820, percentage:  9.9, color: '#8b5cf6' },
    { source: 'Referral',       visitors:  620, percentage:  7.5, color: '#ec4899' },
    { source: 'Email',          visitors:  380, percentage:  4.6, color: '#06b6d4' }
  ];
}

function generateGeographicData() {
  // Comfort Inn Huntsville draws mostly domestic US travelers —
  // UAH visitors, NASA/aerospace contractors, regional road trips
  return [
    { country: 'Alabama (Local)',  visitors: 2840, flag: '🇺🇸' },
    { country: 'Tennessee',        visitors: 1620, flag: '🇺🇸' },
    { country: 'Georgia',          visitors: 1180, flag: '🇺🇸' },
    { country: 'Texas',            visitors:  870, flag: '🇺🇸' },
    { country: 'Florida',          visitors:  740, flag: '🇺🇸' },
    { country: 'Mississippi',      visitors:  410, flag: '🇺🇸' },
    { country: 'North Carolina',   visitors:  310, flag: '🇺🇸' },
    { country: 'Virginia',         visitors:  240, flag: '🇺🇸' },
    { country: 'Canada',           visitors:  190, flag: '🇨🇦' },
    { country: 'United Kingdom',   visitors:  140, flag: '🇬🇧' }
  ];
}

function generateDeviceData() {
  return [
    { device: 'Mobile',  percentage: 54, visitors: 4450, color: '#3b82f6' },
    { device: 'Desktop', percentage: 35, visitors: 2884, color: '#10b981' },
    { device: 'Tablet',  percentage: 11, visitors:  906, color: '#f59e0b' }
  ];
}

function generateOptimizationRecommendations() {
  return [
    {
      id: 1,
      title: 'Add Hotel Schema Markup',
      description: 'Implement JSON-LD schema for star rating, amenities, pricing, and check-in/out times.',
      estimatedImpact: '+15% CTR from search',
      category: 'Technical SEO',
      priority: 'high',
      status: 'pending',
      effort: 'Low',
      timeframe: '1-2 days'
    },
    {
      id: 2,
      title: 'Optimize Hero Images with WebP',
      description: 'Convert all room images to WebP format and implement responsive srcset attributes.',
      estimatedImpact: '+0.8s faster load time',
      category: 'Performance',
      priority: 'high',
      status: 'in-progress',
      effort: 'Medium',
      timeframe: '3-5 days'
    },
    {
      id: 3,
      title: 'Create Local Area Guide Blog Posts',
      description: 'Publish 4 articles targeting "things to do near [city]" keywords with high booking intent.',
      estimatedImpact: '+200 visitors/month',
      category: 'Content Marketing',
      priority: 'high',
      status: 'pending',
      effort: 'Medium',
      timeframe: '2-3 weeks'
    },
    {
      id: 4,
      title: 'Enable Browser Caching & CDN',
      description: 'Set cache headers for static assets and route images through a CDN edge network.',
      estimatedImpact: '+40% returning visitor speed',
      category: 'Performance',
      priority: 'medium',
      status: 'completed',
      effort: 'Low',
      timeframe: '1 day'
    },
    {
      id: 5,
      title: 'A/B Test "Book Now" CTA Placement',
      description: 'Test sticky header CTA vs. inline CTA on room pages to improve booking funnel entry.',
      estimatedImpact: '+2.3% conversion rate',
      category: 'CRO',
      priority: 'medium',
      status: 'in-progress',
      effort: 'Low',
      timeframe: '2 weeks'
    },
    {
      id: 6,
      title: 'Build High-Authority Travel Backlinks',
      description: 'Pitch 20 travel publications and tourism boards for editorial coverage and links.',
      estimatedImpact: '+18 Domain Authority pts',
      category: 'Off-Page SEO',
      priority: 'medium',
      status: 'pending',
      effort: 'High',
      timeframe: '1-3 months'
    },
    {
      id: 7,
      title: 'Implement Exit-Intent Popup with Discount',
      description: 'Show 10% off direct booking offer to visitors about to leave without booking.',
      estimatedImpact: '+$8,400 recovered revenue/mo',
      category: 'CRO',
      priority: 'low',
      status: 'pending',
      effort: 'Low',
      timeframe: '2-3 days'
    }
  ];
}

// Real-time activity pool
const activityTemplates = [
  { type: 'view', templates: [
    'User from {city} is viewing {room}',
    'Guest from {city} browsing {room} photos',
    'Visitor from {city} reading {room} details',
    'User from {city} checking {room} amenities'
  ]},
  { type: 'booking', templates: [
    'Booking completed: {nights} nights, {room} — ${amount}',
    'New reservation confirmed: {room}, {nights} nights from {city}',
    'Direct booking received: {room} × {nights} nights — ${amount}'
  ]},
  { type: 'action', templates: [
    'User from {city} clicked "Check Availability"',
    'Guest from {city} added {room} to wishlist',
    'User from {city} requested special occasion package',
    'Visitor from {city} opened live chat support',
    'User from {city} shared {room} to Instagram',
    'Guest from {city} downloaded digital brochure'
  ]},
  { type: 'review', templates: [
    'New 5-star review posted by guest from {city}',
    'Guest from {city} left a review: "Exceptional stay!"',
    'TripAdvisor review submitted — 5 stars from {city}'
  ]}
];

const cities = [
  'Nashville', 'Atlanta', 'Birmingham', 'Memphis', 'Chattanooga',
  'Montgomery', 'Columbus', 'Jackson', 'Knoxville', 'Charlotte',
  'Dallas', 'Houston', 'New Orleans', 'Louisville', 'Tampa',
  'Orlando', 'Richmond', 'Raleigh', 'St. Louis', 'Indianapolis',
  'Decatur', 'Florence', 'Gadsden', 'Tuscaloosa', 'Auburn'
];

const rooms = [
  'Standard Queen', 'Standard King', 'Double Queen', 'King Suite', 'Accessible Room'
];

function generateActivity() {
  const typeData = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
  const template = typeData.templates[Math.floor(Math.random() * typeData.templates.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const room = rooms[Math.floor(Math.random() * rooms.length)];
  const nights = randomBetween(1, 4);
  const amount = randomBetween(89, 420);

  const message = template
    .replace('{city}', city)
    .replace('{room}', room)
    .replace('{nights}', nights)
    .replace('{amount}', amount.toLocaleString());

  return {
    id: Date.now() + Math.random(),
    type: typeData.type,
    message,
    timestamp: new Date().toISOString(),
    timeAgo: 'just now'
  };
}

// ─── API Endpoints ─────────────────────────────────────────────────────────────

app.get('/api/analytics', (req, res) => {
  const trafficData = generateTrafficData();
  const kpis = generateKPIs(trafficData);
  const funnel = generateBookingFunnel();
  const sources = generateTrafficSources();
  const geo = generateGeographicData();
  const devices = generateDeviceData();

  res.json({
    success: true,
    data: {
      kpis,
      traffic: {
        labels: trafficData.labels,
        beforeOptimization: trafficData.beforeOptimization,
        afterOptimization: trafficData.afterOptimization,
        optimizationDay: 10
      },
      bookings: {
        labels: trafficData.labels,
        values: trafficData.bookings
      },
      funnel,
      sources,
      geo,
      devices
    }
  });
});

app.get('/api/seo', (req, res) => {
  res.json({
    success: true,
    data: generateSEOData()
  });
});

app.get('/api/performance', (req, res) => {
  res.json({
    success: true,
    data: generatePerformanceData()
  });
});

app.get('/api/revenue', (req, res) => {
  res.json({
    success: true,
    data: generateRevenueData()
  });
});

app.get('/api/realtime', (req, res) => {
  // Realistic live stats for a 70-room mid-scale hotel
  const visitorCount = randomBetween(4, 18);
  const activities = Array.from({ length: 8 }, () => generateActivity());
  const activeCountries = ['AL', 'TN', 'GA', 'TX', 'FL', 'NC', 'MS'].slice(0, randomBetween(2, 5));

  res.json({
    success: true,
    data: {
      liveVisitors: visitorCount,
      activity: activities,
      activeCountries,
      activeRooms: randomBetween(2, 6),
      pendingBookings: randomBetween(1, 4),
      todayBookings: randomBetween(3, 10),
      todayRevenue: randomBetween(4200, 6800)   // 70 rooms × ~$109 ADR × ~65-75% occupancy
    }
  });
});

app.get('/api/recommendations', (req, res) => {
  res.json({
    success: true,
    data: generateOptimizationRecommendations()
  });
});

// ─── Fallback ─────────────────────────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  HotelPulse Analytics Platform`);
  console.log(`  ================================`);
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log(`  Press Ctrl+C to stop\n`);
});
