# 🛰️ The ISS is above

Live tracker that shows where the International Space Station is right now, what it is flying over, and a photo of the place.

**Live demo:** https://gastonri.github.io/iss-is-above

## Features

- Real-time ISS position, refreshed every 5 seconds, with a dotted trail of its last ~15 minutes
- Reverse geocoding: city or country, or the ocean when it is over water
- A photo and short description of the place, from Wikipedia
- Pass log for Córdoba, Argentina: every time the ISS gets within 500 km it is recorded (start, end, closest approach, duration) in the browser's `localStorage`. Only passes that happen while the page is open are captured
- Altitude, speed and day/night visibility
- Spanish and English (auto-detected, switchable); Wikipedia photo and text follow the chosen language
- Dark and light themes (follows the system, switchable)
- Short explainer of what the ISS is
- Responsive, respects `prefers-reduced-motion`
- No API keys needed

## Stack

React 19, TypeScript, Vite, Leaflet / react-leaflet, Vitest.

Data sources: [wheretheiss.at](https://wheretheiss.at), [BigDataCloud](https://www.bigdatacloud.com) (reverse geocoding) and the Wikipedia REST API. Map tiles by OpenStreetMap.

## Getting started

```bash
npm install
npm run dev
```

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Dev server with hot reload      |
| `npm run build`     | Typecheck and production build  |
| `npm run typecheck` | TypeScript only                 |
| `npm test`          | Unit tests                      |

## Deployment

Every push to `master` runs typecheck, tests and build, then publishes to GitHub Pages through `.github/workflows/deploy.yml`. In the repo settings, set **Pages > Source** to **GitHub Actions**.

## Project layout

```
src/
  components/   IssMap, InfoPanel
  hooks/        useIss (polling + trail), usePlace (geocoding + photo), usePassLog, useTheme
  lib/          API clients, i18n dictionaries, formatting helpers, tests
```

## History

The first version (2020) was a job-interview exercise built with Webpack 4 and React 16. v2 is a rewrite.

## License

MIT
