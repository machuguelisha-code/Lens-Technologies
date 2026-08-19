/* Bench: renders Tanzanian judicial profiles from assets/js/data/tz-judiciary.js.
   Every field comes from the Judiciary of Tanzania or from TanzLII; nothing is inferred. */

const JUD = window.TZ_JUDICIARY || { leadership: [], highCourtJudges: [], justices: [] };
const TANZLII_SEARCH = 'https://tanzlii.org/search/?q=';

function surname(name) {
  return name.replace(/,?\s*J\.A\.$/, '').trim();
}

function judgmentsLink(name) {
  return `${TANZLII_SEARCH}${encodeURIComponent(`"${surname(name)}, J.A."`)}`;
}

function renderLeadership() {
  const host = document.getElementById('bench-leadership');
  if (!host) return;
  host.innerHTML = JUD.leadership
    .map(
      (l) => `
      <div class="panel">
        <div class="section-label">${l.title}</div>
        <h3>${l.name}</h3>
      </div>`
    )
    .join('');
}

function justiceCard(j) {
  const years = j.years || [];
  const sitting = years.includes(2026);
  const span = years.length ? `${years[0]}&ndash;${years[years.length - 1]}` : 'not stated';
  const regs = (j.registries2026 || []).join(', ');
  return `
    <article class="panel judge" data-name="${j.name.toLowerCase()}" data-active="${sitting ? 'sitting' : 'earlier'}">
      <div class="section-label">Justice of Appeal</div>
      <h3>${j.name}</h3>
      <p class="muted">Court of Appeal of Tanzania${sitting ? ' &middot; reported in 2026' : ''}</p>
      <dl class="judge-meta">
        <dt>Years with reported judgments</dt><dd>${span} (${years.length} ${years.length === 1 ? 'year' : 'years'})</dd>
        <dt>Registries sat in during 2026</dt><dd>${regs || 'None recorded in the registry collections we index'}</dd>
      </dl>
      <p><a href="${judgmentsLink(j.name)}" target="_blank" rel="noopener">Read their judgments on TanzLII</a></p>
    </article>`;
}

function highCourtCard(j) {
  return `
    <article class="panel judge" data-name="${j.name.toLowerCase()}" data-active="sitting">
      <div class="section-label">${j.category}</div>
      <h3>${j.name}</h3>
      <p class="muted">${j.title}</p>
      <dl class="judge-meta">
        <dt>Appointed</dt><dd>${j.appointed || 'Not published'}</dd>
      </dl>
      <p><a href="https://www.judiciary.go.tz/judgeofhighcourt" target="_blank" rel="noopener">Judiciary profile listing</a></p>
    </article>`;
}

function renderJudges() {
  const joa = document.getElementById('bench-justices');
  const hc = document.getElementById('bench-highcourt');
  if (joa) joa.innerHTML = JUD.justices.map(justiceCard).join('');
  if (hc) hc.innerHTML = JUD.highCourtJudges.map(highCourtCard).join('');
}

function wireSearch() {
  const input = document.getElementById('judge-search');
  const filter = document.getElementById('judge-filter');
  const count = document.getElementById('judge-count');
  if (!input) return;

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    const mode = filter ? filter.value : '';
    let shown = 0;
    document.querySelectorAll('.judge').forEach((card) => {
      const okText = !q || card.dataset.name.includes(q);
      const okMode = !mode || card.dataset.active === mode;
      const visible = okText && okMode;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (count) count.textContent = `${shown} judicial profile${shown === 1 ? '' : 's'} shown.`;
  };

  input.addEventListener('input', apply);
  if (filter) filter.addEventListener('change', apply);
  apply();
}

renderLeadership();
renderJudges();
wireSearch();
