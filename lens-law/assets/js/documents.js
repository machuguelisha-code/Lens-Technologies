/* Filterable document bank for the Legal Documents desk. */

const DOCUMENTS = [
  { name: 'Sale of goods agreement', cat: 'Contracts & commercial', law: 'Law of Contract Act, Cap. 345', note: 'Define delivery, passing of risk and remedies for defective goods.' },
  { name: 'Loan agreement with guarantee', cat: 'Contracts & commercial', law: 'Law of Contract Act, Cap. 345', note: 'Guarantee must be in writing and signed by the guarantor.' },
  { name: 'Non-disclosure agreement', cat: 'Contracts & commercial', law: 'Common law of confidence', note: 'Keep the definition of confidential information narrow and time-bound.' },
  { name: 'Consultancy services agreement', cat: 'Contracts & commercial', law: 'Law of Contract Act, Cap. 345', note: 'Distinguish consultant from employee to avoid employment claims.' },
  { name: 'Agreement for sale of land', cat: 'Land & conveyancing', law: 'Land Act, Cap. 113', note: 'Confirm the title, spousal consent and any consent to transfer required.' },
  { name: 'Deed of transfer of a right of occupancy', cat: 'Land & conveyancing', law: 'Land Registration Act, Cap. 334', note: 'Register within the statutory period; attach a valuation for stamp duty.' },
  { name: 'Lease agreement (residential)', cat: 'Land & conveyancing', law: 'Land Act, Cap. 113', note: 'State the term, rent, deposit and repairing obligations expressly.' },
  { name: 'Mortgage deed', cat: 'Land & conveyancing', law: 'Land Act, Cap. 113 (Part X)', note: 'Spousal consent and a certificate of the mortgagor briefed are essential.' },
  { name: 'Will (simple estate)', cat: 'Family & succession', law: 'Probate and Administration of Estates Act, Cap. 352', note: 'Two witnesses who take no benefit under the will.' },
  { name: 'Petition for letters of administration', cat: 'Family & succession', law: 'Probate Rules', note: 'File the death certificate, family assembly minutes and the inventory.' },
  { name: 'Deed of family settlement', cat: 'Family & succession', law: 'Customary and statutory succession rules', note: 'Record consent of every adult beneficiary.' },
  { name: 'Petition for divorce', cat: 'Family & succession', law: 'Law of Marriage Act, Cap. 29', note: 'Attach the Board certificate on the breakdown of the marriage.' },
  { name: 'Contract of employment (fixed term)', cat: 'Employment', law: 'Employment and Labour Relations Act, Cap. 366', note: 'Specify duration, remuneration and the reason for a fixed term.' },
  { name: 'Notice of termination and hearing', cat: 'Employment', law: 'Employment and Labour Relations Act, Cap. 366', note: 'Fair reason plus a fair procedure: both are reviewable.' },
  { name: 'Employee handbook clauses', cat: 'Employment', law: 'Labour Institutions Act, Cap. 300', note: 'Publish the disciplinary code before you rely on it.' },
  { name: 'Plaint (civil claim)', cat: 'Litigation & pleadings', law: 'Civil Procedure Code, Cap. 33', note: 'Plead the cause of action, jurisdiction and the value of the subject matter.' },
  { name: 'Written statement of defence', cat: 'Litigation & pleadings', law: 'Civil Procedure Code, Cap. 33', note: 'Answer every paragraph; a general denial risks admission.' },
  { name: 'Affidavit in support of application', cat: 'Litigation & pleadings', law: 'Oaths and Statutory Declarations Act, Cap. 34', note: 'Facts only; argument belongs in submissions.' },
  { name: 'Notice of appeal', cat: 'Litigation & pleadings', law: 'Court of Appeal Rules, 2009', note: 'Time limits are strict and rarely extended without good cause.' },
  { name: 'Memorandum and articles of association', cat: 'Corporate & compliance', law: 'Companies Act, Cap. 212', note: 'Match the objects to the licence you intend to apply for.' },
  { name: 'Board resolution template', cat: 'Corporate & compliance', law: 'Companies Act, Cap. 212', note: 'Record quorum, conflicts declared and the exact resolution passed.' },
  { name: 'Data protection notice', cat: 'Corporate & compliance', law: 'Personal Data Protection Act, 2022', note: 'State the lawful basis, retention period and the data subject rights.' }
];

const rows = document.getElementById('doc-rows');
const search = document.getElementById('doc-search');
const cat = document.getElementById('doc-cat');
const count = document.getElementById('doc-count');

function render() {
  const q = (search.value || '').trim().toLowerCase();
  const c = cat.value;
  const list = DOCUMENTS.filter((d) => {
    const matchesQ = !q || `${d.name} ${d.cat} ${d.law} ${d.note}`.toLowerCase().includes(q);
    return matchesQ && (!c || d.cat === c);
  });
  rows.innerHTML = list.length
    ? list.map((d) => `<tr><td><strong>${d.name}</strong></td><td>${d.cat}</td><td>${d.law}</td><td class="muted">${d.note}</td></tr>`).join('')
    : '<tr><td colspan="4" class="muted">No document matches that search. Try a broader term.</td></tr>';
  count.textContent = `Showing ${list.length} of ${DOCUMENTS.length} documents.`;
}

search.addEventListener('input', render);
cat.addEventListener('change', render);
render();
