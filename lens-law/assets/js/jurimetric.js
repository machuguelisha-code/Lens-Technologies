/* Jurimetric dashboards drawn on plain canvas - no chart library required. */

const NAVY = '#1b3a63';
const GOLD = '#c8a45a';
const INK = '#16202e';
const MUTED = '#8b97a6';
const GRID = '#e4e8ee';

function setup(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 560;
  const h = canvas.clientHeight || 240;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  ctx.font = `${w < 420 ? 10 : 11}px Inter, sans-serif`;
  return { ctx, w, h };
}

function axes(ctx, w, h, pad, max, ticks = 4) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  for (let i = 0; i <= ticks; i += 1) {
    const y = pad.top + ((h - pad.top - pad.bottom) * i) / ticks;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    const value = Math.round(max - (max * i) / ticks);
    ctx.textAlign = 'right';
    ctx.fillText(String(value), pad.left - 8, y + 4);
  }
}

/* 1. Median duration by area (horizontal-labelled bar chart) */
function durationChart() {
  const canvas = document.getElementById('chart-duration');
  if (!canvas) return;
  const data = [
    ['Labour', 9], ['Commercial', 12], ['Criminal', 13],
    ['Family', 15], ['Land', 22], ['Tax', 18]
  ];
  const { ctx, w, h } = setup(canvas);
  const slot = (w - 46) / data.length;
  const rotate = data.some(([label]) => ctx.measureText(label).width > slot - 4);
  const pad = { top: 14, right: 12, bottom: rotate ? 56 : 34, left: 34 };
  const max = 25;
  axes(ctx, w, h, pad, max, 5);
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const bw = (plotW / data.length) * 0.55;
  data.forEach(([label, value], i) => {
    const x = pad.left + (plotW / data.length) * (i + 0.5) - bw / 2;
    const bh = (value / max) * plotH;
    const grad = ctx.createLinearGradient(0, pad.top + plotH - bh, 0, pad.top + plotH);
    grad.addColorStop(0, GOLD);
    grad.addColorStop(1, NAVY);
    ctx.fillStyle = grad;
    ctx.fillRect(x, pad.top + plotH - bh, bw, bh);
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.fillText(`${value}m`, x + bw / 2, pad.top + plotH - bh - 5);
    ctx.fillStyle = MUTED;
    if (rotate) {
      ctx.save();
      ctx.translate(x + bw / 2 + 4, h - 8);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = 'right';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(label, x + bw / 2, h - 12);
    }
  });
}

/* 2. Filings vs disposals (line chart) */
function flowChart() {
  const canvas = document.getElementById('chart-flow');
  if (!canvas) return;
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const filings = [168, 192, 151, 205, 231, 248, 266];
  const disposals = [140, 161, 132, 178, 199, 222, 251];
  const { ctx, w, h } = setup(canvas);
  const pad = { top: 14, right: 14, bottom: 30, left: 38 };
  const max = 300;
  axes(ctx, w, h, pad, max, 3);
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const xAt = (i) => pad.left + (plotW / (years.length - 1)) * i;
  const yAt = (v) => pad.top + plotH - (v / max) * plotH;

  const line = (series, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    series.forEach((v, i) => (i ? ctx.lineTo(xAt(i), yAt(v)) : ctx.moveTo(xAt(i), yAt(v))));
    ctx.stroke();
    ctx.fillStyle = color;
    series.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  line(filings, NAVY);
  line(disposals, GOLD);

  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  years.forEach((y, i) => ctx.fillText(String(y), xAt(i), h - 10));
}

/* 3. Outcomes (donut) */
function outcomeChart() {
  const canvas = document.getElementById('chart-outcome');
  if (!canvas) return;
  const data = [
    ['Claim allowed', 38, NAVY],
    ['Allowed in part', 21, GOLD],
    ['Dismissed', 27, '#5d6b7d'],
    ['Settled / withdrawn', 14, '#a9bcd4']
  ];
  const { ctx, w, h } = setup(canvas);
  const total = data.reduce((n, d) => n + d[1], 0);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 12;
  let start = -Math.PI / 2;
  data.forEach(([, value, color]) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    start += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.fillText('1,482', cx, cy - 2);
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText('matters', cx, cy + 13);

  const legend = document.getElementById('outcome-legend');
  if (legend) {
    legend.innerHTML = data.map(([label, value, color]) =>
      `<span><i style="background:${color}"></i>${label} ${value}%</span>`).join('');
  }
}

/* 4. Time per stage (stacked bars) */
function stageChart() {
  const canvas = document.getElementById('chart-stages');
  if (!canvas) return;
  const stages = [
    ['Service & appearance', '#1b3a63'],
    ['Pleadings & mediation', '#3d6795'],
    ['Hearing', GOLD],
    ['Judgment reserved', '#c9d5e3']
  ];
  const rows = [
    ['Land', [31, 24, 27, 18]],
    ['Commercial', [22, 29, 33, 16]],
    ['Labour', [18, 34, 35, 13]]
  ];
  const { ctx, w, h } = setup(canvas);
  const pad = { top: 16, right: 12, bottom: 30, left: 84 };
  const plotW = w - pad.left - pad.right;
  const rowH = (h - pad.top - pad.bottom) / rows.length;
  rows.forEach(([label, values], r) => {
    let x = pad.left;
    const y = pad.top + rowH * r + rowH * 0.18;
    const bh = rowH * 0.5;
    values.forEach((v, i) => {
      const bw = (v / 100) * plotW;
      ctx.fillStyle = stages[i][1];
      ctx.fillRect(x, y, bw, bh);
      if (bw > 26) {
        ctx.fillStyle = i === 3 ? INK : '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`${v}%`, x + bw / 2, y + bh / 2 + 4);
      }
      x += bw;
    });
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(label, pad.left - 10, y + bh / 2 + 4);
  });
  const legend = document.getElementById('stage-legend');
  if (legend) {
    legend.innerHTML = stages.map(([label, color]) => `<span><i style="background:${color}"></i>${label}</span>`).join('');
  }
}

function drawAll() {
  durationChart();
  flowChart();
  outcomeChart();
  stageChart();
}

drawAll();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawAll, 200);
});
