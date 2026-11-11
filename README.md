# ShootR

ShootR is a local-first desktop photo culling workspace built with React, Vite, TypeScript, Tauri 2, and the MIT-licensed [Pelli Instant](https://github.com/Synapsr/Pelli-Instant) culling engine.

## Current state

The repository contains the research and the first desktop workspace scaffold. The UI calls the pinned Pelli Rust engine for local folder scanning, culling, ratings, and previews. Culling uses Pelli's no-account build mode; Pelli account, quota, and gallery features are excluded.

Sign-in, profile sync, owner user management, model distribution, live ads, and export UX are not production-ready. The account screens disclose that an identity backend is not configured. The ad slot stays inactive until a desktop-app publisher partner approves ShootR and supplies its integration details. The research names Playwire as the first provider to qualify; no earnings or ad availability are guaranteed.

The first build does not include a second culling engine, cloud image API, or bundled model weights. Model weights need their own size and license review before distribution.

## Development

Requirements: Node.js 20+, Rust 1.92+, and the platform prerequisites for Tauri 2. The Pelli standard model bundle is about 223 MB; model files are not committed to this repository. Their notices and license details are listed in the pinned upstream model manifest.

Fetch the model files from the pinned Pelli source, then point ShootR at them:

```sh
git clone https://github.com/Synapsr/Pelli-Instant.git /tmp/pelli-instant
cd /tmp/pelli-instant
git checkout f8e2a8f4a812355c5e153773458a2c05de0acfde
node scripts/fetch-models.mjs
cd /path/to/shootr
npm install
SHOOTR_MODELS=/tmp/pelli-instant/models npm run tauri dev
```

The source checkout's fetch script verifies model hashes. Review the model license notices before redistributing weights in a ShootR installer.

For the frontend alone:

```sh
npm run dev
```

The native culling engine is pinned to Pelli Instant revision `f8e2a8f4a812355c5e153773458a2c05de0acfde`. The repository's Cargo environment sets `PELLI_INSTANT_NO_ACCOUNT=1`.

## Research

- [Competitive research](docs/competitive-research.md)
- [Open-source reuse and licensing](docs/open-source-reuse-research.md)
- [Desktop ad monetization research](docs/ad-supported-research.md)

ShootR keeps source photos on the user's device. Ad providers must never receive photo files, thumbnails, embeddings, or culling labels.
