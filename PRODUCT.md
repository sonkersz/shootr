# Product

<!-- impeccable:product-schema 1 -->

## Platform

macOS and Windows desktop app built with Tauri 2.

## Stack

React + Vite + TypeScript frontend with a thin Rust/Tauri host. Use Pelli Instant's MIT-licensed Rust culling engine pinned to a reviewed commit; compile with its no-account mode. Target local-first analysis and no per-image cloud billing.

## Users

Event and portrait photographers who need to review, select, and prepare large sets of photos after a shoot.

## Product Purpose

ShootR helps photographers cull and prepare photos in one workspace at no software cost. Image analysis runs on the photographer's device, with source images kept local.

## Positioning

A local-first photo workflow with no per-image or project quota: on-device analysis, reversible photographer-controlled picks, and basic batch edits. Optional disclosed ads may support development but must never block ordinary culling, edits, or export.

## Operating Context

Photographers work from folders of images after events or portrait sessions, often reviewing many similar frames and transferring selections into an editor such as Lightroom or Capture One. Results must be easy to compare, mark, filter, edit in batches, and export.

## Capabilities and Constraints

- The user explicitly requested free AI culling and editing, with the option to watch ads while a local culling job runs.
- The user selected a desktop architecture based on Pelli Instant, a dark editing workspace, and code-first implementation.
- Pelli Instant's MIT-licensed Rust engine supports local AI analysis, RAW previews, similarity groups, face/eye/focus/exposure checks, ratings and export. Pin and attribute reused code; review each model's license separately.
- Build the engine with `PELLI_INSTANT_NO_ACCOUNT=1` so culling does not need a Pelli account or quota. Exclude Pelli gallery upload/account features from ShootR.
- Keep source images unchanged; culling decisions and edits must be reversible and portable.
- Favor local inference to avoid per-image server costs, uploads, and usage caps. Processing time depends on the user's device.
- RAW preview support is not equivalent to RAW development. Do not imply full RAW editing unless implemented.
- Ads must be voluntary and clearly disclosed. Skipping or closing an ad must not block the normal photo workflow. A provider and publisher account are still unresolved; no inventory or earnings are promised.
- Ad revenue would be paid to ShootR's publisher account, not the photographer. Do not describe ads as payment to users or claim that viewing a specific duration funds a specific amount of compute.
- First build scope: Tauri app shell, folder import, local culling through Pelli's engine, manual review, ratings, and portable selection export. Editing means basic non-destructive adjustments only after culling is connected.
- Unresolved: first supported OS packaging, first-run model download/distribution, ad provider/account and reward mechanic, and exact model weights and notices.

## Evidence on Hand

- Competitor research: `docs/competitive-research.md`.
- Reuse and licensing review: `docs/open-source-reuse-research.md`.
- Ad-supported model research: `docs/ad-supported-research.md`.
- No ShootR customer testimonials, performance benchmarks, or verified culling accuracy data yet. Do not invent them.

## Product Principles

- Keep the photographer in control; AI flags and groups, the photographer decides.
- Keep source files local and untouched.
- Make unlimited use possible without relying on paid cloud inference.
- Make edits and ratings reversible and portable.
- Make advertising transparent and optional, and never make it interrupt the work.
