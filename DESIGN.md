# ShootR Interface Direction

<!-- impeccable:surface-schema 1 -->

## Surface

Desktop photo review workspace for photographers sorting event and portrait shoots.

## Visual direction

Dark, quiet, image-first workspace. Let photographs carry color. Use a deep graphite canvas, restrained warm ivory text, muted cool-gray labels, and a single bright lime action color. Use compact controls and ample space around image groups. Avoid dashboard cards and decorative data visualizations.

## Primary composition

Persistent left rail for library and filters; compact top bar for project and search; large central filmstrip/grid with useful selection states; right inspector for AI assessment, metadata, and reversible manual marks. Keep the active photo large enough to judge focus and expression.

## Account surfaces

Provide an explicit sign-in and account creation entry, a profile summary with real per-user culling and editing statistics, and an owner-only user management view. Keep account session status visible without letting sign-in block local review. Never show invented stats; use an honest empty state until backed by stored data. Protect owner controls by server authorization, not by hiding a client-side button.

## Interaction

Folder import opens the OS picker. Analysis runs locally and reports actual engine progress. Keyboard shortcuts support next/previous, pick, reject, and rating. Every AI decision can be changed. Empty, loading, failure, and unsupported-file states explain recovery.

## Product truth

Real identity and admin access require a configured backend; prototype screens must not imply real authentication when it is unavailable.

Show whether the local culling engine and models are available. Never imply analysis is running when it is not. Advertising stays out of the active review canvas and remains optional.

## Responsive behavior

Desktop-first: prioritize 1280px+ widths, then collapse the inspector and filters into tool drawers on narrower windows.
