# Ferial Rroga — Relocation Consulting Website

A bilingual (Turkish / English) luxury one-page consulting website for a Tirana-based
relocation consultant helping Turkish citizens move to Albania.

## Stack

- Semantic HTML5, CSS3 (custom properties)
- [Three.js](https://threejs.org/) (CDN) — hero particle field background
- [GSAP](https://gsap.com/) + ScrollTrigger (CDN) — all animations
- Vanilla JavaScript, no build step

## Running locally

No build tools required — serve the folder with any static file server, e.g.:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Structure

```
index.html      Markup + bilingual data-tr / data-en attributes
css/style.css   Design system, layout, responsive rules
js/script.js    Language toggle, mobile nav, Three.js particles, GSAP animations
assets/         Static assets (favicon, etc.)
```

## Language toggle

All translatable text lives in `data-tr` / `data-en` attributes on each element.
`js/script.js` swaps `innerHTML` based on the active language, persists the
choice to `localStorage`, and defaults to Turkish.

## Contact details

Both the WhatsApp number and the contact email are set once, on `<body>` in
`index.html`, via `data-whatsapp-number` and `data-contact-email`. Update the
values there to change them everywhere on the site.

## Contact form

The form has no backend or database — it works entirely client-side by
handing the submission to the visitor's own apps:

- Opens their mail client via a `mailto:` link, addressed to
  `data-contact-email`, with the form's fields pre-filled as the subject/body.
- Opens WhatsApp (web or app) via a `wa.me` link to `data-whatsapp-number`,
  with the same fields pre-filled as the message text.

The visitor still has to hit send in each app — nothing is transmitted
automatically by the site itself. Message copy for both is bilingual and
picked up from `contactFormCopy` in `js/script.js`.

## SEO

- **Title/description** target actual search terms (oturma izni, vize,
  işletme kaydı), not just the brand name — see `<title>` and
  `meta[name=description]` in `index.html`.
- **Open Graph / Twitter Card** tags drive the preview shown when the link
  is shared in WhatsApp, Facebook, LinkedIn, etc. `og:image` currently
  points at `assets/og-image.jpg`, which doesn't exist yet — add a real
  1200×630 image (a photo works better than a generated graphic) at that
  path, or update the meta tags to point elsewhere.
- **Structured data** (JSON-LD in `<head>`) marks the business up as a
  `ProfessionalService` with a service catalog, and the FAQ section as a
  `FAQPage` — both are eligibility signals for Google rich results, and
  don't depend on having social media profiles.
- **FAQ section** (`#faq`) uses question-phrased headings that mirror real
  search queries ("Arnavutluk'ta nasıl oturma izni alınır?"), which is the
  single most effective on-page lever for matching long-tail searches.
- **`robots.txt`** / **`sitemap.xml`** are in the project root, both
  pointing at the placeholder domain below.

### Placeholder domain

Several files reference `https://ferialrroga.example/` as a stand-in for
the real domain (chosen because `.example` is reserved for documentation
and never resolves) — `index.html` (canonical, `og:url`, JSON-LD `url`),
`robots.txt`, and `sitemap.xml`. Once the site has a real domain, replace
every occurrence of `ferialrroga.example` across those files.

### What on-page SEO can't do alone

Meta tags and structured data make the page legible to Google; they don't
make it rank on their own. For a local service business, the highest-impact
things — all outside this codebase — are, roughly in order of leverage:

1. **Google Business Profile** — far more important than Facebook/LinkedIn
   for showing up in Google's map pack and local results for Albania-based
   searches.
2. **Reviews** on that profile.
3. **Backlinks** from other sites (Turkish expat forums, local directories,
   partner businesses).
4. **Ongoing content** — the FAQ section here is a start; a blog post
   answering one specific question in depth outranks a one-line answer.

None of these are things I can set up on your behalf (they require your
own accounts), but they matter more than any further on-page tweaking.
