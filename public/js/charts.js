/* ═══════════════════════════════════════════════════════════════════
   HotelPulse Analytics — Chart.js Initialisation & Configuration
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ── Global Chart.js defaults ──────────────────────────────────────────────────
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

// ── Chart instance registry ───────────────────────────────────────────────────
const ChartRegistry = {};

// ── Shared dark-theme config factory ─────────────────────────────────────────
function darkGrid() {
  return {
    color: 'rgba(255,255,255,0.06)',
    drawBorder: false
  };
}

function darkTick() {
  return {
    color: '#64748b',
    font: { size: 11, weight: '500' }
  };
}

function tooltip(extra = {}) {
  return Object.assign({
    backgroundColor: 'rgba(17,24,39,0.96)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    padding: { x: 14, y: 10 },
    titleColor: '#f1f5f9',
    bodyColor: '#94a3b8',
    titleFont: { size: 12, weight: '700' },
    bodyFont:  { size: 11 },
    cornerRadius: 8,
    displayColors: true,
    boxPadding: 4,
    usePointStyle: true
  }, extra);
}

// ══════════════════════════════════════════════════════════════════════════════
//  TRAFFIC OVER TIME — Line chart (Before vs After Optimization)
// ══════════════════════════════════════════════════════════════════════════════
function initTrafficChart(labels, beforeData, afterData, optimizationDay) {
  const ctx = document.getElementById('trafficChart');
  if (!ctx) return;
  if (ChartRegistry.traffic) ChartRegistry.traffic.destroy();

  // Build annotation line for optimization day
  const annotationX = optimizationDay;

  ChartRegistry.traffic = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Before Optimization',
          data: beforeData,
          borderColor: '#475569',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.35,
          order: 2
        },
        {
          label: 'After Optimization',
          data: afterData,
          borderColor: '#3b82f6',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#3b82f6',
          fill: {
            target: 'origin',
            above: 'rgba(59,130,246,0.08)'
          },
          tension: 0.4,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} visitors`
          }
        })
      },
      scales: {
        x: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            maxTicksLimit: 10,
            maxRotation: 0
          })
        },
        y: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            callback: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v
          }),
          beginAtZero: false
        }
      }
    }
  });

  // Draw optimization annotation manually via afterDraw plugin
  ChartRegistry.traffic._optimizationDay = optimizationDay;
  addOptimizationLine(ChartRegistry.traffic, optimizationDay, labels);

  return ChartRegistry.traffic;
}

function addOptimizationLine(chart, dayIndex, labels) {
  const plugin = {
    id: 'optimizationLine',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      const xPos = scales.x.getPixelForValue(dayIndex);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPos, chartArea.top);
      ctx.lineTo(xPos, chartArea.bottom);
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(16,185,129,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(16,185,129,0.2)';
      const labelW = 92, labelH = 20;
      const labelX = xPos + 6;
      const labelY = chartArea.top + 12;
      ctx.roundRect(labelX, labelY, labelW, labelH, 4);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.fillText('Optimization Start', labelX + 6, labelY + 13.5);
      ctx.restore();
    }
  };
  chart.options.plugins = chart.options.plugins || {};
  Chart.register(plugin);
  chart.update('none');
}

// ══════════════════════════════════════════════════════════════════════════════
//  TRAFFIC SOURCES — Doughnut chart
// ══════════════════════════════════════════════════════════════════════════════
function initSourcesChart(sources) {
  const ctx = document.getElementById('sourcesChart');
  if (!ctx) return;
  if (ChartRegistry.sources) ChartRegistry.sources.destroy();

  ChartRegistry.sources = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sources.map(s => s.source),
      datasets: [{
        data: sources.map(s => s.visitors),
        backgroundColor: sources.map(s => s.color),
        borderColor: '#111827',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      animation: {
        animateRotate: true,
        duration: 900,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => {
              const src = sources[ctx.dataIndex];
              return ` ${src.source}: ${src.visitors.toLocaleString()} (${src.percentage}%)`;
            }
          }
        })
      }
    }
  });

  // Populate legend
  const legendEl = document.getElementById('sourcesLegend');
  if (legendEl) {
    legendEl.innerHTML = sources.map(s => `
      <div class="sources-legend-item">
        <span class="sources-legend-label">
          <span class="sources-legend-dot" style="background:${s.color};"></span>
          ${s.source}
        </span>
        <span class="sources-legend-value">${s.percentage}%</span>
      </div>
    `).join('');
  }

  return ChartRegistry.sources;
}

// ══════════════════════════════════════════════════════════════════════════════
//  BOOKING FUNNEL — Horizontal bar chart
// ══════════════════════════════════════════════════════════════════════════════
function initFunnelChart(funnelData) {
  const ctx = document.getElementById('funnelChart');
  if (!ctx) return;
  if (ChartRegistry.funnel) ChartRegistry.funnel.destroy();

  const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
  const bgColors = colors.map(c => c + '22');

  ChartRegistry.funnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: funnelData.map(f => f.stage),
      datasets: [{
        label: 'Visitors',
        data: funnelData.map(f => f.count),
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => {
              const item = funnelData[ctx.dataIndex];
              return ` ${item.count.toLocaleString()} (${item.percentage}%)`;
            }
          }
        })
      },
      scales: {
        x: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v
          }),
          beginAtZero: true
        },
        y: {
          grid: { display: false },
          ticks: Object.assign(darkTick(), { font: { size: 11, weight: '500' } })
        }
      }
    }
  });

  return ChartRegistry.funnel;
}

// ══════════════════════════════════════════════════════════════════════════════
//  REVENUE TREND — Area chart with moving average
// ══════════════════════════════════════════════════════════════════════════════
function initRevenueChart(labels, dailyRevenue, movingAvg) {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  if (ChartRegistry.revenue) ChartRegistry.revenue.destroy();

  ChartRegistry.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Daily Revenue',
          data: dailyRevenue,
          borderColor: '#f59e0b',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#f59e0b',
          fill: {
            target: 'origin',
            above: 'rgba(245,158,11,0.12)'
          },
          tension: 0.4,
          order: 2
        },
        {
          label: '7-Day Moving Avg.',
          data: movingAvg,
          borderColor: '#ec4899',
          borderWidth: 2.5,
          borderDash: [6, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.4,
          order: 1,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => {
              if (ctx.parsed.y === null) return null;
              return ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`;
            }
          }
        })
      },
      scales: {
        x: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            maxTicksLimit: 10,
            maxRotation: 0
          })
        },
        y: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
          }),
          beginAtZero: false
        }
      }
    }
  });

  return ChartRegistry.revenue;
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOM TYPE REVENUE — Bar chart
// ══════════════════════════════════════════════════════════════════════════════
function initRoomTypeChart(roomTypes) {
  const ctx = document.getElementById('roomTypeChart');
  if (!ctx) return;
  if (ChartRegistry.roomType) ChartRegistry.roomType.destroy();

  const revenuePerType = roomTypes.map(r => Math.floor(r.rooms * r.rate * (r.occupancy / 100) * 30));

  ChartRegistry.roomType = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: roomTypes.map(r => r.type.replace(' Room', '').replace(' Suite', ' Ste')),
      datasets: [{
        label: 'Revenue (30d)',
        data: revenuePerType,
        backgroundColor: roomTypes.map(r => r.color + '44'),
        borderColor: roomTypes.map(r => r.color),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
          }
        })
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: Object.assign(darkTick(), { font: { size: 10 } })
        },
        y: {
          grid: darkGrid(),
          ticks: Object.assign(darkTick(), {
            callback: v => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
            font: { size: 10 }
          }),
          beginAtZero: true
        }
      }
    }
  });

  return ChartRegistry.roomType;
}

// ══════════════════════════════════════════════════════════════════════════════
//  REVENUE BY CHANNEL — Pie/Doughnut chart
// ══════════════════════════════════════════════════════════════════════════════
function initChannelChart(channels) {
  const ctx = document.getElementById('channelChart');
  if (!ctx) return;
  if (ChartRegistry.channel) ChartRegistry.channel.destroy();

  ChartRegistry.channel = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: channels.map(c => c.channel),
      datasets: [{
        data: channels.map(c => c.percentage),
        backgroundColor: channels.map(c => c.color + 'cc'),
        borderColor: '#111827',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => ` ${channels[ctx.dataIndex].channel}: ${channels[ctx.dataIndex].percentage}%`
          }
        })
      }
    }
  });

  // Populate channel legend
  const legendEl = document.getElementById('channelLegend');
  if (legendEl) {
    legendEl.innerHTML = channels.slice(0, 4).map(c => `
      <div class="channel-legend-item">
        <span class="channel-legend-label">
          <span class="channel-legend-dot" style="background:${c.color};"></span>
          ${c.channel}
        </span>
        <span class="channel-legend-pct">${c.percentage}%</span>
      </div>
    `).join('');
  }

  return ChartRegistry.channel;
}

// ══════════════════════════════════════════════════════════════════════════════
//  DEVICE BREAKDOWN — Donut chart
// ══════════════════════════════════════════════════════════════════════════════
function initDeviceChart(devices) {
  const ctx = document.getElementById('deviceChart');
  if (!ctx) return;
  if (ChartRegistry.device) ChartRegistry.device.destroy();

  ChartRegistry.device = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: devices.map(d => d.device),
      datasets: [{
        data: devices.map(d => d.percentage),
        backgroundColor: devices.map(d => d.color + 'bb'),
        borderColor: '#111827',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: tooltip({
          callbacks: {
            label: ctx => {
              const d = devices[ctx.dataIndex];
              return ` ${d.device}: ${d.percentage}% (${d.visitors.toLocaleString()})`;
            }
          }
        })
      }
    }
  });

  // Populate device legend
  const legendEl = document.getElementById('deviceLegend');
  if (legendEl) {
    legendEl.innerHTML = devices.map(d => `
      <div class="device-legend-item">
        <span class="device-legend-label">
          <span class="device-legend-dot" style="background:${d.color};"></span>
          ${d.device}
        </span>
        <span class="device-legend-pct">${d.percentage}%</span>
      </div>
    `).join('');
  }

  return ChartRegistry.device;
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS (accessed by dashboard.js)
// ══════════════════════════════════════════════════════════════════════════════
window.HotelCharts = {
  initTrafficChart,
  initSourcesChart,
  initFunnelChart,
  initRevenueChart,
  initRoomTypeChart,
  initChannelChart,
  initDeviceChart,
  registry: ChartRegistry
};
