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
