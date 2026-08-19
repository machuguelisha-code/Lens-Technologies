# Lens Law — Machugu Foundation

A static, dependency-free website for **Lens Law**, a legal knowledge platform of the **Machugu Foundation**.

## Sections

| Page | Path | Highlights |
| --- | --- | --- |
| Home | `index.html` | Hero with the Lens Law wordmark and "Machugu Foundation", cards for all 11 desks |
| Legal Documents | `pages/legal-documents.html` | Filterable bank of 22 Tanzanian document templates with drafting notes |
| Samwel AI | `pages/samwel-ai.html` | In-browser assistant on Tanzanian statutes and Court of Appeal judgments, with citations and neutral-citation lookup (no data leaves the page) |
| Weather | `pages/weather.html` | Live forecasts for 8 court stations via the key-free Open-Meteo API |
| TanzLII | `pages/tanzlii.html` | Guided gateway to free Tanzanian law plus search technique |
| Decided Cases | `pages/decided-cases.html` | Searchable teaching digests (issue / holding / ratio / effect) |
| Bench | `pages/bench.html` | Tanzanian judges and Justices of Appeal with published profiles, court hierarchy and etiquette |
| Legal Magazine | `pages/legal-magazine.html` | Cover story, article grid, submissions form |
| Jurimetric | `pages/jurimetric.html` | Canvas dashboards over Tanzanian judicial data: judgments per year, registry workload, years on the bench per Justice, subject matter and outcomes of decided cases |
| Research | `pages/research.html` | Working papers, method workflow, house citation style, request desk |
| Library | `pages/library.html` | Collections, open-access links, reading room and title requests |
| Legal Aid & Consultancy | `pages/legal-aid.html` | Clinic timetable and a consultation booking form (`#book`) |

## Running locally

No build step and no dependencies:

```bash
python3 -m http.server 8080   # then open http://localhost:8080/
```

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, Nginx). The Weather desk needs internet access; it degrades gracefully to a station list when offline.

## Structure

```
index.html
pages/            one page per section
assets/css/       styles.css (design system: navy + gold, Playfair Display + Inter)
assets/js/        main.js (shared header/nav/footer), plus one script per interactive desk
assets/img/       photography (see CREDITS.md)
```

The header, navigation and footer are rendered once by `assets/js/main.js` from the `SECTIONS` array — add or rename a desk there and every page updates.

## Content caveats

- Case digests on the Decided Cases desk use anonymised parties (`A v. B`) and teach the principle; they are not substitutes for reading the real judgment on TanzLII.
- Tanzanian judicial data lives in `assets/js/data/`: `tz-judiciary.js` (Judiciary of Tanzania leadership and High Court judge records; Justices of Appeal, judgment volumes and registries as published in the TanzLII Court of Appeal collections) and `tz-cases.js` (Court of Appeal judgments with neutral citations). Both were retrieved on 19 August 2026.
- No biography, holding or statistic is invented: where the Judiciary publishes no profile detail, the field is simply absent, and area of law and outcome are coded from TanzLII's own headnotes and summaries.
- Jurimetric counts are drawn from published court records; they are not official Judiciary statistics, and no outcome is attributed to a named judge because the coram of each judgment is not in the dataset.
- Forms (booking, magazine submission, library and research requests) are front-end only; wire them to an email service or backend before launch.
- Contact: lenstechnology.tz@outlook.com and elishamachugu@outlook.com.
