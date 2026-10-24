# Calderra

A shared D&D 5e world for standalone one-shots. The empire has fallen, the Sunfire Crown is gone, and a year from now the Council of Banners will decide who rules. Each one-shot has its own cast and level; the world remembers what every table did.

**Player map:** https://bniem-ops.github.io/Calderra/ (installable on phones: open it and use "Add to Home Screen")

## For the DM

- **The world:** start with `world/premise.md`, then `world/play-format.md`.
- **The one-shots:** `adventures/`, in order. Each folder is one night's game.
- **What has happened:** `ledger/state.yaml` and `ledger/sessions/`.
- **Working with Claude Code:** `CLAUDE.md` holds the rules. The usual request is "Log <session>: <what happened>."

## How the pieces connect

```
world/ + adventures/ (canon, DM-only bodies)
            │
ledger/ (state + session logs, public and private fields)
            │
scripts/build-public-data.mjs  ── strips private fields, fails on leaks
            │
map/data.json  ──►  map/ (the player app, GitHub Pages)
```

## Setup

1. `npm install`
2. `npm run build`
3. `npm run preview` and open http://localhost:4173
4. In GitHub, set **Settings → Pages → Source** to **GitHub Actions**. Every push to `main` then rebuilds and deploys the map.
