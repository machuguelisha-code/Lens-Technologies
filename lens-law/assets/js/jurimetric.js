/* Jurimetric: analytics over Tanzanian judicial records, drawn on plain canvas.
   Every number on this page is computed at run time from
   assets/js/data/tz-judiciary.js (Judiciary of Tanzania, TanzLII collections) and
   assets/js/data/tz-cases.js (Court of Appeal judgments indexed on TanzLII). */

const NAVY = '#1b3a63';
const GOLD = '#c8a45a';
const INK = '#16202e';
const MUTED = '#8b97a6';
const GRID = '#e4e8ee';
const SERIES = [NAVY, GOLD, '#3d6795', '#5d6b7d', '#a9bcd4', '#8c6f3a', '#26507f', '#c9d5e3', '#6f8299', '#e0c690'];

const JUDICIARY = window.TZ_JUDICIARY || { yearVolumes: {}, registries2026: {}, justices: [] };
const ALL_CASES = window.TZ_CASES || [];
const TANZLII_SEARCH = 'https://tanzlii.org/search/?q=';

const filters = { area: '', year: '', registry: '', q: '' };

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

function niceMax(value) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function columnChart(id, data, suffix = '') {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const { ctx, w, h } = setup(canvas);
  if (!data.length) return;
  const slot = (w - 60) / data.length;
  const rotate = data.some(([label]) => ctx.measureText(label).width > slot - 4);
  const pad = { top: 18, right: 12, bottom: rotate ? 62 : 34, left: 44 };
  const max = niceMax(Math.max(...data.map(([, v]) => v)));
  axes(ctx, w, h, pad, max, 4);
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const bw = Math.min((plotW / data.length) * 0.6, 46);
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
    ctx.fillText(`${value}${suffix}`, x + bw / 2, pad.top + plotH - bh - 5);
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

function barChart(id, data) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const { ctx, w, h } = setup(canvas);
  if (!data.length) return;
  const labelW = Math.min(Math.max(...data.map(([label]) => ctx.measureText(label).width)) + 14, w * 0.46);
  const pad = { top: 8, right: 34, bottom: 8, left: labelW };
  const plotW = w - pad.left - pad.right;
  const rowH = (h - pad.top - pad.bottom) / data.length;
  const max = Math.max(...data.map(([, v]) => v)) || 1;
  data.forEach(([label, value], i) => {
    const y = pad.top + rowH * i + rowH * 0.2;
    const bh = Math.max(rowH * 0.56, 6);
    const bw = (value / max) * plotW;
    ctx.fillStyle = SERIES[i % SERIES.length];
    ctx.fillRect(pad.left, y, bw, bh);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(String(value), pad.left + bw + 6, y + bh / 2 + 4);
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'right';
    ctx.fillText(label, pad.left - 8, y + bh / 2 + 4);
  });
}

function donutChart(id, legendId, data, centreValue, centreLabel) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const { ctx, w, h } = setup(canvas);
  const total = data.reduce((n, d) => n + d[1], 0);
  if (!total) return;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 12;
  let start = -Math.PI / 2;
  data.forEach(([, value], i) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = SERIES[i % SERIES.length];
    ctx.fill();
    start += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.font = '600 14px Inter, sans-serif';
  ctx.fillText(String(centreValue), cx, cy - 2);
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(centreLabel, cx, cy + 13);

  const legend = document.getElementById(legendId);
  if (legend) {
    legend.innerHTML = data
      .map(([label, value], i) => {
        const pct = Math.round((value / total) * 100);
        return `<span><i style="background:${SERIES[i % SERIES.length]}"></i>${label} &mdash; ${value} (${pct}%)</span>`;
      })
      .join('');
  }
}

function tally(items, key) {
  const map = new Map();
  items.forEach((item) => {
    const value = item[key];
    if (!value) return;
    map.set(value, (map.get(value) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function selected() {
  const q = filters.q.toLowerCase();
  return ALL_CASES.filter((c) => {
    if (filters.area && c.a !== filters.area) return false;
    if (filters.year && String(c.y) !== filters.year) return false;
    if (filters.registry && c.reg !== filters.registry) return false;
    if (q && !`${c.t} ${c.s} ${c.sub} ${c.c}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderKpis() {
  const volumes = JUDICIARY.yearVolumes || {};
  const total = Object.values(volumes).reduce((n, v) => n + v, 0);
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set('kpi-judgments', total.toLocaleString('en-GB'));
  set('kpi-latest', (volumes[2026] || 0).toLocaleString('en-GB'));
  set('kpi-justices', String((JUDICIARY.justices || []).length));
  set('kpi-coded', String(ALL_CASES.length));
}

function renderCaseList(cases) {
  const host = document.getElementById('juri-cases');
  const count = document.getElementById('juri-count');
  if (count) {
    count.textContent = `${cases.length} of ${ALL_CASES.length} indexed judgments match.`;
  }
  if (!host) return;
  host.innerHTML = cases
    .slice(0, 60)
    .map(
      (c) => `
      <article class="panel case">
        <div class="section-label">${c.a}</div>
        <h3>${c.t}</h3>
        <p class="muted">${c.r} &middot; <strong>${c.c}</strong> &middot; ${c.d}${c.reg ? ` &middot; ${c.reg} Registry` : ''}</p>
        <p>${c.s}</p>
        <p class="muted"><em>${c.sub}</em></p>
        <p><span class="pill">${c.o}</span></p>
        <p><a href="${TANZLII_SEARCH}${encodeURIComponent(`"${c.c}"`)}" target="_blank" rel="noopener">Open the judgment on TanzLII</a></p>
      </article>`
    )
    .join('');
  if (cases.length > 60) {
    host.insertAdjacentHTML(
      'beforeend',
      `<p class="form-note">Showing the first 60 matches. Narrow the filters to see the rest.</p>`
    );
  }
}

function renderJustice() {
  const host = document.getElementById('juri-justice');
  const select = document.getElementById('juri-judge');
  if (!host || !select) return;
  const justice = (JUDICIARY.justices || []).find((j) => j.name === select.value);
  if (!justice) {
    host.innerHTML = '<p class="muted">Select a Justice of Appeal to see their reported record.</p>';
    return;
  }
  const years = justice.years || [];
  const regs = justice.registries2026 || [];
  host.innerHTML = `
    <h3>${justice.name}</h3>
    <p class="muted">Court of Appeal of Tanzania</p>
    <dl class="judge-meta">
      <dt>Years with judgments on TanzLII</dt><dd>${years.length ? years.join(', ') : 'Not recorded'}</dd>
      <dt>Registries sat in during 2026</dt><dd>${regs.length ? regs.join(', ') : 'None recorded in the registry collections we index'}</dd>
      <dt>Still sitting on the record</dt><dd>${years.includes(2026) ? 'Yes &mdash; judgments reported in 2026' : 'No judgments reported in 2026'}</dd>
    </dl>
    <p><a href="${TANZLII_SEARCH}${encodeURIComponent(`"${justice.name}"`)}" target="_blank" rel="noopener">Read their judgments on TanzLII</a></p>`;
}

function drawCharts() {
  const cases = selected();
  const volumes = Object.entries(JUDICIARY.yearVolumes || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  columnChart('chart-volume', volumes);
  barChart('chart-registry', Object.entries(JUDICIARY.registries2026 || {}).sort((a, b) => b[1] - a[1]));
  donutChart('chart-area', 'area-legend', tally(cases, 'a').slice(0, 8), cases.length, 'judgments');
  barChart('chart-outcome', tally(cases, 'o'));
  barChart(
    'chart-bench',
    (JUDICIARY.justices || [])
      .map((j) => [j.name.replace(', J.A.', ''), (j.years || []).length])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
  );
  renderCaseList(cases);
}

function option(value, label) {
  return `<option value="${value}">${label}</option>`;
}

function wireControls() {
  const areaSel = document.getElementById('juri-area');
  const yearSel = document.getElementById('juri-year');
  const regSel = document.getElementById('juri-registry');
  const search = document.getElementById('juri-search');
  const judgeSel = document.getElementById('juri-judge');

  if (areaSel) {
    areaSel.insertAdjacentHTML(
      'beforeend',
      tally(ALL_CASES, 'a')
        .map(([a, n]) => option(a, `${a} (${n})`))
        .join('')
    );
    areaSel.addEventListener('change', () => {
      filters.area = areaSel.value;
      drawCharts();
    });
  }
  if (yearSel) {
    yearSel.insertAdjacentHTML(
      'beforeend',
      tally(ALL_CASES, 'y')
        .sort((a, b) => b[0] - a[0])
        .map(([y, n]) => option(String(y), `${y} (${n})`))
        .join('')
    );
    yearSel.addEventListener('change', () => {
      filters.year = yearSel.value;
      drawCharts();
    });
  }
  if (regSel) {
    regSel.insertAdjacentHTML(
      'beforeend',
      tally(ALL_CASES, 'reg')
        .map(([r, n]) => option(r, `${r} (${n})`))
        .join('')
    );
    regSel.addEventListener('change', () => {
      filters.registry = regSel.value;
      drawCharts();
    });
  }
  if (search) {
    search.addEventListener('input', () => {
      filters.q = search.value.trim();
      drawCharts();
    });
  }
  if (judgeSel) {
    judgeSel.insertAdjacentHTML(
      'beforeend',
      (JUDICIARY.justices || []).map((j) => option(j.name, j.name)).join('')
    );
    judgeSel.addEventListener('change', renderJustice);
  }
}

renderKpis();
wireControls();
drawCharts();
renderJustice();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawCharts();
    renderJustice();
  }, 200);
});
