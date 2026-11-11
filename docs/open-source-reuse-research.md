# Open-source reuse research

Research snapshot: 11 November 2026.

## Recommended foundation: Pelli Instant

Repository: [Synapsr/Pelli-Instant](https://github.com/Synapsr/Pelli-Instant)  
License: MIT (repository source); model weights and notices are separately licensed.  
Pinned source revision: `f8e2a8f4a812355c5e153773458a2c05de0acfde` (0.1.1).

Pelli is a Tauri 2 desktop app with React/TypeScript UI and Rust culling engine. The engine separates into workspace crates for image decoding, analysis, ML inference, types, and orchestration. Its UI/engine contract already covers project folders, progress events, review marks, similarity groups, face/eye/focus/exposure assessments, previews, and export. This is a much stronger cost and quality starting point than writing inference from scratch.

The engine documents `PELLI_INSTANT_NO_ACCOUNT=1` for builds with no sign-in, usage API calls, or analysis quota. ShootR should omit Pelli account/gallery features and use only the local workflow. Pin the reviewed commit to prevent surprise engine changes.

Pelli describes JPEG and RAW preview support; it does not develop RAW files. Standard inference uses locally installed ONNX models, so per-image cloud cost is avoided, but first-run download size and device speed remain practical costs. Inspect the exact model manifest, model cards, and distribution terms before bundling or redistributing weights. The source repository's MIT license does not automatically license every model file.

## Additional repositories reviewed on 11 November 2026

- [Photo Curator](https://github.com/kotyzap/Photo-Curator): MIT, local Python app, handles JPEG/HEIC/RAW previews and uses a contrast-normalized sharpness score plus perceptual hashes, EXIF timing, and ORB matching for deduplication. Best candidate for algorithm/fixture comparison. Pelli already includes sharpness and duplicate analysis, so bringing up a separate Python runtime would add packaging and maintenance cost without a clear current gain. Revisit its blur and false-duplicate cases in evaluation.
- [OpenPhotoCull](https://github.com/zwoodard/OpenPhotoCull): MIT, Rust + Tauri + React and reports very fast CPU culling, with Vision framework features limited to macOS. Strong source of performance ideas and comparison cases. It overlaps Pelli's quality pipeline; a second scanner would increase binary size and maintenance, so do not combine engines without a measured accuracy or speed win.
- [Facet](https://github.com/ncoevoet/facet): the current repository includes an MIT license (verified in its LICENSE file on 11 November 2026). It has a broader 9-dimension quality, composition, and face analysis pipeline, burst/similarity grouping, and semantic search, but uses a Python/PyTorch/Angular architecture with additional model dependencies. Use as a benchmark and model-quality reference; do not package the whole runtime into the first desktop build. Recheck individual model licenses and sizes before considering any model.
- [ApertureFlow](https://github.com/ildrm/apertureflow): MIT Tauri/Rust/React project with CPU-first culling and a non-destructive edit-recipe concept. The repository is early (low activity and minimal adoption at review), and the CPU checks overlap Pelli. Review its edit and XMP design later; do not add yet.
- [CullAI](https://github.com/AshminDhungana/CullAI): MIT, but its own description says resized previews can be sent to external AI APIs unless configured for Ollama. This introduces variable per-image cost and privacy/setup complexity, conflicting with our no-cloud-cost goal. Do not use its hosted-provider path.
- [photocull-ai](https://github.com/joneilcaoile/photocull-ai): advertised as a single-file local culler, but repository metadata did not expose a license during inspection. Do not copy without a verifiable license.

## Alternatives reviewed

- [ShotSieve](https://github.com/cfelicio/ShotSieve): local-first Python app with learned quality models; AGPL-3.0-or-later, so not selected for a proprietary-friendly reuse path.
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


## Cost and quality strategy

The photo-analysis path should stay on-device. That makes cloud inference cost approximately zero per photo for ShootR; it does not mean user devices consume zero electricity or that there are zero model-distribution/support costs. Avoid API-based image analysis as the default.

Use the Pelli pipeline first, then benchmark against Photo Curator and Facet's published dimensions on representative wedding/event sequences before adding another model. Prioritize small downsampled previews, one decode per photo, CPU-first parallelism, cached analysis, and optional accelerators. Only add a heavier model when measured keeper quality improves enough to justify larger downloads and slower or more power-hungry processing.

Ad views must never slow down or pad local analysis. During actual processing, an optional provider-approved ad can run alongside inference, subject to availability and user consent. ShootR earns only if the network serves a valid monetized impression; revenue depends on fill, format, geography, and provider terms, and cannot be promised per image or per culling minute. Since the AI runs on the device, measure product economics against hosting, model distribution, support, and development costs—not a fictional cloud inference bill.
