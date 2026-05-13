/* ═══════════════════════════════════════════════════════════════════
   HotelPulse Analytics — Dashboard Controller
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ── Hotel Config ──────────────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  hotelName: 'Comfort Inn Huntsville',
  hotelUrl:  'https://comfortinn.reservationscenter.com/hotel/comfort-inn-huntsville-near-university-4725-university-drive-huntsville',
  roomCount: '70',
  hotelType: 'Business',
  hotelCity: 'Huntsville, AL'
};

function loadConfig() {
  try {
    const saved = localStorage.getItem('hotelConfig');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

function saveConfig(cfg) {
  localStorage.setItem('hotelConfig', JSON.stringify(cfg));
}

function applyConfig(cfg) {
  const name = cfg.hotelName || DEFAULT_CONFIG.hotelName;
  const rooms = cfg.roomCount || DEFAULT_CONFIG.roomCount;
  const type  = cfg.hotelType || '';
  const city  = cfg.hotelCity || '';

  const subtitle = [name, city].filter(Boolean).join(' — ');
  const footerParts = [name, rooms + ' Rooms', type].filter(Boolean).join(' — ');

  const headerEl  = document.getElementById('headerHotelName');
  const revNameEl = document.getElementById('revenueHotelName');
  const revRoomsEl= document.getElementById('revenueRoomCount');
  const footerEl  = document.getElementById('footerHotelInfo');

  if (headerEl)   headerEl.textContent  = subtitle;
  if (revNameEl)  revNameEl.textContent = name;
  if (revRoomsEl) revRoomsEl.textContent= rooms;
  if (footerEl)   footerEl.textContent  = footerParts;

  document.title = `HotelPulse — ${name}`;
}

function initSetupModal() {
  const overlay = document.getElementById('setupModal');
  const form    = document.getElementById('hotelSetupForm');
  const openBtn = document.getElementById('openSettings');

  function openModal(cfg) {
    if (cfg) {
      document.getElementById('inputHotelName').value = cfg.hotelName || '';
      document.getElementById('inputHotelUrl').value  = cfg.hotelUrl  || '';
      document.getElementById('inputRoomCount').value = cfg.roomCount || '';
      document.getElementById('inputHotelType').value = cfg.hotelType || 'Luxury Collection';
      document.getElementById('inputHotelCity').value = cfg.hotelCity || '';
    }
    overlay.classList.remove('hidden');
  }

  function closeModal() {
    overlay.classList.add('hidden');
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const cfg = {
      hotelName: document.getElementById('inputHotelName').value.trim(),
      hotelUrl:  document.getElementById('inputHotelUrl').value.trim(),
      roomCount: document.getElementById('inputRoomCount').value.trim(),
      hotelType: document.getElementById('inputHotelType').value,
      hotelCity: document.getElementById('inputHotelCity').value.trim()
    };
    saveConfig(cfg);
    applyConfig(cfg);
    closeModal();
  });

  openBtn.addEventListener('click', function() {
    openModal(loadConfig());
  });

  const existing = loadConfig();
  if (existing) {
    applyConfig(existing);
    closeModal();
  } else {
    openModal(DEFAULT_CONFIG);
  }
}

// ── State ─────────────────────────────────────────────────────────────────────
const State = {
  analyticsData:   null,
  seoData:         null,
  perfData:        null,
  revenueData:     null,
  realtimeData:    null,
  initialized:     false,
  activityQueue:   [],
  activityTimers:  []
};

// ── Utility helpers ───────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function fmt(n) {
  return Number(n).toLocaleString('en-US');
}

function fmtDollar(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'k';
  return '$' + n;
}

/**
 * Animate a numeric counter from 0 to target.
 * @param {HTMLElement} el
 * @param {number}      target
 * @param {number}      duration   ms
 * @param {Function}    formatter
 */
function animateCounter(el, target, duration = 1200, formatter = fmt) {
  if (!el) return;
  const start    = performance.now();
  const from     = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = from + (target - from) * eased;
    el.textContent = formatter(Math.floor(value));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * Smooth-update a number that's already displayed (subtle pulse).
 */
function smoothUpdate(el, newVal, formatter = fmt) {
  if (!el) return;
  el.style.transition = 'opacity 0.3s ease';
  el.style.opacity    = '0.3';
  setTimeout(() => {
    el.textContent    = formatter(newVal);
    el.style.opacity  = '1';
  }, 300);
}

// ── API fetchers ──────────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ══════════════════════════════════════════════════════════════════════════════
//  LIVE CLOCK
// ══════════════════════════════════════════════════════════════════════════════
function startClock() {
  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    const ss  = String(now.getSeconds()).padStart(2, '0');
    const el  = $('liveClock');
    if (el) el.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ══════════════════════════════════════════════════════════════════════════════
//  KPI CARDS
// ══════════════════════════════════════════════════════════════════════════════
function renderKPIs(kpis, animate = true) {
  const fields = [
    { valId: 'kpiVisitorsValue',  chgId: 'kpiVisitorsChange',  raw: kpis.totalVisitors,  fmt: fmt,        change: kpis.visitorChange },
    { valId: 'kpiBookingsValue',  chgId: 'kpiBookingsChange',  raw: kpis.totalBookings,  fmt: fmt,        change: kpis.bookingChange },
    { valId: 'kpiRevenueValue',   chgId: 'kpiRevenueChange',   raw: kpis.totalRevenue,   fmt: fmtDollar,  change: kpis.revenueChange },
    { valId: 'kpiConversionValue',chgId: 'kpiConversionChange',raw: null,                fmt: null,       change: null, text: kpis.conversionRate },
    { valId: 'kpiAvgBookingValue',chgId: null,                 raw: null,                fmt: null,       change: null, text: kpis.avgBookingValue },
    { valId: 'kpiOccupancyValue', chgId: null,                 raw: null,                fmt: null,       change: null, text: kpis.occupancyRate }
  ];

  fields.forEach(f => {
    const valEl = $(f.valId);
    if (!valEl) return;

    if (f.text) {
      if (animate) {
        valEl.style.opacity = '0';
        setTimeout(() => {
          valEl.textContent = f.text;
          valEl.style.transition = 'opacity 0.5s ease';
          valEl.style.opacity = '1';
        }, 400);
      } else {
        smoothUpdate(valEl, f.text, x => x);
      }
    } else if (f.raw !== null) {
      if (animate) {
        animateCounter(valEl, f.raw, 1400, f.fmt);
      } else {
        smoothUpdate(valEl, f.raw, f.fmt);
      }
    }

    if (f.chgId && f.change) {
      const chgEl = $(f.chgId);
      if (chgEl) {
        const icon = chgEl.querySelector('svg');
        const iconHtml = icon ? icon.outerHTML : '';
        chgEl.innerHTML = iconHtml + ' ' + f.change + ' vs prev. 30 days';
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  SEO PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderSEO(seo) {
  // Score bubble
  const scoreEl = $('seoScoreNum');
  if (scoreEl) {
    scoreEl.textContent = seo.overallScore;
    const bubble = $('seoScoreBubble');
    if (bubble) {
      if (seo.overallScore >= 70) {
        bubble.style.background   = 'rgba(16,185,129,0.15)';
        bubble.style.borderColor  = 'rgba(16,185,129,0.3)';
        scoreEl.style.color       = 'var(--green)';
      } else if (seo.overallScore >= 50) {
        bubble.style.background   = 'rgba(245,158,11,0.15)';
        bubble.style.borderColor  = 'rgba(245,158,11,0.3)';
        scoreEl.style.color       = 'var(--amber)';
      } else {
        bubble.style.background   = 'rgba(239,68,68,0.15)';
        bubble.style.borderColor  = 'rgba(239,68,68,0.3)';
        scoreEl.style.color       = 'var(--red)';
      }
    }
  }

  // Metric rows
  const metricsEl = $('seoMetrics');
  if (metricsEl) {
    metricsEl.innerHTML = seo.metrics.map(m => {
      const color  = m.score >= 80 ? 'var(--green)' : m.score >= 60 ? 'var(--amber)' : 'var(--red)';
      const textCls = m.score >= 80 ? 'text-green' : m.score >= 60 ? 'text-amber' : 'text-red';
      return `
        <div class="seo-metric-row">
          <span class="seo-metric-name">${m.name}</span>
          <div class="seo-progress-bar">
            <div class="seo-progress-fill"
                 style="width:0%; background:${color};"
                 data-target="${m.score}"></div>
          </div>
          <span class="seo-metric-score ${textCls}">${m.score}</span>
        </div>
      `;
    }).join('');

    // Animate progress bars
    requestAnimationFrame(() => {
      metricsEl.querySelectorAll('.seo-progress-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'width 1s ease';
          bar.style.width      = bar.dataset.target + '%';
        }, i * 80);
      });
    });
  }

  // Recommendations
  const recsEl = $('seoRecommendations');
  if (recsEl) {
    recsEl.innerHTML = seo.recommendations.map(r => `
      <div class="seo-rec-item">
        <span class="priority-badge priority-badge--${r.priority}">${r.priority}</span>
        <div class="seo-rec-body">
          <div class="seo-rec-title">${r.title}</div>
          <div class="seo-rec-desc">${r.description}</div>
          <div class="seo-rec-impact">→ Est. Impact: ${r.impact}</div>
        </div>
        <span class="status-badge status-badge--${r.status}">${r.status.replace('-', ' ')}</span>
      </div>
    `).join('');
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  PERFORMANCE PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderPerformance(perf) {
  // Core Web Vitals
  const vitalsEl = $('vitalsGrid');
  if (vitalsEl) {
    const vitals = [
      perf.coreWebVitals.lcp,
      perf.coreWebVitals.fid,
      perf.coreWebVitals.cls,
      perf.coreWebVitals.fcp,
      perf.coreWebVitals.ttfb
    ];

    vitalsEl.innerHTML = vitals.map(v => {
      const s = v.status === 'good' ? 'good' : v.status === 'needs-improvement' ? 'needs-improvement' : 'poor';
      return `
        <div class="vital-card">
          <div class="vital-value vital-value--${s}">
            ${v.value}<span class="vital-unit">${v.unit}</span>
          </div>
          <div class="vital-label">${v.label}</div>
          <span class="vital-status vital-status--${s}">${v.status.replace('-', ' ')}</span>
        </div>
      `;
    }).join('');
  }

  // Page Load Speed bars
  const speedEl = $('speedBars');
  if (speedEl) {
    const maxSpeed = 5.0;
    const speeds = [
      { label: 'Mobile', value: perf.pageLoadSpeed.mobile, color: '#3b82f6' },
      { label: 'Desktop', value: perf.pageLoadSpeed.desktop, color: '#10b981' },
      { label: 'Target',  value: perf.pageLoadSpeed.target,  color: '#64748b' }
    ];

    speedEl.innerHTML = speeds.map(s => {
      const pct = Math.min((s.value / maxSpeed) * 100, 100);
      const textColor = s.value <= 2.5 ? 'var(--green)' : s.value <= 3.5 ? 'var(--amber)' : 'var(--red)';
      return `
        <div class="speed-bar-row">
          <span class="speed-bar-label">${s.label}</span>
          <div class="speed-bar-track">
            <div class="speed-bar-fill"
                 style="width:0%; background:${s.color};"
                 data-target="${pct}"></div>
          </div>
          <span class="speed-bar-val" style="color:${textColor};">${s.value}s</span>
        </div>
      `;
    }).join('');

    requestAnimationFrame(() => {
      speedEl.querySelectorAll('.speed-bar-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'width 1s ease';
          bar.style.width = bar.dataset.target + '%';
        }, i * 100);
      });
    });
  }

  // Device performance bars
  const devEl = $('devicePerf');
  if (devEl) {
    const devs = [
      { label: 'Mobile',  score: perf.devicePerformance.mobile,  color: '#3b82f6' },
      { label: 'Desktop', score: perf.devicePerformance.desktop, color: '#10b981' },
      { label: 'Tablet',  score: perf.devicePerformance.tablet,  color: '#f59e0b' }
    ];

    devEl.innerHTML = devs.map(d => {
      const textColor = d.score >= 80 ? 'var(--green)' : d.score >= 60 ? 'var(--amber)' : 'var(--red)';
      return `
        <div class="device-perf-row">
          <span class="device-perf-label">${d.label}</span>
          <div class="device-perf-track">
            <div class="device-perf-fill"
                 style="width:0%; background:${d.color};"
                 data-target="${d.score}"></div>
          </div>
          <span class="device-perf-score" style="color:${textColor};">${d.score}</span>
        </div>
      `;
    }).join('');

    requestAnimationFrame(() => {
      devEl.querySelectorAll('.device-perf-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'width 1s ease';
          bar.style.width = bar.dataset.target + '%';
        }, i * 100);
      });
    });
  }

  // Uptime row
  const uptimeEl  = $('perfUptime');
  const responseEl = $('perfResponse');
  const errorEl   = $('perfError');
  if (uptimeEl)   uptimeEl.textContent  = perf.uptimePercent + '%';
  if (responseEl) responseEl.textContent = perf.avgResponseTime + 'ms';
  if (errorEl)    errorEl.textContent   = perf.errorRate + '%';
}

// ══════════════════════════════════════════════════════════════════════════════
//  REVENUE PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderRevenueKPIs(rev) {
  const kpisEl = $('revenueKpis');
  if (!kpisEl) return;

  kpisEl.innerHTML = `
    <div class="rev-kpi">
      <div class="rev-kpi-label">RevPAR</div>
      <div class="rev-kpi-value rev-kpi-value--amber">$${Number(rev.revpar).toFixed(0)}</div>
    </div>
    <div class="rev-kpi">
      <div class="rev-kpi-label">ADR</div>
      <div class="rev-kpi-value rev-kpi-value--blue">$${Number(rev.adr).toFixed(0)}</div>
    </div>
    <div class="rev-kpi">
      <div class="rev-kpi-label">Occupancy</div>
      <div class="rev-kpi-value rev-kpi-value--green">${rev.occupancyRate}%</div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════════════
//  GEOGRAPHIC PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderGeo(geo) {
  const el = $('geoCountryBars');
  if (!el) return;

  const maxVisitors = geo[0].visitors;

  el.innerHTML = geo.map((g, i) => {
    const pct = Math.floor((g.visitors / maxVisitors) * 100);
    return `
      <div class="country-bar-item">
        <span class="country-flag-name">${g.flag} ${g.country}</span>
        <div class="country-bar-track">
          <div class="country-bar-fill" style="width:0%;" data-target="${pct}"></div>
        </div>
        <span class="country-bar-count">${(g.visitors / 1000).toFixed(1)}k</span>
      </div>
    `;
  }).join('');

  requestAnimationFrame(() => {
    el.querySelectorAll('.country-bar-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.transition = 'width 0.9s ease';
        bar.style.width = bar.dataset.target + '%';
      }, i * 60);
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  OPTIMIZATION RECOMMENDATIONS PANEL
// ══════════════════════════════════════════════════════════════════════════════
function renderRecommendations(recs) {
  const listEl  = $('recommendationsList');
  const summEl  = $('recSummary');

  if (summEl) {
    const highCount      = recs.filter(r => r.priority === 'high').length;
    const medCount       = recs.filter(r => r.priority === 'medium').length;
    const completedCount = recs.filter(r => r.status === 'completed').length;
    summEl.innerHTML = `
      <span class="rec-summary-chip rec-summary-chip--high">${highCount} High</span>
      <span class="rec-summary-chip rec-summary-chip--medium">${medCount} Medium</span>
      <span class="rec-summary-chip rec-summary-chip--complete">${completedCount} Done</span>
    `;
  }

  if (!listEl) return;

  listEl.innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="rec-item-header">
        <span class="priority-badge priority-badge--${r.priority}">${r.priority}</span>
        <span class="rec-item-title">${r.title}</span>
        <span class="status-badge status-badge--${r.status}">${r.status.replace('-', ' ')}</span>
      </div>
      <div class="rec-item-desc">${r.description}</div>
      <div class="rec-item-footer">
        <span class="rec-impact">→ ${r.estimatedImpact}</span>
        <span class="rec-effort">Effort: ${r.effort}</span>
        <span class="rec-timeframe">${r.timeframe}</span>
        <span class="rec-category">${r.category}</span>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════════════════════
//  REAL-TIME ACTIVITY FEED
// ══════════════════════════════════════════════════════════════════════════════
const ACTIVITY_ICONS = {
  view:    { emoji: '👁️', cls: 'view' },
  booking: { emoji: '✅', cls: 'booking' },
  action:  { emoji: '🖱️', cls: 'action' },
  review:  { emoji: '⭐', cls: 'review' }
};

function buildActivityItem(act) {
  const icon   = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.action;
  const time   = new Date(act.timestamp);
  const hh     = String(time.getHours()).padStart(2, '0');
  const mm     = String(time.getMinutes()).padStart(2, '0');
  const ss     = String(time.getSeconds()).padStart(2, '0');
  const timeStr = `${hh}:${mm}:${ss}`;

  const isBooking = act.type === 'booking';
  const msgHtml  = isBooking
    ? `<strong>${act.message}</strong>`
    : act.message;

  return `
    <div class="activity-item" data-id="${act.id}">
      <div class="activity-icon activity-icon--${icon.cls}">${icon.emoji}</div>
      <div class="activity-body">
        <div class="activity-msg">${msgHtml}</div>
        <div class="activity-time">${timeStr}</div>
      </div>
    </div>
  `;
}

function renderActivityFeed(activities) {
  const feedEl = $('activityFeed');
  if (!feedEl) return;
  feedEl.innerHTML = activities.map(buildActivityItem).join('');
}

function prependActivity(act) {
  const feedEl = $('activityFeed');
  if (!feedEl) return;

  const div = document.createElement('div');
  div.innerHTML = buildActivityItem(act);
  const item = div.firstElementChild;

  feedEl.insertBefore(item, feedEl.firstChild);

  // Remove last item if too many
  const items = feedEl.querySelectorAll('.activity-item');
  if (items.length > 12) {
    items[items.length - 1].remove();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  REALTIME STATS UPDATE
// ══════════════════════════════════════════════════════════════════════════════
function renderRealtimeStats(rt) {
  const visEl = $('liveVisitorCount');
  const hdrVis = $('headerLiveVisitors');
  const hdrRev = $('headerTodayRevenue');
  const activeRoomsEl = $('rtActiveRooms');
  const pendingEl     = $('rtPendingBookings');
  const todayEl       = $('rtTodayBookings');

  if (visEl) visEl.textContent = rt.liveVisitors;
  if (hdrVis) hdrVis.textContent = rt.liveVisitors;
  if (hdrRev) hdrRev.textContent = '$' + rt.todayRevenue.toLocaleString();
  if (activeRoomsEl) activeRoomsEl.textContent = rt.activeRooms;
  if (pendingEl)     pendingEl.textContent = rt.pendingBookings;
  if (todayEl)       todayEl.textContent = rt.todayBookings;
}

// ══════════════════════════════════════════════════════════════════════════════
//  REFRESH LOGIC
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch real-time data (every 3 seconds): activity feed + live counters.
 */
async function refreshRealtime() {
  try {
    const res = await fetchJSON('/api/realtime');
    if (!res.success) return;
    const rt = res.data;
    State.realtimeData = rt;

    renderRealtimeStats(rt);

    // Prepend a new activity item on each poll
    if (rt.activity && rt.activity.length > 0) {
      const pick = rt.activity[Math.floor(Math.random() * rt.activity.length)];
      pick.timestamp = new Date().toISOString();
      prependActivity(pick);
    }
  } catch (e) {
    console.warn('[realtime] fetch error:', e.message);
  }
}

// KPI refresh — re-fetches exact cached numbers from server, no modification
async function refreshKPIs() {
  try {
    const res = await fetchJSON('/api/analytics');
    if (!res.success) return;
    renderKPIs(res.data.kpis, false);
  } catch (e) {
    console.warn('[kpi refresh]', e.message);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  INITIAL DATA LOAD
// ══════════════════════════════════════════════════════════════════════════════
async function loadAllData() {
  try {
    // Parallel fetch of all API endpoints
    const [analyticsRes, seoRes, perfRes, revRes, recRes, rtRes] = await Promise.all([
      fetchJSON('/api/analytics'),
      fetchJSON('/api/seo'),
      fetchJSON('/api/performance'),
      fetchJSON('/api/revenue'),
      fetchJSON('/api/recommendations'),
      fetchJSON('/api/realtime')
    ]);

    // ── Analytics / KPIs ────────────────────────────────────────────
    if (analyticsRes.success) {
      State.analyticsData = analyticsRes.data;
      const { kpis, traffic, funnel, sources, geo, devices } = analyticsRes.data;

      renderKPIs(kpis, true);
      renderGeo(geo);

      // Charts
      HotelCharts.initTrafficChart(
        traffic.labels,
        traffic.beforeOptimization,
        traffic.afterOptimization,
        traffic.optimizationDay
      );
      HotelCharts.initSourcesChart(sources);
      HotelCharts.initFunnelChart(funnel);
      HotelCharts.initDeviceChart(devices);
    }

    // ── SEO ─────────────────────────────────────────────────────────
    if (seoRes.success) {
      State.seoData = seoRes.data;
      renderSEO(seoRes.data);
    }

    // ── Performance ─────────────────────────────────────────────────
    if (perfRes.success) {
      State.perfData = perfRes.data;
      renderPerformance(perfRes.data);
    }

    // ── Revenue ─────────────────────────────────────────────────────
    if (revRes.success) {
      State.revenueData = revRes.data;
      const rev = revRes.data;

      renderRevenueKPIs(rev);
      HotelCharts.initRevenueChart(rev.revenueLabels, rev.dailyRevenue, rev.movingAvg);
      HotelCharts.initRoomTypeChart(rev.roomTypes);
      HotelCharts.initChannelChart(rev.channels);
    }

    // ── Recommendations ─────────────────────────────────────────────
    if (recRes.success) {
      renderRecommendations(recRes.data);
    }

    // ── Realtime (initial) ───────────────────────────────────────────
    if (rtRes.success) {
      State.realtimeData = rtRes.data;
      renderRealtimeStats(rtRes.data);
      renderActivityFeed(rtRes.data.activity);
    }

    State.initialized = true;

  } catch (err) {
    console.error('[loadAllData] Fatal error:', err);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  LOCAL EVENTS & OUTREACH
// ══════════════════════════════════════════════════════════════════════════════

async function loadEvents() {
  try {
    const res  = await fetch('/api/events');
    const json = await res.json();
    if (!json.success) return;
    renderEvents(json.data);
  } catch (e) {
    console.error('[loadEvents]', e);
  }
}

function renderEvents(events) {
  const list = $('eventsList');
  if (!list) return;

  // Track contacted status in localStorage
  const contacted = JSON.parse(localStorage.getItem('eventsContacted') || '{}');

  list.innerHTML = events.map(ev => {
    const isContacted = contacted[ev.id];
    const priorityClass = `priority-${ev.priority}`;
    const revenueStr = ev.revenueOpportunity >= 1000
      ? '$' + (ev.revenueOpportunity / 1000).toFixed(1) + 'k'
      : '$' + ev.revenueOpportunity;

    return `
    <div class="event-card ${priorityClass}" id="event-${ev.id}">
      <div class="event-top">
        <div class="event-name">${ev.name}</div>
        <span class="event-type-badge">${ev.type}</span>
      </div>

      <div class="event-meta">
        <div class="event-meta-item">
          <span class="event-meta-label">Date</span>
          <span class="event-meta-value">${ev.dateLabel} (${ev.durationNights} nights)</span>
        </div>
        <div class="event-meta-item">
          <span class="event-meta-label">Venue</span>
          <span class="event-meta-value">${ev.venue} — ${ev.distanceMiles} mi away</span>
        </div>
        <div class="event-meta-item">
          <span class="event-meta-label">Expected Attendance</span>
          <span class="event-meta-value">${ev.expectedAttendance.toLocaleString()} people</span>
        </div>
        <div class="event-meta-item">
          <span class="event-meta-label">Est. Room Nights Needed</span>
          <span class="event-meta-value highlight">${ev.estimatedRoomNights.toLocaleString()} nights</span>
        </div>
      </div>

      <div class="event-revenue">
        <span class="event-revenue-label">Revenue Opportunity (your share)</span>
        <span class="event-revenue-value">${revenueStr}</span>
      </div>

      <div class="event-contact">
        <div class="event-contact-org">${ev.contactOrg}</div>
        <div class="event-contact-row">
          <span>📞 <a class="event-contact-link" href="tel:${ev.contactPhone}">${ev.contactPhone}</a></span>
          <span>✉️ <a class="event-contact-link" href="mailto:${ev.contactEmail}">${ev.contactEmail}</a></span>
          <span>🌐 <a class="event-contact-link" href="${ev.contactWebsite}" target="_blank" rel="noopener">Website</a></span>
        </div>
      </div>

      <div class="event-script">
        <span class="event-script-label">📝 Suggested Outreach Message</span>
        ${ev.outreachScript}
      </div>

      <div class="event-notes">💡 ${ev.notes}</div>

      <div class="event-actions">
        <button class="event-btn event-btn--primary" onclick="copyScript(${ev.id})">Copy Message</button>
        <button class="event-btn event-btn--secondary" onclick="openEmail(${ev.id})">Email Organizer</button>
        <button class="event-btn ${isContacted ? 'event-btn--success' : 'event-btn--secondary'}"
          id="contacted-btn-${ev.id}" onclick="markContacted(${ev.id})">
          ${isContacted ? '✓ Contacted' : 'Mark Contacted'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function copyScript(id) {
  fetch('/api/events').then(r=>r.json()).then(json => {
    const ev = json.data.find(e => e.id === id);
    if (!ev) return;
    navigator.clipboard.writeText(ev.outreachScript).then(() => {
      const btn = document.querySelector(`#event-${id} .event-btn--primary`);
      if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = 'Copy Message'; }, 2000); }
    });
  });
}

function openEmail(id) {
  fetch('/api/events').then(r=>r.json()).then(json => {
    const ev = json.data.find(e => e.id === id);
    if (!ev) return;
    const subject = encodeURIComponent(`Room Block Partnership — Comfort Inn Huntsville — ${ev.name}`);
    const body    = encodeURIComponent(ev.outreachScript + '\n\nComfort Inn Huntsville\n4725 University Drive NW, Huntsville, AL 35816\n(256) 837-4070');
    window.open(`mailto:${ev.contactEmail}?subject=${subject}&body=${body}`);
  });
}

function markContacted(id) {
  const contacted = JSON.parse(localStorage.getItem('eventsContacted') || '{}');
  contacted[id]   = !contacted[id];
  localStorage.setItem('eventsContacted', JSON.stringify(contacted));
  const btn = $(`contacted-btn-${id}`);
  if (btn) {
    btn.textContent = contacted[id] ? '✓ Contacted' : 'Mark Contacted';
    btn.className   = `event-btn ${contacted[id] ? 'event-btn--success' : 'event-btn--secondary'}`;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════════════════════════
async function boot() {
  initSetupModal();
  startClock();
  await loadAllData();
  await loadEvents();

  // Real-time activity feed — every 3 seconds
  setInterval(refreshRealtime, 3000);

  // KPI refresh — every 30 seconds
  setInterval(refreshKPIs, 30_000);
}

// Wait for DOM + Chart.js to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
