/* Samwel AI: a keyword-matched, source-cited assistant on Tanzanian law.
   It answers from a curated corpus of Tanzanian statutes and from the Court of Appeal
   judgments in assets/js/data/tz-cases.js. Runs entirely in the browser; nothing is
   transmitted, and it never invents an authority. */

const KNOWLEDGE = [
  {
    keys: ['employment', 'terminate', 'termination', 'dismissal', 'fired', 'kazi', 'mfanyakazi', 'unfair termination'],
    title: 'Termination of employment',
    body: 'Termination must have both a fair reason (misconduct, capacity, operational requirements) and a fair procedure: notice of the allegation, a hearing, representation and a written decision. An unfair termination claim goes to the Commission for Mediation and Arbitration (CMA) and must be filed within 30 days of termination. Where termination is only procedurally unfair the Court of Appeal still applies the statutory compensation floor of 12 months\' remuneration unless the law provides otherwise.',
    source: 'Employment and Labour Relations Act, Cap. 366, ss. 36–40; Labour Institutions Act, Cap. 300.'
  },
  {
    keys: ['retrenchment', 'redundancy', 'operational requirements', 'restructuring'],
    title: 'Retrenchment for operational requirements',
    body: 'A retrenchment is fair only if the employer gives notice of the intention, discloses the relevant information, and consults on the reason, the selection criteria, the timing and severance. Disclosure of financial statements and profit-and-loss accounts has been accepted as sufficient for meaningful consultation. Receiving terminal benefits does not automatically bar a challenge, but conduct inconsistent with the challenge may.',
    source: 'Employment and Labour Relations Act, Cap. 366, ss. 38 and 39.'
  },
  {
    keys: ['probation', 'probationary'],
    title: 'Termination during probation',
    body: 'The contract must specify the probation terms and the procedure for terminating during probation. Where a probationary employee is unfairly terminated, the Court of Appeal has confined compensation to remuneration for the unexpired part of the probationary period.',
    source: 'Employment and Labour Relations Act, Cap. 366, s. 88; Employment and Labour Relations (Code of Good Practice) Rules, G.N. No. 42 of 2007, r. 10.'
  },
  {
    keys: ['land', 'title', 'occupancy', 'shamba', 'ardhi', 'boundary', 'plot'],
    title: 'Land rights and disputes',
    body: 'All land is public land vested in the President as trustee. You hold either a granted right of occupancy or a customary right of occupancy. Disputes start at the Ward Tribunal, then the District Land and Housing Tribunal, then the High Court (Land Division). Verify the title, spousal consent and any required consent to transfer before any sale.',
    source: 'Land Act, Cap. 113; Village Land Act, Cap. 114; Land Disputes Courts Act, Cap. 216.'
  },
  {
    keys: ['compensation', 'acquisition', 'expropriation', 'compulsory'],
    title: 'Compensation and land acquisition',
    body: 'Payment of full, fair and prompt compensation is a condition precedent to a valid acquisition; a title issued without it is open to challenge, and the Commissioner for Lands must be joined in a suit questioning the acquisition. A court cannot award relief that was never pleaded.',
    source: 'Land Acquisition Act, Cap. 118; Land Act, Cap. 113, s. 3(1)(g); Constitution of the United Republic of Tanzania, art. 24.'
  },
  {
    keys: ['divorce', 'marriage', 'ndoa', 'talaka', 'separation', 'matrimonial'],
    title: 'Divorce and matrimonial proceedings',
    body: 'A petition for divorce requires proof that the marriage has broken down irreparably, and it must first go to a Marriage Conciliation Board, whose certificate you file with the petition. The court may then divide matrimonial assets according to each spouse\'s contribution, including non-monetary contribution to the welfare of the family.',
    source: 'Law of Marriage Act, Cap. 29, ss. 99, 101, 107 and 114.'
  },
  {
    keys: ['probate', 'estate', 'administrator', 'administratrix', 'inheritance', 'mirathi', 'succession', 'will'],
    title: 'Probate and administration of estates',
    body: 'A person who wishes to administer an estate applies for probate (where there is a will) or letters of administration, with a citation to interested parties, an inventory of the assets and, in due course, a final account. Grants obtained by concealing heirs or assets are revoked. Primary Courts administer small estates governed by customary or Islamic law.',
    source: 'Probate and Administration of Estates Act, Cap. 352; Magistrates\' Courts Act, Cap. 11, Fifth Schedule.'
  },
  {
    keys: ['bail', 'arrest', 'police', 'remand', 'criminal', 'custody'],
    title: 'Arrest and bail',
    body: 'A person arrested must be informed of the reason, allowed to communicate with a lawyer or relative, and brought before a court without unreasonable delay. Bail is the rule for bailable offences and may be granted with sureties or conditions; refusal must be justified on grounds set by law.',
    source: 'Criminal Procedure Act, Cap. 20, ss. 32, 148 and 149.'
  },
  {
    keys: ['plea of guilty', 'unequivocal', 'plea', 'charge sheet'],
    title: 'Pleas and the charge sheet',
    body: 'A charge must disclose every essential element of the offence, and a plea of guilty is only unequivocal where the accused admits each ingredient and the facts are read, admitted and recorded. On an unequivocal plea the prosecution need not prove the case further, and appeal is confined to matters raised and decided below.',
    source: 'Criminal Procedure Act, Cap. 20, ss. 132, 228 and 245(2).'
  },
  {
    keys: ['cautioned statement', 'confession', 'evidence', 'hearsay', 'identification', 'exhibit'],
    title: 'Evidence in criminal trials',
    body: 'A cautioned or extrajudicial statement must be taken within the statutory time and voluntarily; a retracted or repudiated confession needs corroboration before it can ground a conviction. Visual identification must be watertight as to conditions, and an exhibit must be properly tendered, cleared for admission and read out before it can be relied on.',
    source: 'Evidence Act, Cap. 6, ss. 27, 33 and 67; Criminal Procedure Act, Cap. 20, ss. 50 and 57.'
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
    keys: ['arbitration', 'arbitral award', 'award', 'mediation clause'],
    title: 'Arbitration and enforcement of awards',
    body: 'Where the parties agreed to arbitrate, the court stays its own proceedings and holds them to that agreement. An award is enforced by registration as a decree, and may be set aside only on the narrow statutory grounds (incapacity, invalid agreement, want of notice, excess of jurisdiction, irregular procedure or public policy).',
    source: 'Arbitration Act, No. 2 of 2020, ss. 73–79; Civil Procedure Code, Cap. 33.'
  },
  {
    keys: ['tax', 'vat', 'value added tax', 'tra', 'assessment', 'objection', 'excise', 'kodi'],
    title: 'Tax assessments, objections and appeals',
    body: 'Object to an assessment in writing within 30 days, paying the statutory deposit or applying expressly for a waiver, and file the supporting documents at the objection stage or seek leave to do so later — the burden of proof in a tax appeal is on the taxpayer. Appeals run from the Commissioner General to the Tax Revenue Appeals Board, the Tax Revenue Appeals Tribunal and then the Court of Appeal, and a tribunal must give reasons for its decision.',
    source: 'Tax Administration Act, Cap. 438, ss. 51 and 53; Tax Revenue Appeals Act, Cap. 408; Value Added Tax Act, Cap. 148.'
  },
  {
    keys: ['appeal', 'court of appeal', 'notice of appeal', 'record of appeal', 'certificate of delay'],
    title: 'Appeals to the Court of Appeal',
    body: 'Lodge the notice of appeal within 30 days of the decision, serve it, request the proceedings in writing and file the record of appeal within 60 days. The period excluded by a certificate of delay must be properly certified, and service of the request must be provable — defects on either point routinely lead to the appeal being struck out as time-barred.',
    source: 'Appellate Jurisdiction Act, Cap. 141; Tanzania Court of Appeal Rules, 2009, rr. 83, 90(1) and 96.'
  },
  {
    keys: ['extension of time', 'good cause', 'delay', 'rule 10', 'out of time'],
    title: 'Extension of time',
    body: 'Extension of time is a judicial discretion exercised on good cause. You must account for every single day of the delay with supporting evidence; a vague affidavit, or reliance on counsel\'s inadvertence alone, is fatal. Illegality of the impugned decision may amount to sufficient cause where it is apparent on the face of the record.',
    source: 'Tanzania Court of Appeal Rules, 2009, r. 10; Law of Limitation Act, Cap. 89, s. 14.'
  },
  {
    keys: ['revision', 'stay of execution', 'reference', 'striking out'],
    title: 'Revision, reference and stay of execution',
    body: 'Revision is not an alternative to an appeal: where a competent appeal exists and is not blocked, revision — including on the court\'s own motion — is improper. A stay of execution requires a pending appeal, substantial loss and security for due performance of the decree. A single Justice\'s order may be referred to a full bench.',
    source: 'Appellate Jurisdiction Act, Cap. 141, s. 4(3); Tanzania Court of Appeal Rules, 2009, rr. 11 and 62; Civil Procedure Code, Cap. 33, O. XXXIX.'
  },
  {
    keys: ['jurisdiction', 'nullity', 'pecuniary', 'wrong forum'],
    title: 'Jurisdiction and nullity',
    body: 'Jurisdiction is the first question in every matter: proceedings taken in the wrong forum, or by a tribunal sitting without its assessors, are a nullity and are quashed on appeal or revision however meritorious the claim. Plead the pecuniary and territorial jurisdiction on the face of the pleading.',
    source: 'Magistrates\' Courts Act, Cap. 11; Land Disputes Courts Act, Cap. 216, s. 23; Civil Procedure Code, Cap. 33.'
  },
  {
    keys: ['data', 'privacy', 'personal data', 'protection'],
    title: 'Personal data protection',
    body: 'Controllers and processors must register with the Personal Data Protection Commission, collect data for a specified lawful purpose, keep it no longer than necessary, and honour data subject rights of access, rectification and erasure. Breaches must be notified without undue delay.',
    source: 'Personal Data Protection Act, No. 11 of 2022.'
  },
  {
    keys: ['cybercrime', 'online', 'social media', 'computer'],
    title: 'Cybercrimes and online conduct',
    body: 'Publishing false information, cyberbullying, unauthorised access to a computer system and the non-consensual sharing of intimate images are offences. Electronic evidence must be obtained and certified in the manner the law requires before a court will act on it.',
    source: 'Cybercrimes Act, No. 14 of 2015; Electronic Transactions Act, No. 13 of 2015.'
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
  },
  {
    keys: ['constitution', 'human rights', 'basic rights', 'petition'],
    title: 'Constitutional and human rights litigation',
    body: 'A person whose basic rights are infringed may petition the High Court, which sits as a bench of three Justices in such petitions. The Court of Appeal hears the appeal, save that constitutional questions arising under the Constitution of Zanzibar are outside its reach.',
    source: 'Constitution of the United Republic of Tanzania, 1977, arts. 12–30 and 117; Basic Rights and Duties Enforcement Act, Cap. 3.'
  }
];

const CASES = window.TZ_CASES || [];
const TANZLII_SEARCH = 'https://tanzlii.org/search/?q=';
const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'does', 'about', 'have', 'with', 'from', 'that', 'this', 'they',
  'court', 'case', 'cases', 'said', 'says', 'tanzania', 'tanzanian', 'judgment', 'judgments', 'there',
  'been', 'will', 'must', 'should', 'shall', 'take', 'made', 'been', 'into', 'your', 'their'
]);

const log = document.getElementById('chat-log');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const chips = document.getElementById('chips');

const SUGGESTIONS = [
  'How is employment terminated fairly?',
  'Is retrenchment consultation enough with financial statements?',
  'What are my land dispute options?',
  'Am I entitled to bail?',
  'How do I object to a TRA tax assessment?',
  'Show me decided cases on extension of time',
  'What is [2026] TZCA 148 about?',
  'Nataka msaada wa kisheria (legal aid)'
];

function bubble(text, who, source) {
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.innerHTML = source ? `${text}<span class="src"><strong>Sources:</strong> ${source}</span>` : text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function matchedKeys(keys, q) {
  return keys.filter((key) => {
    const pattern = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(`(^|[^a-z])${pattern}`).test(q);
  });
}

function caseLink(c) {
  return `<a href="${TANZLII_SEARCH}${encodeURIComponent(`"${c.c}"`)}" target="_blank" rel="noopener">${c.c}</a>`;
}

function citationLookup(q) {
  const m = q.match(/\[?(\d{4})\]?\s*tzca\s*(\d+)/i);
  if (!m) return null;
  return CASES.find((c) => c.y === Number(m[1]) && c.c.endsWith(` ${m[2]}`)) || null;
}

function findCases(q) {
  const terms = q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3 && !STOP_WORDS.has(t));
  if (!terms.length) return [];
  return CASES.map((c) => {
    const blob = `${c.t} ${c.s} ${c.sub} ${c.a}`.toLowerCase();
    const score = terms.reduce((n, t) => (blob.includes(t) ? n + 1 : n), 0);
    return { c, score };
  })
    .filter((s) => s.score >= Math.min(2, terms.length))
    .sort((a, b) => b.score - a.score || b.c.y - a.c.y)
    .slice(0, 3)
    .map((s) => s.c);
}

function caseBlock(cases) {
  if (!cases.length) return '';
  const items = cases
    .map((c) => `<li><strong>${c.t}</strong> (${c.r}) ${caseLink(c)}, ${c.d} &mdash; ${c.s}</li>`)
    .join('');
  return `<br /><br /><em>Decided cases of the Court of Appeal on point:</em><ul>${items}</ul>`;
}

function answer(question) {
  const q = question.toLowerCase();

  const cited = citationLookup(q);
  if (cited) {
    bubble(
      `<strong>${cited.t}</strong><br />${cited.r} &middot; ${caseLink(cited)} &middot; ${cited.d}${cited.reg ? ` &middot; ${cited.reg} Registry` : ''}<br /><br />${cited.s}<br /><br /><em>Headnotes:</em> ${cited.sub}<br /><em>Coded outcome:</em> ${cited.o}`,
      'bot',
      'Court of Appeal of Tanzania, judgment indexed on TanzLII. Read the full judgment before citing it.'
    );
    return;
  }

  const scored = KNOWLEDGE
    .map((k) => {
      const hits = matchedKeys(k.keys, q);
      return { k, score: hits.length, specificity: hits.reduce((n, key) => Math.max(n, key.length), 0) };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.specificity - a.specificity);

  const cases = findCases(q);

  if (!scored.length) {
    if (cases.length) {
      bubble(
        `I have no statutory note on that phrasing, but these Tanzanian decided cases mention it.${caseBlock(cases)}`,
        'bot',
        'Court of Appeal of Tanzania judgments indexed on TanzLII.'
      );
      return;
    }
    bubble(
      'I do not have a grounded answer for that in my current corpus, so I will not guess. Try one of the suggested topics, rephrase with the area of law involved, or <a href="legal-aid.html#book">book a free consultation</a> with an advocate.',
      'bot'
    );
    return;
  }

  const best = scored[0].k;
  const alsoSee = scored.slice(1, 3).map((s) => s.k.title);
  const related = alsoSee.length ? `<br /><br /><em>Related desks:</em> ${alsoSee.join('; ')}.` : '';
  bubble(`<strong>${best.title}</strong><br />${best.body}${caseBlock(cases)}${related}`, 'bot', best.source);
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
  `Habari! I am <strong>Samwel</strong>, the Lens Law research assistant of the Machugu Foundation. I work only on Tanzanian law: statutes from the Laws of Tanzania and ${CASES.length} decided cases of the Court of Appeal indexed on TanzLII. Ask about employment, land, family, probate, criminal procedure, evidence, tax, appeals or legal aid &mdash; or paste a citation such as [2026] TZCA 148 &mdash; and I answer with the authority you should read next.`,
  'bot'
);
