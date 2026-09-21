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

Update the WhatsApp number via the `data-whatsapp-number` attribute on `<body>`
in `index.html`, and the email address in the contact section's `mailto:` link.
