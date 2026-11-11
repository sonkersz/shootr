# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript, selected by the user. Intended to deploy as a static site.

## Users

Event and portrait photographers who need to review, select, and edit large sets of photos after a shoot.

## Product Purpose

ShootR helps photographers cull and prepare photos in one workspace at no software cost. The product should keep image processing on the photographer’s device where practical, and may use optional, clearly disclosed advertising to support continued free access.

## Positioning

A local-first photo workflow with no per-image or project quota: on-device analysis, reversible photographer-controlled picks, and basic batch edits. Ads may support the product but must never block ordinary culling, edits, or export.

## Operating Context

Photographers work from folders of images after events or portrait sessions, often reviewing many similar frames and transferring selections into an editor such as Lightroom or Capture One. Results must be easy to compare, mark, filter, edit in batches, and export.

## Capabilities and Constraints

- The user explicitly requested free AI culling and editing, with the ability to watch a series of ads during the time culling takes.
- Ad-supported operation is a product direction, not a current integration or a promise of ad availability. Real inventory requires publisher account approval and configuration.
- The user selected a dark editing-workspace direction and code-first implementation.
- Competitor research found that existing free options include project-limited cloud AI culling and unlimited local basic culling; the exact feature gap and implementation plan are documented in `docs/competitive-research.md`.
- Keep source images unchanged; culling decisions and edits must be reversible and portable.
- Favor local inference to avoid per-image server costs, uploads, and usage caps. Processing time will depend on the user's device.
- Browser RAW decoding and high-quality RAW development are technically more demanding than JPEG support. The first usable release should clearly state supported formats and not imply full RAW editing unless implemented.
- Ads must be voluntary and clearly disclosed. Skipping or closing an ad must not block the normal photo workflow. Any rewarded-ad implementation must comply with the chosen provider's current policies.
- Unresolved: real ad provider/account and reward mechanic; image formats for the first public release; exact model and model license; deployment domain.

## Evidence on Hand

- Competitor research: `docs/competitive-research.md`.
- No ShootR customer testimonials, performance benchmarks, or verified culling accuracy data yet. Do not invent them.

## Product Principles

- Keep the photographer in control; AI flags and groups, the photographer decides.
- Keep source files local and untouched.
- Make unlimited use possible without relying on paid cloud inference.
- Make edits and ratings reversible and portable.
- Make advertising transparent and optional, and never make it interrupt the work.
