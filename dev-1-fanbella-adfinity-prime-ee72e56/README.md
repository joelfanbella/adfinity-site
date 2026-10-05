# Adfinity — Corporate Website

Marketing site for **Adfinity Global Solutions**, built around the brand idea *Advancing Possibilities. Infinitely.*

The site presents Adfinity as a company that has grown out of advertising into media networks, display engineering, entertainment and emerging intelligent systems — framed as **one brand, multiple horizons** rather than a set of business divisions.

## Stack

Static HTML, CSS and a small shared script. Light mode only. No build step, database or CMS.

## Running locally

From this folder:

```bash
python -m http.server 43187
```

Then open [http://localhost:43187](http://localhost:43187).

## Site structure

| Route | Purpose |
| --- | --- |
| `/` | Hero (`Advancing Possibilities. Infinitely.`), brand story, ecosystem, display technologies, proof + impact, philosophy, people + culture, future, brand close |
| `/about` | Brand story in full, company chapters, ecosystem, philosophy, culture, geography |
| `/ecosystem` | One mindset, multiple horizons — all five horizons |
| `/ecosystem/media-networks` | DOOH network build and operations |
| `/display-technologies` | LED and digital display practice, four product families, 19 product lines |
| `/display-technologies/[slug]` | Product page: overview, key specifications, applications, technical information, visuals, enquiry form |
| `/ecosystem/fanbella` | Entertainment ecosystem built around participation |
| `/ecosystem/csir` | Responsibility initiative with its own visual identity (sample content — see below) |
| `/ecosystem/whats-next` | Possibilities being explored or still taking shape |
| `/projects` | Selected projects and client brands |
| `/projects/[slug]` | Project page: scope, outcome, metrics |
| `/services` | The six lifecycle services and their deliverables |
| `/team` | Culture pillars, leadership, teams, careers |
| `/brands` | House brands and client brands |
| `/contact` | Enquiry form, contact routes, office details |

`/ecosystem/display-technologies` redirects to `/display-technologies` so the ecosystem navigation and the top-level navigation resolve to the same page.

## Content model

All copy and structured content lives in `src/lib` so it can be edited without touching components:

- `site.ts` — brand statements, navigation, contact details, hero words, stats
- `ecosystem.ts` — the five horizons and their accent colours
- `products.ts` — four product families and 19 LED product lines with specs, applications and technical notes
- `projects.ts` — selected projects, plus house and client brand lists
- `services.ts` — six lifecycle services and the philosophy pillars
- `people.ts` — culture pillars, leadership and team functions

## Design system

Tokens and custom utilities are defined in `src/app/globals.css`:

- Dark "ink" base (`--ink`) with an ember accent (`--ember`) and a cool signal accent (`--signal`)
- `display-xl` / `display-lg` / `display-md` type scale, `eyebrow`, `shell`, `grid-veil`, `hairline`, `text-infinite`
- Scroll reveal via the `Reveal` component and the `.reveal` class, with `prefers-reduced-motion` honoured throughout

## Known placeholders

These are intentional and flagged in the code:

- **Imagery** — product and project visuals are rendered procedurally by `src/components/display-visual.tsx`, keyed off each item's slug. Replace with photography by swapping that component for `next/image`.
- **Brand logos** — `src/components/logo.tsx` renders typographic lockups (`BrandMark`) where real client logo files would sit.
- **CSIR copy** — the page carries sample content in the final shape; the page states this on screen. Real copy drops into `src/app/ecosystem/csir/page.tsx`.
- **Leadership** — `src/lib/people.ts` holds role-based entries rather than invented names and bios.
- **Enquiry form** — `POST /api/enquiry` validates and logs server-side. Point it at the real email, CRM or webhook destination when credentials exist.
