/* Shared chrome (top bar, navigation, footer) for every Lens Law page. */

const BASE = document.body.dataset.base || '';
const PAGE = document.body.dataset.page || 'home';

const SECTIONS = [
  { id: 'legal-documents', name: 'Legal Documents', href: 'pages/legal-documents.html' },
  { id: 'samwel-ai', name: 'Samwel AI', href: 'pages/samwel-ai.html' },
  { id: 'weather', name: 'Weather', href: 'pages/weather.html' },
  { id: 'tanzlii', name: 'TanzLII', href: 'pages/tanzlii.html' },
  { id: 'decided-cases', name: 'Decided Cases', href: 'pages/decided-cases.html' },
  { id: 'bech', name: 'Bech', href: 'pages/bech.html' },
  { id: 'legal-magazine', name: 'Legal Magazine', href: 'pages/legal-magazine.html' },
  { id: 'jurimetric', name: 'Jurimetric', href: 'pages/jurimetric.html' },
  { id: 'research', name: 'Research', href: 'pages/research.html' },
  { id: 'library', name: 'Library', href: 'pages/library.html' },
  { id: 'legal-aid', name: 'Legal Aid & Consultancy', href: 'pages/legal-aid.html' }
];

function renderHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;
  const links = SECTIONS.map((s) => {
    const active = s.id === PAGE ? ' class="active"' : '';
    return `<a href="${BASE}${s.href}"${active}>${s.name}</a>`;
  }).join('');

  host.innerHTML = `
    <div class="topbar">
      <div class="wrap">
        <span>Machugu Foundation &middot; Dar es Salaam, Tanzania</span>
        <span>Mon&ndash;Fri 08:00&ndash;17:00 EAT &middot; <a href="mailto:info@lenslaw.co.tz">info@lenslaw.co.tz</a></span>
      </div>
    </div>
    <header class="site-header">
      <div class="header-inner wrap">
        <a class="logo" href="${BASE}index.html">
          <img class="logo-mark" src="${BASE}assets/img/lens-law-mark.svg" alt="Lens Law wing mark" width="46" height="46" />
          <span class="logo-text">
            <span class="brand-word">Lens Law</span>
            <span class="brand-sub">Machugu Foundation</span>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Toggle navigation">&#9776;</button>
        <nav class="nav" id="primary-nav">
          <a href="${BASE}index.html"${PAGE === 'home' ? ' class="active"' : ''}>Home</a>
          ${links}
          <a class="nav-cta" href="${BASE}pages/legal-aid.html#book">Book a Consultation</a>
        </nav>
      </div>
    </header>`;

  const toggle = host.querySelector('.nav-toggle');
  const nav = host.querySelector('#primary-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function renderFooter() {
  const host = document.getElementById('site-footer');
  if (!host) return;
  const col = (items) => items.map((s) => `<li><a href="${BASE}${s.href}">${s.name}</a></li>`).join('');
  host.innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <img class="footer-mark" src="${BASE}assets/img/lens-law-mark-gold.svg" alt="" width="54" height="54" />
            <span class="brand-word">Lens Law</span>
            <span class="brand-sub">Machugu Foundation</span>
            <p class="muted" style="margin-top:16px;max-width:34ch">A legal knowledge platform of the Machugu Foundation: documents, jurisprudence, data and free legal aid for every Tanzanian.</p>
          </div>
          <div>
            <h4>Knowledge</h4>
            <ul>${col(SECTIONS.slice(0, 4))}</ul>
          </div>
          <div>
            <h4>Jurisprudence</h4>
            <ul>${col(SECTIONS.slice(4, 8))}</ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>${col(SECTIONS.slice(8))}</ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} Lens Law &middot; Machugu Foundation. All rights reserved.</span>
          <span>Information published here is general guidance, not legal advice.</span>
        </div>
      </div>
    </footer>`;
}

function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

renderHeader();
renderFooter();
reveal();
