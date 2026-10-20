# Alba Vize — What We've Built So Far

## The Site

A single-page website for **Alba Vize**, a consulting service helping Turkish (and Azerbaijani) citizens relocate to Albania. The site handles visas, residence permits, company formation, and other settlement services.

Live domain (once connected): **albavisa.com**

---

## What Was Already in Place

- Full Turkish/English language toggle driven by `data-tr` / `data-en` attributes in HTML and a vanilla JS `applyLanguage()` function
- Particle field hero (Three.js), scroll animations (GSAP + ScrollTrigger), mobile nav drawer
- Contact form that fires a pre-filled WhatsApp message
- Cookie consent banner
- Sitemap and robots.txt
- Open Graph / Twitter card meta tags
- JSON-LD structured data (ProfessionalService + FAQPage)

---

## Changes Made in This Session

### 1. Azerbaijani (AZ) Language Support
- Added `data-az` attributes to **every translatable element** across the entire page — navbar, hero, ticker, about section, all 13 service cards, how-it-works steps, community cards, all 12 FAQ items, contact form, footer, cookie banner
- Added `data-az-placeholder` to all 4 form inputs
- Added `data-az-aria` to the WhatsApp float button
- Added the **AZ button** to both the desktop and mobile language toggles (now TR / EN / AZ)
- The JS already had `az` wired in the `langs` cycle array, WhatsApp message copy, and contact form copy — no JS changes needed for this

**Commit:** `9d88dce`

---

### 2. SEO — hreflang & Metadata for TR and AZ Audiences
- Updated `hreflang="tr"` → `hreflang="tr-TR"` (region-specific)
- Added `hreflang="az-AZ"` so Google knows to show the site to Azerbaijani searchers
- Added `og:locale:alternate` for `az_AZ`
- Added `"az"` to `availableLanguage` in the JSON-LD structured data

**Commit:** `345e2ed`

---

### 3. Separate Language Pages + Domain Update
Google only crawls a URL once and can't run the JS language toggle, so it always saw Turkish content regardless of what language a user might see. The fix: separate URLs per language.

**New structure:**
| URL | Language | Audience |
|---|---|---|
| `albavisa.com/` | Turkish | Turkish users (default) |
| `albavisa.com/az/` | Azerbaijani | Azerbaijani users |
| `albavisa.com/en/` | English | International |

**What was done:**
- Replaced placeholder domain `ferialrroga.example` → `albavisa.com` everywhere (canonical, hreflang, OG tags, JSON-LD)
- Created `az/index.html`: all visible text hardcoded in Azerbaijani, AZ meta title/description, `og:locale` set to `az_AZ`, canonical pointing to `/az/`, inline script to default the language toggle to AZ
- Created `en/index.html`: same approach for English
- Updated hreflang in all three files so each points to the others:
  ```
  albavisa.com/      → tr-TR
  albavisa.com/az/   → az-AZ
  albavisa.com/en/   → en
  albavisa.com/      → x-default
  ```
- Asset paths in subpages corrected to `../css/`, `../js/`, `../assets/`
- The language toggle still works on all three pages — visitors can still switch

**Commit:** `020adf6`

---

## File Structure

```
/
├── index.html          ← Turkish (default)
├── az/
│   └── index.html      ← Azerbaijani
├── en/
│   └── index.html      ← English
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

## What Still Needs to Be Done

- **Connect the real domain** `albavisa.com` to the hosting (Vercel)
- **Google Search Console** — submit the sitemap and verify ownership once the domain is live
- **Marketing** — Google Ads geo-targeted to Turkey and Azerbaijan, Meta (Facebook/Instagram) ads, Telegram/WhatsApp expat community groups
