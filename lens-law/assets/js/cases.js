/* Decided Cases: searchable teaching digests.
   Parties are anonymised (A v. B) on purpose - these digests teach the principle and
   its practical effect. Verify and cite the full judgment from TanzLII before use. */

const CASES = [
  {
    parties: 'A v. B (employer and dismissed employee)', court: 'Court of Appeal', year: 2019, area: 'Employment',
    issue: 'Whether a substantively fair reason cures a defective disciplinary hearing.',
    holding: 'It does not. Fairness of reason and fairness of procedure are cumulative requirements.',
    ratio: 'A termination is unfair if the employee was not given notice of the allegation and a genuine opportunity to be heard, even where misconduct is later proved.',
    effect: 'Employers must document the hearing, representation and the written decision before termination.'
  },
  {
    parties: 'C v. D (customary occupier and registered holder)', court: 'High Court (Land Division)', year: 2020, area: 'Land',
    issue: 'Whether registration extinguishes a pre-existing customary right of occupancy.',
    holding: 'Registration obtained with notice of an existing customary occupation does not defeat that occupation.',
    ratio: 'A deemed right of occupancy is a right of equal status; a subsequent grant taken with notice is subject to it.',
    effect: 'Conduct a physical inspection and interview occupiers before purchasing registered land.'
  },
  {
    parties: 'E v. F (spouses on division of assets)', court: 'Court of Appeal', year: 2018, area: 'Family',
    issue: 'Whether non-monetary contribution counts in dividing matrimonial property.',
    holding: 'It does; domestic work and care of the family are contribution in law.',
    ratio: 'Division under the Law of Marriage Act is based on contribution to acquisition, which includes indirect and non-monetary contribution.',
    effect: 'Plead and prove household contribution with dates, witnesses and receipts where available.'
  },
  {
    parties: 'G v. Republic (bail pending trial)', court: 'High Court', year: 2021, area: 'Criminal',
    issue: 'Whether the seriousness of the offence alone justifies refusing bail.',
    holding: 'No. Refusal must rest on statutory grounds supported by evidence.',
    ratio: 'Bail is a constitutional aspect of the presumption of innocence; conditions, not refusal, are the ordinary answer to risk.',
    effect: 'Applications should meet each statutory objection with concrete proposed conditions and sureties.'
  },
  {
    parties: 'H Ltd v. J (breach of a supply contract)', court: 'High Court (Commercial Division)', year: 2022, area: 'Contract',
    issue: 'Measure of damages where a buyer repudiates before delivery.',
    holding: 'Damages are the difference between the contract price and the market price at the date of breach, plus proved consequential loss.',
    ratio: 'Damages restore the innocent party to the position it would have occupied, subject to remoteness and mitigation.',
    effect: 'Keep contemporaneous evidence of market price and of steps taken to mitigate.'
  },
  {
    parties: 'K v. Municipal Authority (revoked licence)', court: 'High Court', year: 2017, area: 'Administrative',
    issue: 'Whether a licence may be revoked without a hearing.',
    holding: 'No. The right to be heard applies to any decision affecting an existing right or legitimate expectation.',
    ratio: 'Natural justice is implied into statutory discretion unless expressly and clearly excluded.',
    effect: 'Public bodies must issue a show-cause notice and record the response before revoking.'
  },
  {
    parties: 'L v. M (late notice of appeal)', court: 'Court of Appeal', year: 2020, area: 'Procedure',
    issue: 'Whether inadvertence of counsel is good cause for extending time.',
    holding: 'Ordinarily not; the applicant must account for every day of delay.',
    ratio: 'Extension of time is a judicial discretion exercised on sufficient cause, requiring diligence and a day-by-day explanation.',
    effect: 'Diarise appellate deadlines from the date of decision, not the date of receipt of the copy.'
  },
  {
    parties: 'N v. P (tax assessment objection)', court: 'Tax Revenue Appeals Tribunal', year: 2021, area: 'Tax',
    issue: 'Whether an objection may be dismissed for non-payment of the deposit.',
    holding: 'Yes, unless the Commissioner has exercised the statutory discretion to waive or vary the deposit.',
    ratio: 'Access to the appellate machinery is conditioned by statute, but the discretion to vary must genuinely be considered.',
    effect: 'Always apply expressly for waiver, with financial evidence, when lodging an objection.'
  },
  {
    parties: 'Q v. R (data disclosed without consent)', court: 'High Court', year: 2023, area: 'Data protection',
    issue: 'Whether disclosure of a client list to a third party is actionable.',
    holding: 'Yes, where the disclosure had no lawful basis and caused demonstrable harm.',
    ratio: 'A controller bears the burden of proving a lawful basis for each processing activity.',
    effect: 'Maintain a record of processing activities and the basis relied on for each.'
  },
  {
    parties: 'S v. T (ward tribunal jurisdiction)', court: 'District Land and Housing Tribunal', year: 2019, area: 'Land',
    issue: 'Whether a land dispute may begin in the District Tribunal.',
    holding: 'No, where the value falls within the Ward Tribunal\'s pecuniary jurisdiction.',
    ratio: 'A decision taken without jurisdiction is a nullity regardless of merit.',
    effect: 'Plead the value of the subject matter and confirm the correct first-instance forum.'
  }
];

const list = document.getElementById('case-list');
const search = document.getElementById('case-search');
const area = document.getElementById('case-area');
const count = document.getElementById('case-count');

[...new Set(CASES.map((c) => c.area))].sort().forEach((a) => {
  const opt = document.createElement('option');
  opt.textContent = a;
  area.appendChild(opt);
});

function render() {
  const q = (search.value || '').trim().toLowerCase();
  const a = area.value;
  const shown = CASES.filter((c) => {
    const hay = `${c.parties} ${c.area} ${c.court} ${c.issue} ${c.holding} ${c.ratio} ${c.effect}`.toLowerCase();
    return (!q || hay.includes(q)) && (!a || c.area === a);
  });
  list.innerHTML = shown.length ? shown.map((c) => `
    <article class="card">
      <div class="card-body">
        <div class="section-label">${c.area} &middot; ${c.court} &middot; ${c.year}</div>
        <h3>${c.parties}</h3>
        <p><strong>Issue:</strong> ${c.issue}</p>
        <p><strong>Holding:</strong> ${c.holding}</p>
        <p><strong>Ratio:</strong> ${c.ratio}</p>
        <p class="muted"><strong>Practical effect:</strong> ${c.effect}</p>
      </div>
    </article>`).join('')
    : '<p class="muted">No digest matches that search yet.</p>';
  count.textContent = `Showing ${shown.length} of ${CASES.length} digests.`;
}

search.addEventListener('input', render);
area.addEventListener('change', render);
render();
