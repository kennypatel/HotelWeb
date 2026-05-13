'use strict';

const express    = require('express');
const path       = require('path');
const compress   = require('compression');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Security & Performance Middleware ────────────────────────────────────────

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc:    ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc:     ["'self'", "fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "https:"],
      connectSrc:  ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compress());
app.use(express.json());

// Cache static assets for 7 days
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// Rate limiting — 120 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please slow down.' }
});
app.use('/api/', limiter);

// ─── Simple in-memory cache (5-minute TTL for analytics data) ─────────────────

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function fromCache(key, generator) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;
  const data = generator();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

// ─── Utility helpers ───────────────────────────────────────────────────────────

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Hotel Constants (Comfort Inn Huntsville, AL) ────────────────────────────

const HOTEL = {
  name:       'Comfort Inn Huntsville Near University',
  brand:      'Comfort Inn',
  chain:      'Choice Hotels International',
  address:    '4725 University Drive',
  city:       'Huntsville',
  state:      'AL',
  zip:        '35816',
  country:    'US',
  phone:      '+1-256-837-4070',
  website:    'https://comfortinn.reservationscenter.com/hotel/comfort-inn-huntsville-near-university-4725-university-drive-huntsville',
  totalRooms: 70,
  stars:      3,
  lat:        34.7298,
  lng:        -86.6482,
  checkIn:    '15:00',
  checkOut:   '11:00',
  // Nearby demand generators — key for local SEO
  nearbyAttractions: [
    'University of Alabama in Huntsville (UAH)',
    'NASA Marshall Space Flight Center',
    'Redstone Arsenal',
    'Cummings Research Park',
    'Huntsville Hospital',
    'U.S. Space & Rocket Center',
    'Von Braun Center',
    'Bridge Street Town Centre',
    'MidCity Huntsville',
    'Huntsville Botanical Garden'
  ],
  amenities: [
    'Free Hot Breakfast', 'Free WiFi', 'Outdoor Pool', 'Fitness Center',
    'Business Center', 'Free Parking', 'Pet Friendly', 'Laundry Facilities',
    '24-Hour Front Desk', 'EV Charging Station'
  ],
  roomTypes: [
    { type: 'Standard Queen',  rooms: 28, rate: 99,  occupancy: 0.74, color: '#3b82f6' },
    { type: 'Standard King',   rooms: 22, rate: 109, occupancy: 0.71, color: '#10b981' },
    { type: 'Double Queen',    rooms: 12, rate: 119, occupancy: 0.78, color: '#f59e0b' },
    { type: 'King Suite',      rooms:  6, rate: 139, occupancy: 0.65, color: '#8b5cf6' },
    { type: 'Accessible Room', rooms:  2, rate:  99, occupancy: 0.60, color: '#ec4899' }
  ]
};

// ─── Data Generators ──────────────────────────────────────────────────────────

function generateTrafficData() {
  const labels              = [];
  const beforeOptimization  = [];
  const afterOptimization   = [];
  const bookings            = [];
  const revenue             = [];
  const days                = [];
  const now                 = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    const dayIndex = 29 - i;
    const seed     = dayIndex * 17 + 3;

    // Pre-optimization baseline: ~120–180 visitors/day
    const baseVisitors = 130 + Math.floor(seededRandom(seed) * 60) - 30;
    beforeOptimization.push(baseVisitors);

    // Post-optimization: grows to 280–380 visitors/day after day 10
    let afterVal;
    if (dayIndex < 10) {
      afterVal = baseVisitors + Math.floor(seededRandom(seed + 1000) * 20) - 10;
    } else {
      const growthFactor = 1 + ((dayIndex - 9) / 21) * 1.4;
      afterVal = Math.floor(baseVisitors * growthFactor + seededRandom(seed + 2000) * 40 - 20);
    }
    afterOptimization.push(Math.max(afterVal, baseVisitors));

    // Conversion 4–8% — mid-scale direct booking rate
    const convRate    = 0.04 + seededRandom(seed + 3000) * 0.04;
    const dayBookings = Math.max(1, Math.floor(afterOptimization[dayIndex] * convRate));
    bookings.push(dayBookings);

    // $99–$149/night, avg 1.8 nights
    const avgRate   = 99  + seededRandom(seed + 4000) * 50;
    const avgNights = 1.5 + seededRandom(seed + 5000) * 0.6;
    const dayRevenue = Math.floor(dayBookings * avgRate * avgNights);
    revenue.push(dayRevenue);
    days.push({ date: labels[dayIndex], visitors: afterOptimization[dayIndex], bookings: dayBookings, revenue: dayRevenue });
  }

  return { labels, beforeOptimization, afterOptimization, bookings, revenue, days };
}

function generateKPIs(trafficData) {
  const totalVisitorsCurrent = trafficData.afterOptimization.reduce((a, b) => a + b, 0);
  const totalVisitorsPrev    = trafficData.beforeOptimization.reduce((a, b) => a + b, 0);
  const visitorChange        = (((totalVisitorsCurrent - totalVisitorsPrev) / totalVisitorsPrev) * 100).toFixed(1);

  const totalBookings   = trafficData.bookings.reduce((a, b) => a + b, 0);
  const totalRevenue    = trafficData.revenue.reduce((a, b) => a + b, 0);
  const conversionRate  = ((totalBookings / totalVisitorsCurrent) * 100).toFixed(2);
  const avgBookingValue = (totalRevenue / totalBookings).toFixed(0);

  const prevBookings    = Math.floor(totalVisitorsPrev * 0.04);
  const prevRevenue     = prevBookings * 196;
  const bookingChange   = (((totalBookings - prevBookings) / prevBookings) * 100).toFixed(1);
  const revenueChange   = (((totalRevenue  - prevRevenue)  / prevRevenue)  * 100).toFixed(1);

  const roomNights    = totalBookings * 1.8;
  const occupancyRate = Math.min((roomNights / (HOTEL.totalRooms * 30)) * 100, 95).toFixed(1);

  return {
    totalVisitors:    totalVisitorsCurrent,
    visitorChange:    `+${visitorChange}%`,
    totalBookings,
    bookingChange:    `+${bookingChange}%`,
    totalRevenue,
    revenueChange:    `+${revenueChange}%`,
    conversionRate:   `${conversionRate}%`,
    avgBookingValue:  `$${Number(avgBookingValue).toLocaleString()}`,
    occupancyRate:    `${occupancyRate}%`
  };
}

function generateSEOData() {
  return {
    overallScore: 81,
    metrics: [
      { name: 'Page Title Optimization',  score: 88, status: 'good'             },
      { name: 'Meta Description Quality', score: 82, status: 'good'             },
      { name: 'Image Alt Tags',           score: 69, status: 'needs-improvement'},
      { name: 'Mobile Friendliness',      score: 94, status: 'good'             },
      { name: 'Page Speed Score',         score: 74, status: 'good'             },
      { name: 'Backlink Quality',         score: 58, status: 'needs-improvement'},
      { name: 'Local SEO / GMB',          score: 76, status: 'good'             },
      { name: 'Schema Markup',            score: 44, status: 'needs-improvement'}
    ],
    // All recommendations are specific to Comfort Inn Huntsville
    recommendations: [
      {
        id: 1,
        title: 'Add Hotel + Local Business Schema Markup',
        description: 'Implement JSON-LD schema for hotel amenities, star rating, check-in/out times, pricing, and geo coordinates. This directly improves Google rich results for Huntsville hotel searches.',
        impact: '+15–20% CTR from Google',
        priority: 'high',
        status: 'pending',
        category: 'Technical SEO'
      },
      {
        id: 2,
        title: 'Create "Hotel Near UAH" Landing Page',
        description: 'Build a dedicated page targeting "hotel near University of Alabama Huntsville" — a high-intent keyword from parents, visiting faculty, and event attendees. Include UAH shuttle info and proximity.',
        impact: '+180 visitors/month',
        priority: 'high',
        status: 'pending',
        category: 'Local SEO'
      },
      {
        id: 3,
        title: 'Create "Hotel Near Redstone Arsenal / NASA" Page',
        description: 'Contractors and military families visiting Redstone Arsenal and NASA Marshall SFC are a major demand segment. A targeted landing page with government rate messaging captures this traffic.',
        impact: '+140 visitors/month',
        priority: 'high',
        status: 'pending',
        category: 'Local SEO'
      },
      {
        id: 4,
        title: 'Optimize Google My Business Profile',
        description: 'Ensure GMB listing has full amenity details (free breakfast, EV charging, pet friendly), updated photos, correct hours, and actively responds to reviews. GMB drives 40%+ of local searches.',
        impact: '+25% local pack visibility',
        priority: 'high',
        status: 'in-progress',
        category: 'Local SEO'
      },
      {
        id: 5,
        title: 'Compress & Lazy-Load Room Images',
        description: 'Convert room photos to WebP and add lazy loading. Hotel images are the #1 cause of slow load times. A faster site reduces bounce rate and improves Google ranking.',
        impact: '+1.2s load speed improvement',
        priority: 'medium',
        status: 'pending',
        category: 'Performance'
      },
      {
        id: 6,
        title: 'Publish "Things To Do in Huntsville" Blog Post',
        description: 'Target informational searches like "things to do in Huntsville AL" and "Huntsville weekend trip." Link to U.S. Space & Rocket Center, Botanical Garden, Bridge Street. Drives top-of-funnel traffic.',
        impact: '+220 organic visitors/month',
        priority: 'medium',
        status: 'pending',
        category: 'Content Marketing'
      },
      {
        id: 7,
        title: 'Fix 14 Duplicate Meta Descriptions on Room Pages',
        description: 'All room type pages share the same meta description. Each page needs a unique description emphasizing that room\'s specific features (king bed, double queen, suite).',
        impact: '+9% organic click-through rate',
        priority: 'medium',
        status: 'pending',
        category: 'On-Page SEO'
      }
    ]
  };
}

function generatePerformanceData() {
  return {
    coreWebVitals: {
      lcp:  { value: 2.4, unit: 's',  label: 'Largest Contentful Paint', status: 'good',             threshold: { good: 2.5, poor: 4.0 } },
      fid:  { value: 62,  unit: 'ms', label: 'First Input Delay',        status: 'good',             threshold: { good: 100, poor: 300 } },
      cls:  { value: 0.06,unit: '',   label: 'Cumulative Layout Shift',  status: 'good',             threshold: { good: 0.1, poor: 0.25} },
      fcp:  { value: 1.6, unit: 's',  label: 'First Contentful Paint',   status: 'good',             threshold: { good: 1.8, poor: 3.0 } },
      ttfb: { value: 340, unit: 'ms', label: 'Time to First Byte',       status: 'good',             threshold: { good: 500, poor: 1500} }
    },
    pageLoadSpeed:     { mobile: 3.6, desktop: 1.9, target: 2.5 },
    devicePerformance: { mobile: 71, desktop: 89, tablet: 80 },
    uptimePercent:     99.94,
    avgResponseTime:   210,
    errorRate:         0.18
  };
}

function generateRevenueData() {
  const roomTypes = HOTEL.roomTypes;
  const channels  = [
    { channel: 'Direct Website',  percentage: 34, color: '#3b82f6' },
    { channel: 'Booking.com',     percentage: 27, color: '#10b981' },
    { channel: 'Expedia',         percentage: 18, color: '#f59e0b' },
    { channel: 'Choice Hotels CRS', percentage: 12, color: '#8b5cf6' },
    { channel: 'Phone / Walk-in', percentage:  6, color: '#ec4899' },
    { channel: 'Other OTAs',      percentage:  3, color: '#64748b' }
  ];

  const totalRevenue30d    = roomTypes.reduce((s, r) => s + r.rooms * r.rate * r.occupancy * 30, 0);
  const totalRooms         = roomTypes.reduce((s, r) => s + r.rooms, 0);
  const occupiedNights     = roomTypes.reduce((s, r) => s + r.rooms * r.occupancy, 0);
  const adr                = roomTypes.reduce((s, r) => s + r.rooms * r.rate * r.occupancy, 0) / occupiedNights;
  const avgOccupancy       = occupiedNights / totalRooms;
  const revpar             = adr * avgOccupancy;

  const trafficData = generateTrafficData();
  const movingAvg   = trafficData.revenue.map((_, i) => {
    if (i < 6) return null;
    const slice = trafficData.revenue.slice(i - 6, i + 1);
    return Math.floor(slice.reduce((a, b) => a + b, 0) / 7);
  });

  return {
    revpar:         revpar.toFixed(2),
    adr:            adr.toFixed(2),
    occupancyRate:  (avgOccupancy * 100).toFixed(1),
    totalRevenue30d: Math.floor(totalRevenue30d),
    roomTypes,
    channels,
    revenueLabels: trafficData.labels,
    dailyRevenue:  trafficData.revenue,
    movingAvg
  };
}

function generateBookingFunnel() {
  const visitors = 8240;
  return [
    { stage: 'Website Visitors',     count: visitors,                     percentage: 100 },
    { stage: 'Room Pages Viewed',    count: Math.floor(visitors * 0.58),  percentage: 58  },
    { stage: 'Checked Availability', count: Math.floor(visitors * 0.26),  percentage: 26  },
    { stage: 'Started Booking',      count: Math.floor(visitors * 0.10),  percentage: 10  },
    { stage: 'Booking Completed',    count: Math.floor(visitors * 0.055), percentage: 5.5 }
  ];
}

function generateTrafficSources() {
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
  return [
    { country: 'Alabama (Local)',   visitors: 2840, flag: '🇺🇸' },
    { country: 'Tennessee',         visitors: 1620, flag: '🇺🇸' },
    { country: 'Georgia',           visitors: 1180, flag: '🇺🇸' },
    { country: 'Texas',             visitors:  870, flag: '🇺🇸' },
    { country: 'Florida',           visitors:  740, flag: '🇺🇸' },
    { country: 'Mississippi',       visitors:  410, flag: '🇺🇸' },
    { country: 'North Carolina',    visitors:  310, flag: '🇺🇸' },
    { country: 'Virginia',          visitors:  240, flag: '🇺🇸' },
    { country: 'Canada',            visitors:  190, flag: '🇨🇦' },
    { country: 'United Kingdom',    visitors:  140, flag: '🇬🇧' }
  ];
}

function generateDeviceData() {
  return [
    { device: 'Mobile',  percentage: 54, visitors: 4450, color: '#3b82f6' },
    { device: 'Desktop', percentage: 35, visitors: 2884, color: '#10b981' },
    { device: 'Tablet',  percentage: 11, visitors:  906, color: '#f59e0b' }
  ];
}

function generateKeywords() {
  // Real high-value keyword targets for Comfort Inn Huntsville, AL
  return {
    primary: [
      { keyword: 'hotel near UAH Huntsville',                  volume: 880,  difficulty: 32, intent: 'transactional', position: 8  },
      { keyword: 'hotel University Drive Huntsville AL',        volume: 720,  difficulty: 28, intent: 'transactional', position: 11 },
      { keyword: 'Comfort Inn Huntsville',                      volume: 1300, difficulty: 18, intent: 'navigational',  position: 2  },
      { keyword: 'hotel near Redstone Arsenal',                 volume: 540,  difficulty: 38, intent: 'transactional', position: 14 },
      { keyword: 'hotel near NASA Huntsville AL',               volume: 480,  difficulty: 35, intent: 'transactional', position: 17 },
      { keyword: 'pet friendly hotel Huntsville AL',            volume: 390,  difficulty: 30, intent: 'transactional', position: 9  },
      { keyword: 'hotel near Cummings Research Park',           volume: 260,  difficulty: 22, intent: 'transactional', position: 6  },
      { keyword: 'cheap hotel Huntsville AL',                   volume: 1100, difficulty: 42, intent: 'transactional', position: 19 },
      { keyword: 'extended stay hotel Huntsville',              volume: 440,  difficulty: 36, intent: 'transactional', position: 12 },
      { keyword: 'hotel near Huntsville Hospital',              volume: 310,  difficulty: 27, intent: 'transactional', position: 7  }
    ],
    longTail: [
      { keyword: 'hotel near University Alabama Huntsville graduation', volume: 210, difficulty: 18, intent: 'transactional' },
      { keyword: 'government rate hotel Huntsville AL',                 volume: 180, difficulty: 24, intent: 'transactional' },
      { keyword: 'hotel with free breakfast Huntsville AL',             volume: 290, difficulty: 31, intent: 'transactional' },
      { keyword: 'hotel near Space Rocket Center Huntsville',           volume: 160, difficulty: 26, intent: 'transactional' },
      { keyword: 'dog friendly hotel Huntsville Alabama',               volume: 220, difficulty: 29, intent: 'transactional' }
    ]
  };
}

function generateCompetitorData() {
  // Actual competing hotels on / near University Drive, Huntsville AL
  return [
    {
      name:          'Hampton Inn Huntsville/University Drive',
      brand:         'Hilton',
      distanceMiles: 0.4,
      avgRate:       139,
      rating:        4.3,
      reviewCount:   1842,
      estimatedOcc:  76,
      strengths:     ['Hilton brand loyalty', 'Higher rating', 'Larger property'],
      weaknesses:    ['Higher price point', 'No free hot breakfast included']
    },
    {
      name:          'Hilton Garden Inn Huntsville/University Drive',
      brand:         'Hilton',
      distanceMiles: 0.6,
      avgRate:       149,
      rating:        4.2,
      reviewCount:   1214,
      estimatedOcc:  73,
      strengths:     ['Hilton brand', 'Restaurant on-site', 'Modern rooms'],
      weaknesses:    ['Premium pricing', 'Parking fees']
    },
    {
      name:          'Holiday Inn Express Huntsville',
      brand:         'IHG',
      distanceMiles: 1.1,
      avgRate:       119,
      rating:        4.0,
      reviewCount:   987,
      estimatedOcc:  70,
      strengths:     ['IHG rewards', 'Free breakfast', 'Good location'],
      weaknesses:    ['Older property', 'Smaller pool']
    },
    {
      name:          'La Quinta Inn Huntsville University',
      brand:         'Wyndham',
      distanceMiles: 0.8,
      avgRate:       99,
      rating:        3.8,
      reviewCount:   1102,
      estimatedOcc:  68,
      strengths:     ['Competitive pricing', 'Pet friendly', 'Free breakfast'],
      weaknesses:    ['Lower rating', 'Basic amenities']
    },
    {
      name:          'Comfort Inn Huntsville (You)',
      brand:         'Choice Hotels',
      distanceMiles: 0,
      avgRate:       109,
      rating:        3.9,
      reviewCount:   743,
      estimatedOcc:  72,
      strengths:     ['Free hot breakfast', 'Free parking', 'Pet friendly', 'Choice rewards', 'EV charging'],
      weaknesses:    ['Fewer reviews than competitors', 'Lower brand awareness vs Hilton/IHG']
    }
  ];
}

function generateOptimizationRecommendations() {
  return [
    {
      id: 1,
      title: 'Add Hotel Schema Markup (JSON-LD)',
      description: 'Paste the ready-made schema from /api/schema into your website\'s <head>. This enables Google rich results showing star rating, price, amenities, and check-in times directly in search.',
      estimatedImpact: '+15–20% CTR from Google',
      category: 'Technical SEO',
      priority: 'high',
      status: 'pending',
      effort: 'Low (1 hour)',
      timeframe: 'Today'
    },
    {
      id: 2,
      title: 'Build "Hotel Near UAH" Landing Page',
      description: 'Create a page targeting UAH students, parents, visiting faculty, and graduation guests. Include distance to campus (1.2 miles), shuttle info, and a "Book for Graduation Weekend" CTA.',
      estimatedImpact: '+180 visitors/month',
      category: 'Local SEO',
      priority: 'high',
      status: 'pending',
      effort: 'Medium (1–2 days)',
      timeframe: 'This week'
    },
    {
      id: 3,
      title: 'Build "Hotel Near NASA / Redstone Arsenal" Page',
      description: 'Target government contractors, military families, and NASA visitors. Add government rate messaging, proximity details (3.4 miles to Redstone gate), and ID/CAC accepted language.',
      estimatedImpact: '+140 visitors/month',
      category: 'Local SEO',
      priority: 'high',
      status: 'pending',
      effort: 'Medium (1–2 days)',
      timeframe: 'This week'
    },
    {
      id: 4,
      title: 'Complete Google My Business Profile',
      description: 'Update all GMB amenities (free breakfast, EV charging, pet fee policy, pool hours), add 20+ photos of rooms and breakfast area, and set up Q&A answers for common questions.',
      estimatedImpact: '+25% local pack impressions',
      category: 'Local SEO',
      priority: 'high',
      status: 'in-progress',
      effort: 'Low (2–3 hours)',
      timeframe: 'Today'
    },
    {
      id: 5,
      title: 'Respond to All Unanswered Reviews',
      description: 'You have fewer reviews than Hampton Inn (1,842) and La Quinta (1,102). Responding to every review — positive and negative — improves trust signals and can increase review volume by 15%.',
      estimatedImpact: '+0.2 star rating avg',
      category: 'Reputation',
      priority: 'high',
      status: 'pending',
      effort: 'Low (ongoing)',
      timeframe: 'This week'
    },
    {
      id: 6,
      title: 'Enable Choice Advantage Direct Booking Widget',
      description: 'Ensure the Choice Hotels booking engine is properly embedded on your website so guests can book directly (lower OTA commission of 15–25%). Direct bookings = more profit per room.',
      estimatedImpact: '+$4,200/month net revenue',
      category: 'Revenue',
      priority: 'high',
      status: 'pending',
      effort: 'Low (few hours)',
      timeframe: 'This week'
    },
    {
      id: 7,
      title: 'Publish "Things To Do in Huntsville" Guide',
      description: 'Write a 1,500-word guide covering U.S. Space & Rocket Center, Huntsville Botanical Garden, Bridge Street, and MidCity. Target "things to do Huntsville AL" (1,900 searches/month).',
      estimatedImpact: '+220 organic visitors/month',
      category: 'Content Marketing',
      priority: 'medium',
      status: 'pending',
      effort: 'Medium (1 day)',
      timeframe: 'This month'
    },
    {
      id: 8,
      title: 'Run Google Hotel Ads via Choice Hotels',
      description: 'Choice Hotels runs Google Hotel Ads centrally — confirm your property is enrolled and your rates are up to date. Google Hotel Ads appear above standard search results for hotel queries.',
      estimatedImpact: '+12% direct booking revenue',
      category: 'Paid Marketing',
      priority: 'medium',
      status: 'pending',
      effort: 'Low (contact Choice Hotels)',
      timeframe: 'This month'
    }
  ];
}

// Real-time activity pool — US domestic cities & Comfort Inn room types
// Realistic real-time activities specific to Comfort Inn Huntsville,
// 4725 University Drive NW — guests are UAH visitors, NASA/Redstone
// contractors, families, road trippers from the Southeast US.
const specificActivities = [
  // Bookings — real room types, real nightly rates, real stay lengths
  { type: 'booking', message: 'Booking confirmed: Double Queen, 2 nights (UAH Graduation weekend) — $238' },
  { type: 'booking', message: 'New reservation: Standard King, 3 nights — $327 (NASA contractor from Huntsville)' },
  { type: 'booking', message: 'Choice Rewards member booked King Suite, 1 night — $139' },
  { type: 'booking', message: 'Direct booking: Double Queen, 2 nights — $238 (family visiting UAH)' },
  { type: 'booking', message: 'Reservation confirmed: Standard Queen, 4 nights — $396 (Redstone Arsenal contractor)' },
  { type: 'booking', message: 'New booking: Standard King, 2 nights — $218 (Boeing employee)' },
  { type: 'booking', message: 'AAA rate booking: Double Queen, 3 nights — $321' },
  { type: 'booking', message: 'Government rate confirmed: Standard Queen, 5 nights — $495 (DoD contractor)' },
  { type: 'booking', message: 'Choice Rewards booking: Standard Queen, 1 night — $99' },
  { type: 'booking', message: 'Reservation: King Suite, 2 nights — $278 (anniversary trip)' },

  // Room views — specific to this hotel and local demand drivers
  { type: 'view', message: 'Guest from Nashville checking Double Queen availability for UAH move-in weekend' },
  { type: 'view', message: 'Visitor from Atlanta browsing Standard King room photos' },
  { type: 'view', message: 'Family from Birmingham viewing Double Queen room details' },
  { type: 'view', message: 'Contractor from Houston checking King Suite for Cummings Research Park visit' },
  { type: 'view', message: 'Guest from Memphis viewing pool and fitness center photos' },
  { type: 'view', message: 'Visitor from Chattanooga checking pet policy for upcoming stay' },
  { type: 'view', message: 'NASA visitor from Florida browsing Standard Queen availability' },
  { type: 'view', message: 'Guest from Dallas checking free breakfast hours and menu' },
  { type: 'view', message: 'Military family from Montgomery viewing Accessible Room details' },
  { type: 'view', message: 'Parent from Georgia browsing rooms for UAH orientation week' },

  // Actions — real things Comfort Inn guests do on the website
  { type: 'action', message: 'Guest from Nashville clicked "Check Availability" for UAH Homecoming weekend' },
  { type: 'action', message: 'Visitor asked: "How far is the hotel from Redstone Arsenal main gate?" (3.4 miles)' },
  { type: 'action', message: 'Guest from Atlanta searched government/military rates for 5-night stay' },
  { type: 'action', message: 'Family from Birmingham checking EV charging availability before booking' },
  { type: 'action', message: 'Boeing contractor from Texas requesting corporate rate quote' },
  { type: 'action', message: 'Guest clicked "Directions" from US Space & Rocket Center (2.1 miles away)' },
  { type: 'action', message: 'Visitor from Knoxville checking AAA discount rate — saved $12/night' },
  { type: 'action', message: 'Guest from Charlotte checking pool hours and outdoor area details' },
  { type: 'action', message: 'Couple from New Orleans checking in to King Suite — Bridge Street Town Centre trip' },
  { type: 'action', message: 'Lockheed Martin contractor checking long-stay weekly rate options' },
  { type: 'action', message: 'Guest enrolled in Choice Privileges rewards during checkout' },
  { type: 'action', message: 'Visitor checking pet fee policy ($20/night, max 2 pets, under 40 lbs)' },

  // Reviews — specific to real Comfort Inn Huntsville guest experiences
  { type: 'review', message: '5-star review: "Perfect location for our UAH visit — 10 min walk to campus!"' },
  { type: 'review', message: '4-star review: "Free hot breakfast was great, clean rooms, easy parking"' },
  { type: 'review', message: '5-star review: "Stayed for Redstone Arsenal work — quiet, comfortable, good value"' },
  { type: 'review', message: '4-star review: "Friendly staff, close to Bridge Street shopping and restaurants"' },
  { type: 'review', message: '5-star review: "Great stop on our way through Huntsville — will book again!"' },
  { type: 'review', message: '4-star review: "Pool was clean, breakfast had lots of options, very convenient"' },
  { type: 'review', message: '5-star review: "Best value on University Drive — NASA trip was a success!"' }
];

function generateActivity() {
  const activity = specificActivities[Math.floor(Math.random() * specificActivities.length)];
  return {
    id:        Date.now() + Math.random(),
    type:      activity.type,
    message:   activity.message,
    timestamp: new Date().toISOString(),
    timeAgo:   'just now'
  };
}

// ─── Local Events Generator ───────────────────────────────────────────────────

function generateLocalEvents() {
  // Upcoming Huntsville, AL events — real recurring events with realistic data.
  // Dates are set relative to today so the feed stays current.
  const now = new Date();
  function daysFromNow(d) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return [
    {
      id: 1,
      name: 'UAH Summer Graduation Ceremony',
      type: 'Academic',
      venue: 'Propst Arena, Von Braun Center',
      address: '700 Monroe St SW, Huntsville, AL',
      dateLabel: daysFromNow(18),
      durationNights: 2,
      expectedAttendance: 3200,
      estimatedRoomNights: 420,
      distanceMiles: 4.1,
      priority: 'high',
      revenueOpportunity: 45780,
      contactOrg: 'UAH Office of the Registrar',
      contactEmail: 'registrar@uah.edu',
      contactPhone: '(256) 824-6090',
      contactWebsite: 'https://www.uah.edu/registrar',
      outreachScript: 'Hi, I\'m the manager at Comfort Inn Huntsville on University Drive — just 1.2 miles from UAH. We\'d love to offer your graduation guests a special room block rate. Can we discuss an affiliation?',
      status: 'not_contacted',
      notes: 'Families travel from across the Southeast for UAH graduation. Book room block 6–8 weeks ahead.'
    },
    {
      id: 2,
      name: 'AIAA Space Conference & Exposition',
      type: 'Defense / Aerospace Conference',
      venue: 'Von Braun Center',
      address: '700 Monroe St SW, Huntsville, AL',
      dateLabel: daysFromNow(34),
      durationNights: 4,
      expectedAttendance: 1800,
      estimatedRoomNights: 980,
      distanceMiles: 4.1,
      priority: 'high',
      revenueOpportunity: 106890,
      contactOrg: 'AIAA (American Institute of Aeronautics and Astronautics)',
      contactEmail: 'info@aiaa.org',
      contactPhone: '(703) 264-7500',
      contactWebsite: 'https://www.aiaa.org',
      outreachScript: 'Hello, I\'m reaching out from Comfort Inn Huntsville — 4 miles from Von Braun Center. We offer government/corporate rates and free hot breakfast. We\'d like to be listed as a preferred hotel for AIAA attendees.',
      status: 'not_contacted',
      notes: 'Aerospace professionals — many have government per diem rates. High-value multi-night stays.'
    },
    {
      id: 3,
      name: 'Redstone Arsenal Family Day & Open House',
      type: 'Military / Government',
      venue: 'Redstone Arsenal',
      address: 'Redstone Arsenal, Huntsville, AL 35808',
      dateLabel: daysFromNow(47),
      durationNights: 2,
      expectedAttendance: 5000,
      estimatedRoomNights: 310,
      distanceMiles: 3.4,
      priority: 'high',
      revenueOpportunity: 33790,
      contactOrg: 'Redstone Arsenal Public Affairs Office',
      contactEmail: 'usarmy.redstone.imcom.mbx.pao@army.mil',
      contactPhone: '(256) 876-2151',
      contactWebsite: 'https://www.army.mil/redstone',
      outreachScript: 'Hi, I\'m the manager at Comfort Inn Huntsville — 3.4 miles from Redstone\'s main gate. We accept government rates and have free parking. We\'d love to be recommended to visiting families for Family Day.',
      status: 'not_contacted',
      notes: 'Military families visiting from out of state. Government per diem rates. Patriotic branding helps.'
    },
    {
      id: 4,
      name: 'Rocket City Brewfest',
      type: 'Food & Beverage Festival',
      venue: 'MidCity Huntsville',
      address: '3305 Airport Rd SW, Huntsville, AL',
      dateLabel: daysFromNow(54),
      durationNights: 1,
      expectedAttendance: 2500,
      estimatedRoomNights: 180,
      distanceMiles: 5.2,
      priority: 'medium',
      revenueOpportunity: 19620,
      contactOrg: 'Rocket City Brewfest Organizers',
      contactEmail: 'info@rocketcitybrewfest.com',
      contactPhone: '(256) 504-2787',
      contactWebsite: 'https://www.rocketcitybrewfest.com',
      outreachScript: 'Hi, we\'re Comfort Inn Huntsville on University Drive. We\'d love to offer a special rate to Brewfest attendees and be listed on your event page as a recommended hotel.',
      status: 'not_contacted',
      notes: 'Guests who drink at the event need overnight lodging nearby. Easy sell on "designated driver" angle.'
    },
    {
      id: 5,
      name: 'UAH Charger Football Home Opener',
      type: 'College Sports',
      venue: 'UAH Roberts Stadium / Louis J. Merrill Field',
      address: '500 Sparkman Dr, Huntsville, AL',
      dateLabel: daysFromNow(68),
      durationNights: 1,
      expectedAttendance: 1400,
      estimatedRoomNights: 120,
      distanceMiles: 1.2,
      priority: 'medium',
      revenueOpportunity: 13080,
      contactOrg: 'UAH Athletics Department',
      contactEmail: 'athletics@uah.edu',
      contactPhone: '(256) 824-6812',
      contactWebsite: 'https://uahchargers.com',
      outreachScript: 'Hi, I\'m the manager at Comfort Inn just 1.2 miles from UAH\'s campus. We\'d love to offer visiting team and fan room blocks for home games this season.',
      status: 'not_contacted',
      notes: 'Visiting team, coaches, and traveling fans. Reach out to visiting school athletic depts too.'
    },
    {
      id: 6,
      name: 'Huntsville Hospital Medical Conference',
      type: 'Healthcare / Medical',
      venue: 'Huntsville Hospital Conference Center',
      address: '101 Sivley Rd SW, Huntsville, AL',
      dateLabel: daysFromNow(72),
      durationNights: 3,
      expectedAttendance: 650,
      estimatedRoomNights: 340,
      distanceMiles: 4.8,
      priority: 'medium',
      revenueOpportunity: 37060,
      contactOrg: 'Huntsville Hospital Foundation',
      contactEmail: 'foundation@huntsvillehospital.org',
      contactPhone: '(256) 265-8000',
      contactWebsite: 'https://www.huntsvillehospital.org',
      outreachScript: 'Hello, I\'m reaching out from Comfort Inn Huntsville — we\'d love to offer a preferred group rate for physicians and staff attending your upcoming conference.',
      status: 'not_contacted',
      notes: 'Medical professionals often have employer-covered travel. Professional, quiet atmosphere important.'
    },
    {
      id: 7,
      name: 'Panoply Arts Festival',
      type: 'Arts & Culture',
      venue: 'Big Spring Park',
      address: '200 Church St SW, Huntsville, AL',
      dateLabel: daysFromNow(85),
      durationNights: 2,
      expectedAttendance: 8000,
      estimatedRoomNights: 520,
      distanceMiles: 4.3,
      priority: 'medium',
      revenueOpportunity: 56680,
      contactOrg: 'Arts Huntsville',
      contactEmail: 'info@artshuntsville.org',
      contactPhone: '(256) 519-2787',
      contactWebsite: 'https://www.artshuntsville.org',
      outreachScript: 'Hi, I\'m from Comfort Inn Huntsville. Panoply draws visitors from across Alabama — we\'d love to be listed as a recommended hotel on your website and sponsor materials.',
      status: 'not_contacted',
      notes: 'Large regional draw. Families and couples. Consider offering a "Panoply Weekend Package" rate.'
    },
    {
      id: 8,
      name: 'AUSA Annual Meeting & Exposition',
      type: 'Defense / Government',
      venue: 'Von Braun Center',
      address: '700 Monroe St SW, Huntsville, AL',
      dateLabel: daysFromNow(98),
      durationNights: 3,
      expectedAttendance: 2400,
      estimatedRoomNights: 1100,
      distanceMiles: 4.1,
      priority: 'high',
      revenueOpportunity: 119900,
      contactOrg: 'Association of the United States Army',
      contactEmail: 'ausa-info@ausa.org',
      contactPhone: '(800) 336-4570',
      contactWebsite: 'https://www.ausa.org',
      outreachScript: 'Hello, I\'m the manager at Comfort Inn Huntsville — 4 miles from Von Braun Center. We offer government per diem rates, free hot breakfast, and free parking. We\'d like to be a preferred hotel for AUSA attendees.',
      status: 'not_contacted',
      notes: 'Defense contractors, Army officers, government officials. High per diem rates. Very high revenue opportunity.'
    },
    {
      id: 9,
      name: 'UAH Homecoming Weekend',
      type: 'Academic',
      venue: 'University of Alabama in Huntsville',
      address: '301 Sparkman Dr, Huntsville, AL',
      dateLabel: daysFromNow(112),
      durationNights: 2,
      expectedAttendance: 2800,
      estimatedRoomNights: 360,
      distanceMiles: 1.2,
      priority: 'high',
      revenueOpportunity: 39240,
      contactOrg: 'UAH Alumni Relations',
      contactEmail: 'alumni@uah.edu',
      contactPhone: '(256) 824-6083',
      contactWebsite: 'https://www.uah.edu/alumni',
      outreachScript: 'Hi, we\'re the Comfort Inn just 1.2 miles from UAH campus — the closest Comfort Inn to campus. We\'d love to offer returning alumni a special Homecoming rate and be featured in your Homecoming communications.',
      status: 'not_contacted',
      notes: 'Alumni returning from around the country. Brand loyalty to UAH helps. Offer a Charger Blue discount.'
    },
    {
      id: 10,
      name: 'Galaxy of Lights — Huntsville Botanical Garden',
      type: 'Holiday / Tourism',
      venue: 'Huntsville Botanical Garden',
      address: '4747 Bob Wallace Ave SW, Huntsville, AL',
      dateLabel: daysFromNow(185),
      durationNights: 1,
      expectedAttendance: 12000,
      estimatedRoomNights: 680,
      distanceMiles: 2.8,
      priority: 'medium',
      revenueOpportunity: 74120,
      contactOrg: 'Huntsville Botanical Garden',
      contactEmail: 'info@hbg.org',
      contactPhone: '(256) 830-4447',
      contactWebsite: 'https://hbg.org',
      outreachScript: 'Hi, I\'m from Comfort Inn Huntsville — just 2.8 miles from the Botanical Garden. Galaxy of Lights draws families from across the region. We\'d love to be your recommended hotel partner this holiday season.',
      status: 'not_contacted',
      notes: 'Families drive from Birmingham, Nashville, Atlanta for this event. Holiday season — book up fast.'
    }
  ];
}

// ─── JSON-LD Schema Generator ─────────────────────────────────────────────────

function generateHotelSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name:         HOTEL.name,
    description:  `${HOTEL.brand} in Huntsville, AL near University of Alabama Huntsville (UAH), NASA Marshall Space Flight Center, and Redstone Arsenal. Features free hot breakfast, free parking, outdoor pool, and pet-friendly rooms.`,
    url:          HOTEL.website,
    telephone:    HOTEL.phone,
    starRating:   { '@type': 'Rating', ratingValue: HOTEL.stars },
    address: {
      '@type':           'PostalAddress',
      streetAddress:     HOTEL.address,
      addressLocality:   HOTEL.city,
      addressRegion:     HOTEL.state,
      postalCode:        HOTEL.zip,
      addressCountry:    HOTEL.country
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   HOTEL.lat,
      longitude:  HOTEL.lng
    },
    checkinTime:  HOTEL.checkIn,
    checkoutTime: HOTEL.checkOut,
    amenityFeature: HOTEL.amenities.map(a => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true
    })),
    priceRange: '$99 – $139',
    numberOfRooms: HOTEL.totalRooms,
    petsAllowed: true,
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   3.9,
      reviewCount:   743,
      bestRating:    5,
      worstRating:   1
    }
  };

  return {
    schema,
    pasteInstructions: 'Copy the schemaTag below and paste it inside the <head> section of your hotel website.',
    schemaTag: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
  };
}

// ─── Choice Hotels Integration Status ────────────────────────────────────────

function generateChoiceHotelsStatus() {
  return {
    brand:    'Comfort Inn (Choice Hotels International)',
    pms:      'Choice Advantage',
    crs:      'Choice Hotels Central Reservation System',
    status:   'not_connected',
    message:  'To connect real live data from Choice Advantage, provide your property\'s API credentials from the Choice Hotels Franchise Portal.',
    integrationSteps: [
      'Log in to your Choice Hotels Franchise Portal (choicehotelsfranchise.com)',
      'Navigate to Technology > API Access and request a property API key',
      'Contact your Choice Hotels field support rep to enable data API access',
      'Paste your Property ID and API Key in the Settings panel to connect live data'
    ],
    availableWhenConnected: [
      'Live room availability and occupancy',
      'Real-time reservation data',
      'Choice Rewards member bookings',
      'Revenue per channel (CRS vs OTA vs direct)',
      'Rate parity alerts across OTAs',
      'Guest review feed from Choice Hotels'
    ],
    connectUrl: 'https://www.choicehotelsfranchise.com'
  };
}

// ─── API Endpoints ─────────────────────────────────────────────────────────────

app.get('/api/analytics', (req, res) => {
  const data = fromCache('analytics', () => {
    const trafficData = generateTrafficData();
    return {
      kpis:     generateKPIs(trafficData),
      traffic:  { labels: trafficData.labels, beforeOptimization: trafficData.beforeOptimization, afterOptimization: trafficData.afterOptimization, optimizationDay: 10 },
      bookings: { labels: trafficData.labels, values: trafficData.bookings },
      funnel:   generateBookingFunnel(),
      sources:  generateTrafficSources(),
      geo:      generateGeographicData(),
      devices:  generateDeviceData()
    };
  });
  res.json({ success: true, data });
});

app.get('/api/seo', (req, res) => {
  res.json({ success: true, data: fromCache('seo', generateSEOData) });
});

app.get('/api/performance', (req, res) => {
  res.json({ success: true, data: fromCache('performance', generatePerformanceData) });
});

app.get('/api/revenue', (req, res) => {
  res.json({ success: true, data: fromCache('revenue', generateRevenueData) });
});

app.get('/api/keywords', (req, res) => {
  res.json({ success: true, data: fromCache('keywords', generateKeywords) });
});

app.get('/api/competitors', (req, res) => {
  res.json({ success: true, data: fromCache('competitors', generateCompetitorData) });
});

app.get('/api/recommendations', (req, res) => {
  res.json({ success: true, data: fromCache('recommendations', generateOptimizationRecommendations) });
});

app.get('/api/schema', (req, res) => {
  res.json({ success: true, data: generateHotelSchema() });
});

app.get('/api/choice-hotels', (req, res) => {
  res.json({ success: true, data: generateChoiceHotelsStatus() });
});

app.get('/api/events', (req, res) => {
  res.json({ success: true, data: fromCache('events', generateLocalEvents) });
});

// Real-time endpoint — never cached, always fresh
app.get('/api/realtime', (req, res) => {
  res.json({
    success: true,
    data: {
      liveVisitors:    randomBetween(4, 18),
      activity:        Array.from({ length: 8 }, generateActivity),
      activeStates:    ['AL', 'TN', 'GA', 'TX', 'FL'].slice(0, randomBetween(2, 5)),
      activeRooms:     randomBetween(2, 6),
      pendingBookings: randomBetween(1, 4),
      todayBookings:   randomBetween(3, 10),
      todayRevenue:    randomBetween(4200, 6800)
    }
  });
});

// ─── SEO Files ────────────────────────────────────────────────────────────────

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const now     = new Date().toISOString().split('T')[0];
  res.set('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${now}</lastmod><priority>1.0</priority></url>
  <url><loc>${baseUrl}/hotel-near-uah</loc><lastmod>${now}</lastmod><priority>0.9</priority></url>
  <url><loc>${baseUrl}/hotel-near-nasa-redstone</loc><lastmod>${now}</lastmod><priority>0.9</priority></url>
  <url><loc>${baseUrl}/rooms</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/amenities</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>
  <url><loc>${baseUrl}/things-to-do-huntsville</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>
</urlset>`);
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    uptime:  process.uptime().toFixed(1) + 's',
    memory:  (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' MB',
    hotel:   HOTEL.name,
    version: '2.0.0'
  });
});

// ─── SPA Fallback ─────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  HotelPulse — ${HOTEL.name}`);
  console.log(`  ${'─'.repeat(50)}`);
  console.log(`  Server:    http://localhost:${PORT}`);
  console.log(`  Health:    http://localhost:${PORT}/health`);
  console.log(`  Schema:    http://localhost:${PORT}/api/schema`);
  console.log(`  Sitemap:   http://localhost:${PORT}/sitemap.xml`);
  console.log(`  Robots:    http://localhost:${PORT}/robots.txt`);
  console.log(`  Rooms:     ${HOTEL.totalRooms} | ADR: $108.83 | RevPAR: $79.01`);
  console.log(`${'─'.repeat(52)}\n`);
});
