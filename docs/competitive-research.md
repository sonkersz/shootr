# Competitive research: ShootR

**Research date:** 11 November 2026  
**Product hypothesis:** a free, local-first photo culling and editing workspace for event and portrait photographers.

## Executive summary

The market already contains free or trial-based AI culling, and free RAW editors. The clearest opening is not simply “AI culling for free.” It is a practical workflow that keeps original files on the photographer’s device, leaves the final selection in their hands, and joins selection with useful non-destructive batch edits and export—without account, upload, per-photo, or subscription requirements.

The full promise must be staged. Free, unlimited processing is sustainable when inference and editing happen on the user’s computer. Matching a trained photographer editing profile, sophisticated eye/face analysis, and reliable RAW development are harder than scoring JPEG previews; they should not be implied by an early prototype.

## Competitor map

| Product | Culling and editing | Free access / pricing shape | Where it leaves room |
|---|---|---|---|
| **Aftershoot** | Local, offline app combining AI culling, editing and retouching; can learn an editing style. | 30-day full trial; then modular subscriptions. Its current site lists culling from US$10/month, editing from US$30/month, and the full workflow from US$45/month on annual billing; all have unlimited image processing. | Strongest all-in-one benchmark, but ongoing cost after trial. It is the standard to match on local privacy, batch workflow and keyboard/manual control. |
| **Narrative Select** | Desktop culling with basic and advanced AI assessment; editing presets can be applied on export to Lightroom. Final choice stays with the photographer. | No permanent free plan; free trial. Lite starts at US$10/month annual, Standard at US$20 and includes advanced AI culling and preset editing. | Excellent guided review and Lightroom handoff, but a paid plan is needed for ongoing use and editing remains tied to Lightroom. |
| **Imagen** | Cloud workflow for AI culling and style-trained editing; supports Lightroom-oriented handoff. | Two free AI culling projects; paid unlimited culling. Editing uses pay-as-you-go or subscription plans. | Easy to try, but photo upload and cloud processing are a meaningful trade-off for privacy, connectivity and recurring cost. |
| **FilterPixel** | Cloud AI culling that ranks frames and flags focus, blur, exposure and expression issues. | Four free projects, unlimited photos per project; upgrades for more projects and features. | Generous test quota, but it is a project-limited cloud service, not an unlimited local workflow. Its free-plan export/integration limits should be checked directly before designing around them. |
| **Selekt** | Local-first culling: on-device focus, exposure and blur scores, similar-frame grouping and XMP export. It keeps the photographer in control. | Free plan has unlimited imports, culling and export; cloud AI is limited to 100 photos/month, with 1 GB sync/proofing. | A close competitor for free local culling. It does not present itself as a complete RAW editor with style-trained batch editing. |
| **Neurapix Culling** | Lightroom Classic plug-in with keyboard-first selection and AI grouping; image-selection features are being released during beta. | Culling beta is advertised as free. Its AI editing services are a separate paid workflow. | Useful evidence that basic culling can be free; beta scope and Lightroom dependence limit it as an independent editing workspace. |
| **Adobe Lightroom / Classic** | Assisted culling flags potential focus, eye, exposure and similar-image issues inside a mature catalog and editing workflow. | Part of the paid Lightroom subscription. | Deep integration is hard to beat, but it is neither free nor an independent local-first product. |
| **Excire Foto** | AI search, organization and culling; launches images into the user’s preferred editor rather than replacing it. | Paid perpetual license; Excire announced Foto 2027 at an introductory US$219. | Strong library search and one-time license, but separate editing software is still needed. |
| **darktable** | Open-source, non-destructive RAW development, cataloguing and manual selection. | Free and open source. | A credible free editing foundation, but not a one-click AI culler or guided event-selection workflow. |

## Product implications

### What should feel familiar

Photographers expect quick previews, contact-sheet/grid and loupe views, side-by-side comparisons, keyboard ratings and picks/rejects, filtering, near-duplicate grouping, and a handoff that fits existing Lightroom/Capture One workflows. AI should surface evidence (focus, blur, eye state, exposure, similarity) and accelerate review; it should never silently delete originals or make an irreversible choice.

### A defensible first release

1. **Local photo session:** select a folder or files; originals stay put. No account or upload.
2. **Fast culling:** responsive grid and loupe, keyboard controls, star/color labels, undo, filters, and grouped near-duplicates.
3. **Transparent assistance:** scores and reasons for technical flags, with human override always available. Start with blur/focus, exposure and similarity; treat expression or “best moment” as optional hints.
4. **Useful editing:** non-destructive exposure, white balance, contrast, highlights/shadows, crop and rotate; copy/paste or sync edits across selected images; JPEG export.
5. **Portable results:** write picks/ratings and edit settings to sidecars or an export folder, never alter source files.
6. **No artificial usage cap:** no server inference or per-image API. Processing is limited by the user’s own device, not a project allowance.

### Scope and technical risks

A browser/PWA can run model inference on-device using ONNX Runtime Web or Transformers.js, including WebGPU where supported and CPU/WASM fallback. That avoids uploading private event photos and avoids a per-image inference bill. Browser support and speed vary, so the app needs capability detection and a graceful non-AI/manual path.

JPEG-first is the responsible MVP. Camera RAW support requires a maintained decoder and a color-managed development pipeline; LibRaw WebAssembly projects show a path, but RAW compatibility, embedded previews, demosaicing quality and memory use need real-device testing. A full custom “learn my Lightroom style” editor is also a separate project: first ship reproducible controls and batch edits rather than claiming Aftershoot-level profile training.

### Design principles to preserve

- **Assist, don’t overrule:** show why a frame was flagged and make every AI pick editable.
- **Privacy by default:** process files locally; explain any optional network/model download.
- **Fast under real shoot sizes:** virtualize grids and run analysis in background workers.
- **Reversible:** keep source images intact and make ratings/edits portable.
- **Honest capability labels:** distinguish on-device scoring from optional/cloud analysis and JPEG support from RAW support.

## Sources

- [Aftershoot product and pricing](https://aftershoot.com/), [AI culling details](https://aftershoot.com/selects/)
- [Narrative pricing](https://narrative.so/pricing), [plan feature comparison](https://help.narrative.so/en/articles/7337508-compare-narrative-plans-lite-standard-premium-and-ultra)
- [Imagen FAQ and culling pricing](https://imagen-ai.com/faq/?button_clicked=1&v=2)
- [FilterPixel free culling plan](https://filterpixel.com/free-photo-culling-software)
- [Selekt pricing and feature limits](https://www.selekt.photos/)
- [Neurapix free beta](https://www.neurapix.com/neurapix-culling), [grouping update](https://neurapix.com/media/culling-update)
- [Adobe Assisted Culling documentation](https://helpx.adobe.com/lightroom/desktop/organize-photos/assisted-culling.html)
- [Excire Foto 2027 announcement](https://excire.com/en/excire-foto-2027-is-here/)
- [darktable features](https://www.darktable.org/about/features/)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/), [Transformers.js](https://huggingface.co/docs/transformers.js/en/index), [File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API), [LibRaw WASM project](https://github.com/ybouane/LibRaw-Wasm)

Prices and free-plan limits can change. Check each vendor’s current plan before making product or launch claims. This analysis uses vendor pages where available and treats vendor claims as product descriptions, not independent performance validation.
