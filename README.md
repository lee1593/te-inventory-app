# TE Inventory App — Static PWA (No monthly fees)

This is a **pure static PWA** (no build step, no subscriptions) using **vanilla JS ES modules**. 
It supports:
- Offline caching via **service worker**
- **Camera capture** with preview/confirm (uses file input with `capture="environment"` for best compatibility)
- **Meter reads** (Gas / Electric / Water) with dedicated inputs
- **Signatures** (canvas-based, saved as images)
- **IndexedDB** persistence (inspections, photos, signatures)

## How to run locally
1. Use any static server. For example, with Python:  
   `python3 -m http.server 5173`  
   Then visit http://localhost:5173
2. The service worker only works over HTTP(S), so use a local server, not file://

## How to deploy free
- **GitHub Pages**: push this folder to a repo; enable Pages. (Set the Pages source to root or `/docs` — if you use `/docs`, move files there.)
- **Vercel / Netlify (free tier)**: drag-and-drop the folder; set as a static site.
- **Any static host** works as long as it serves the files at the site root.

## Notes
- To force update after you change files, bump the `CACHE` name in `service-worker.js`.
- Photos and signatures are stored locally in the device browser (IndexedDB). They don't sync to a server yet.
- To add server sync later, create an endpoint `/api/sync` and post the `inspections/photos/signatures` data.

## Structure
- `index.html` — app shell + PWA hooks
- `styles.css` — simple UI
- `db.js` — IndexedDB helpers
- `app.js` — minimal router and pages: Home → Inspection → Review
- `components/camera.js` — capture with preview/confirm
- `components/signature.js` — signature canvas (tenant + agent)
- `components/meters.js` — three dedicated inputs
- `service-worker.js` — offline cache
- `manifest.webmanifest` — PWA manifest
- `icons/` — app icons

Enjoy!
