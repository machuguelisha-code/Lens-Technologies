/* Samwel AI: a keyword-matched, source-cited assistant over a curated knowledge base.
   Runs entirely in the browser; nothing is transmitted. */

const KNOWLEDGE = [
  {
    keys: ['employment', 'terminate', 'termination', 'dismissal', 'fired', 'kazi', 'mfanyakazi'],
    title: 'Termination of employment',
    body: 'Termination must have both a fair reason (misconduct, capacity, operational requirements) and a fair procedure: notice of the allegation, a hearing, representation and a written decision. An unfair termination claim goes to the Commission for Mediation and Arbitration (CMA) and must be filed within 30 days of termination.',
    source: 'Employment and Labour Relations Act, Cap. 366, ss. 36–40; Labour Institutions Act, Cap. 300.'
  },
  {
    keys: ['land', 'title', 'occupancy', 'shamba', 'ardhi', 'boundary', 'plot'],
    title: 'Land rights and disputes',
    body: 'All land is public land vested in the President as trustee. You hold either a granted right of occupancy or a customary right of occupancy. Disputes start at the Ward Tribunal, then the District Land and Housing Tribunal, then the High Court (Land Division). Verify the title, spousal consent and any required consent to transfer before any sale.',
    source: 'Land Act, Cap. 113; Village Land Act, Cap. 114; Land Disputes Courts Act, Cap. 216.'
  },
  {
    keys: ['divorce', 'marriage', 'ndoa', 'talaka', 'separation', 'matrimonial'],
    title: 'Divorce and matrimonial proceedings',
    body: 'A petition for divorce requires proof that the marriage has broken down irreparably, and it must first go to a Marriage Conciliation Board, whose certificate you file with the petition. The court may then divide matrimonial assets according to each spouse\'s contribution, including non-monetary contribution to the welfare of the family.',
    source: 'Law of Marriage Act, Cap. 29, ss. 99, 101, 107 and 114.'
  },
  {
    keys: ['bail', 'arrest', 'police', 'remand', 'criminal', 'custody'],
    title: 'Arrest and bail',
    body: 'A person arrested must be informed of the reason, allowed to communicate with a lawyer or relative, and brought before a court without unreasonable delay. Bail is the rule for bailable offences and may be granted with sureties or conditions; refusal must be justified on grounds set by law.',
    source: 'Criminal Procedure Act, Cap. 20, ss. 32, 148 and 149.'
  },
  {
    keys: ['contract', 'agreement', 'breach', 'mkataba', 'damages'],
    title: 'Contracts and breach',
    body: 'A contract needs offer, acceptance, consideration, capacity, free consent and a lawful object. On breach you may claim damages that flow naturally from the breach or were in contemplation of the parties, specific performance where damages are inadequate, or rescission. A suit founded on contract is generally time-barred after six years.',
    source: 'Law of Contract Act, Cap. 345; Law of Limitation Act, Cap. 89, Schedule Part I.'
  },
  {
    keys: ['company', 'business', 'register', 'brela', 'incorporate', 'kampuni'],
    title: 'Registering a company',
    body: 'Reserve the name with BRELA, then file the memorandum and articles of association, statement of nominal capital and details of directors and shareholders. After incorporation you must obtain a TIN, business licence, and register for VAT where turnover requires it. Annual returns are mandatory.',
    source: 'Companies Act, Cap. 212; Business Licensing Act, Cap. 208.'
  },
  {
    keys: ['appeal', 'court of appeal', 'time limit', 'notice of appeal'],
    title: 'Appeals',
    body: 'An appeal from the High Court to the Court of Appeal begins with a notice of appeal lodged within 30 days of the decision, followed by a record of appeal within 60 days of lodging the notice. Time limits are strictly enforced; extension requires good cause shown on affidavit.',
    source: 'Appellate Jurisdiction Act, Cap. 141; Court of Appeal Rules, 2009, rr. 83 and 96.'
  },
  {
    keys: ['data', 'privacy', 'personal data', 'protection'],
    title: 'Personal data protection',
    body: 'Controllers and processors must register with the Personal Data Protection Commission, collect data for a specified lawful purpose, keep it no longer than necessary, and honour data subject rights of access, rectification and erasure. Breaches must be notified without undue delay.',
    source: 'Personal Data Protection Act, No. 11 of 2022.'
  },
  {
    keys: ['legal aid', 'free lawyer', 'msaada', 'pro bono', 'cannot afford'],
    title: 'Free legal aid',
    body: 'Legal aid providers are recognised by law and may assist with advice, drafting and representation. Lens Law runs means-tested clinics every Wednesday and Saturday, plus mobile outreach. Bring identification and every document connected to your matter.',
    source: 'Legal Aid Act, No. 1 of 2017.'
  },
  {
    keys: ['limitation', 'time barred', 'how long do i have'],
    title: 'Limitation of actions',
    body: 'Common periods: 6 years for contract and tort, 12 years to recover land, 3 years for a claim founded on a tort against the Government, and 30 days for most labour disputes at the CMA. A time-barred suit is dismissed regardless of merit, so calculate the period from the date the cause of action arose.',
    source: 'Law of Limitation Act, Cap. 89.'
  }
];

const log = document.getElementById('chat-log');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const chips = document.getElementById('chips');

const SUGGESTIONS = [
  'How is employment terminated fairly?',
  'What are my land dispute options?',
  'How do I start a divorce?',
  'Am I entitled to bail?',
  'How long do I have to sue on a contract?',
  'Nataka msaada wa kisheria (legal aid)'
];

function bubble(text, who, source) {
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.innerHTML = source ? `${text}<span class="src"><strong>Sources:</strong> ${source}</span>` : text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function answer(question) {
  const q = question.toLowerCase();
  const scored = KNOWLEDGE
    .map((k) => ({ k, score: k.keys.reduce((n, key) => (q.includes(key) ? n + 1 : n), 0) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    bubble(
      'I do not have a grounded answer for that in my current corpus, so I will not guess. Try one of the suggested topics, rephrase with the area of law involved, or <a href="legal-aid.html#book">book a free consultation</a> with an advocate.',
      'bot'
    );
    return;
  }
  const best = scored[0].k;
  const alsoSee = scored.slice(1, 3).map((s) => s.k.title);
  const extra = alsoSee.length ? `<br /><br /><em>Related desks:</em> ${alsoSee.join('; ')}.` : '';
  bubble(`<strong>${best.title}</strong><br />${best.body}${extra}`, 'bot', best.source);
}

function ask(question) {
  bubble(question, 'me');
  input.value = '';
  setTimeout(() => answer(question), 350);
}

chips.innerHTML = SUGGESTIONS.map((s) => `<button class="chip" type="button">${s}</button>`).join('');
chips.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (btn) ask(btn.textContent);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (q) ask(q);
});

bubble(
  'Habari! I am <strong>Samwel</strong>, the Lens Law research assistant of the Machugu Foundation. Ask me about employment, land, family, criminal procedure, contracts, company registration, data protection or legal aid &mdash; I answer with the authority you should read next.',
  'bot'
);
