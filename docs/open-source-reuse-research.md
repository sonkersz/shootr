# Open-source reuse research

Research snapshot: 11 November 2026.

## Recommended foundation: Pelli Instant

Repository: [Synapsr/Pelli-Instant](https://github.com/Synapsr/Pelli-Instant)  
License: MIT (repository source); model weights and notices are separately licensed.  
Pinned source revision: `f8e2a8f4a812355c5e153773458a2c05de0acfde` (0.1.1).

Pelli is a Tauri 2 desktop app with React/TypeScript UI and Rust culling engine. The engine separates into workspace crates for image decoding, analysis, ML inference, types, and orchestration. Its UI/engine contract already covers project folders, progress events, review marks, similarity groups, face/eye/focus/exposure assessments, previews, and export. This is a much stronger cost and quality starting point than writing inference from scratch.

The engine documents `PELLI_INSTANT_NO_ACCOUNT=1` for builds with no sign-in, usage API calls, or analysis quota. ShootR should omit Pelli account/gallery features and use only the local workflow. Pin the reviewed commit to prevent surprise engine changes.

Pelli describes JPEG and RAW preview support; it does not develop RAW files. Standard inference uses locally installed ONNX models, so per-image cloud cost is avoided, but first-run download size and device speed remain practical costs. Inspect the exact model manifest, model cards, and distribution terms before bundling or redistributing weights. The source repository's MIT license does not automatically license every model file.

## Alternatives reviewed

- [ShotSieve](https://github.com/cfelicio/ShotSieve): local-first Python app with learned quality models; AGPL-3.0-or-later, so not selected for a proprietary-friendly reuse path.
- [facet](https://github.com/ncoevoet/facet): local AI scoring and face recognition; GitHub did not establish a clear OSI license in the inspected metadata, so do not copy until verified.
- [LibRaw-Wasm](https://github.com/ybouane/LibRaw-Wasm) and [raw-viewer](https://github.com/pg0/raw-viewer): potentially useful RAW viewing code, but license metadata was absent in the inspected repositories; do not reuse until verified.
- darktable: useful free/open-source RAW editor, but its manual selection workflow does not provide the culling pipeline ShootR needs.

## Integration and attribution requirements

- Consume or vendor Pelli code at the pinned revision and include its MIT copyright/license notice.
- Keep modifications to reused engine code isolated and documented.
- Audit transitive Rust and npm dependencies and the precise model files before public distribution.
- Preserve the Pelli engine's local-only behavior for the culling path. Do not send photographers' images to an ad network or analytics endpoint.
- Revisit the pin after a deliberate upstream review; do not float to `main`.

## References

- [Pelli Instant repository and README](https://github.com/Synapsr/Pelli-Instant)
- [Pelli Instant engine crate](https://github.com/Synapsr/Pelli-Instant/tree/main/crates/cull-engine)
- [Pelli Instant no-account engine entry point](https://github.com/Synapsr/Pelli-Instant/blob/f8e2a8f4a812355c5e153773458a2c05de0acfde/crates/cull-engine/src/lib.rs)
- [MIT License text](https://opensource.org/license/mit)
