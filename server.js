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

    const dayIndex = 29 - i; // 0 = oldest, 29 = today
    const seed = dayIndex * 17 + 3;

    // Before optimization baseline: ~700-950 visitors/day, slight noise
    const baseVisitors = 800 + Math.floor(seededRandom(seed) * 150) - 75;
    beforeOptimization.push(baseVisitors);

    // After optimization: day 10+ shows rapid growth to ~2400/day
    let afterVal;
    if (dayIndex < 10) {
      afterVal = baseVisitors + Math.floor(seededRandom(seed + 1000) * 80) - 40;
    } else {
      const growthFactor = 1 + ((dayIndex - 9) / 21) * 2.2;
      afterVal = Math.floor(baseVisitors * growthFactor + seededRandom(seed + 2000) * 200 - 100);
    }
    afterOptimization.push(Math.max(afterVal, baseVisitors));

    // Bookings: 3-8% conversion of after-optimization traffic
    const convRate = 0.03 + seededRandom(seed + 3000) * 0.05;
    const dayBookings = Math.floor(afterOptimization[dayIndex] * convRate);
    bookings.push(dayBookings);

    // Revenue: $175-$420 per booking avg
    const avgRate = 175 + seededRandom(seed + 4000) * 245;
    const avgNights = 1.5 + seededRandom(seed + 5000) * 2;
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

  const totalRooms = 120;
  const roomNights = totalBookings * 2.1;
  const occupancyRate = ((roomNights / (totalRooms * 30)) * 100).toFixed(1);

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
  const roomTypes = [
    { type: 'Standard Room', rooms: 40, rate: 189, occupancy: 78, color: '#3b82f6' },
    { type: 'Deluxe Room', rooms: 35, rate: 259, occupancy: 82, color: '#10b981' },
    { type: 'Ocean View Suite', rooms: 25, rate: 389, occupancy: 71, color: '#f59e0b' },
    { type: 'Junior Suite', rooms: 12, rate: 479, occupancy: 68, color: '#8b5cf6' },
    { type: 'Presidential Suite', rooms: 8, rate: 899, occupancy: 54, color: '#ec4899' }
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
  const visitors = 45820;
  return [
    { stage: 'Website Visitors', count: visitors, percentage: 100 },
    { stage: 'Room Pages Viewed', count: Math.floor(visitors * 0.61), percentage: 61 },
    { stage: 'Checked Availability', count: Math.floor(visitors * 0.28), percentage: 28 },
    { stage: 'Started Booking', count: Math.floor(visitors * 0.12), percentage: 12 },
    { stage: 'Booking Completed', count: Math.floor(visitors * 0.057), percentage: 5.7 }
  ];
}

function generateTrafficSources() {
  return [
    { source: 'Organic Search', visitors: 18420, percentage: 40.2, color: '#10b981' },
    { source: 'Direct', visitors: 9860, percentage: 21.5, color: '#3b82f6' },
    { source: 'Paid Ads', visitors: 7340, percentage: 16.0, color: '#f59e0b' },
    { source: 'Social Media', visitors: 5210, percentage: 11.4, color: '#8b5cf6' },
    { source: 'Referral', visitors: 3180, percentage: 6.9, color: '#ec4899' },
    { source: 'Email', visitors: 1810, percentage: 3.9, color: '#06b6d4' }
  ];
}

function generateGeographicData() {
  return [
    { country: 'United States', visitors: 12840, flag: '🇺🇸' },
    { country: 'United Kingdom', visitors: 6210, flag: '🇬🇧' },
    { country: 'Germany', visitors: 4380, flag: '🇩🇪' },
    { country: 'Australia', visitors: 3920, flag: '🇦🇺' },
    { country: 'Canada', visitors: 3540, flag: '🇨🇦' },
    { country: 'France', visitors: 2870, flag: '🇫🇷' },
    { country: 'Japan', visitors: 2340, flag: '🇯🇵' },
    { country: 'UAE', visitors: 1980, flag: '🇦🇪' },
    { country: 'Singapore', visitors: 1640, flag: '🇸🇬' },
    { country: 'Brazil', visitors: 1290, flag: '🇧🇷' }
  ];
}

function generateDeviceData() {
  return [
    { device: 'Mobile', percentage: 54, visitors: 24762, color: '#3b82f6' },
    { device: 'Desktop', percentage: 35, visitors: 16040, color: '#10b981' },
    { device: 'Tablet', percentage: 11, visitors: 5018, color: '#f59e0b' }
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
  'New York', 'London', 'Sydney', 'Toronto', 'Paris', 'Dubai', 'Singapore',
  'Los Angeles', 'Chicago', 'Amsterdam', 'Berlin', 'Tokyo', 'Miami',
  'Melbourne', 'San Francisco', 'Barcelona', 'Rome', 'Seoul', 'Hong Kong',
  'Boston', 'Seattle', 'Vienna', 'Stockholm', 'Zurich', 'Cape Town'
];

const rooms = [
  'Deluxe Ocean View', 'Presidential Suite', 'Standard King', 'Junior Suite',
  'Penthouse Suite', 'Garden View Room', 'Club Suite', 'Family Suite',
  'Executive Room', 'Ocean View Suite'
];

function generateActivity() {
  const typeData = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
  const template = typeData.templates[Math.floor(Math.random() * typeData.templates.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const room = rooms[Math.floor(Math.random() * rooms.length)];
  const nights = randomBetween(1, 7);
  const amount = randomBetween(249, 1890);

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
  const visitorCount = randomBetween(18, 47);
  const activities = Array.from({ length: 8 }, () => generateActivity());
  const activeCountries = ['US', 'GB', 'AU', 'DE', 'CA', 'FR', 'JP'].slice(0, randomBetween(3, 7));

  res.json({
    success: true,
    data: {
      liveVisitors: visitorCount,
      activity: activities,
      activeCountries,
      activeRooms: randomBetween(6, 14),
      pendingBookings: randomBetween(2, 8),
      todayBookings: randomBetween(12, 31),
      todayRevenue: randomBetween(4200, 11800)
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
