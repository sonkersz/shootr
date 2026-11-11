# Ad-supported model research

**Research date:** 11 November 2026

## What the provider model means

ShootR would act as a publisher. An ad network supplies sponsored creatives and pays the publisher for eligible ad impressions/completions according to the network's inventory, traffic quality, geography, demand, and commercial terms. The advertiser's payment is revenue for ShootR; the person watching an ad is not paid.

Google Ad Manager documents rewarded ad inventory on desktop, mobile, and tablet web pages. Users must be offered an explicit choice to opt in, and the publisher implements the prompt and grants the disclosed reward. Video demand can be served, but Google may also serve display demand by default. Rewarded inventory may not be available on every request, and Google documents that a rewarded slot persists until the user closes it. Google does not allow the reward to be cash or something directly redeemable for real-world goods. The reward must be on-platform, non-transferable, clearly described before each ad, and skipping or declining must not impede normal use. [Google web rewarded-ad setup](https://support.google.com/admanager/answer/9116812?hl=en) · [Reward policies](https://support.google.com/admanager/answer/7496282?hl=en)

Playwire separately markets rewarded video inventory for web and desktop, with publisher integrations and backfill. Its availability and economics would need a direct publisher conversation and approval. [Playwire rewarded video](https://www.playwire.com/rewarded-video-ad-units)

## Implications for ShootR

- A real ad feed requires an approved publisher account, site/domain, ad-unit configuration, privacy and consent configuration as applicable, and provider integration. A code repository alone cannot connect ad demand or promise revenue.
- Ad filling is not guaranteed. The product needs a no-ad fallback that continues the photo workflow.
- Do not automatically force full-screen video while culling. Offer a clear, affirmative “Watch a sponsored ad” action, let people close/skip, and keep normal culling/editing/export available either way.
- Run photo analysis independently on-device. The ad must not control, delay, or claim to fund a specific amount of compute time.
- If a provider requires a formal reward, choose a clearly stated, non-transferable in-product convenience feature and preserve ordinary workflow without it. Avoid claiming users can “support ShootR by watching” in a Google rewarded-ad prompt.
- Start with an adapter interface and a local demo state, not a hardcoded third-party script. Add live ads only after the publisher account, domain, provider terms, and privacy requirements are ready.

## Recommended prototype experience

During a culling job, show a compact, dismissible sponsored panel alongside real processing progress. The user may opt into a provider-backed ad if available; if none is available, the job proceeds and the panel offers no ad. Do not show an artificial processing timer, hold results until an ad ends, or claim that view time maps to compute time. Measure actual job duration locally and use that only to decide whether an ad slot is still relevant.

## Sources

- [Google Ad Manager: Traffic rewarded ads for web](https://support.google.com/admanager/answer/9116812?hl=en)
- [Google Ad Manager: Policies for ad units that offer rewards](https://support.google.com/admanager/answer/7496282?hl=en)
- [Google Publisher Tag sample: display a rewarded ad](https://developers.google.com/publisher-tag/samples/display-rewarded-ad)
- [Playwire: Rewarded video ad units](https://www.playwire.com/rewarded-video-ad-units)


## Desktop app monetization update — 11 November 2026

### Preferred route to qualify

[Playwire](https://www.playwire.com/apply-desktop-app) publicly offers a desktop-app publisher application and describes rewarded video as available for desktop apps. It promotes multiple demand sources and direct sales, which could help maximize competition for ShootR inventory if the publisher application is accepted. It does not publish a guaranteed rate, fill level, or acceptance outcome; actual earnings depend on audience, geography, engagement, demand, viewability, invalid-traffic adjustments, and the commercial revenue share in the contract. Do not promise any per-user or per-image revenue.

Playwire's own eligibility material is inconsistent: its qualification page suggests applying around 10,000 daily active users for app publishers, while its FAQ describes 1,000 DAU as an app minimum. Confirm the current threshold and revenue split with Playwire before planning around it. A new app may not qualify. Do not build forecasts from the more permissive number alone.

The desktop app can keep a stable provider interface for:
- opt-in rewarded ad while a real local analysis job is running in the foreground;
- ad load, visible, complete, close, and no-fill events;
- consent signals and provider-required identifiers;
- revenue/impression reporting through the provider dashboard;
- a fallback state that leaves culling uninterrupted when unavailable.

No provider credentials have been supplied. Do not ship live ad requests until the account is approved, contract and privacy terms are reviewed, platform support is confirmed for both macOS and Windows, and the provider's SDK has been tested in Tauri/WebView.

### Providers and policy fit

- **Playwire — first to qualify for desktop video.** Their publisher page explicitly accepts desktop-app inquiries and their rewarded-video docs list web, mobile and desktop app inventory. This is the best match found for ad video inside a native desktop workflow, subject to approval and commercial terms.
- **Adviverse — technical fallback to evaluate, not approved.** Its current SDK docs explicitly list Tauri/Electron/WebView and offer a labeled native ad card. Its publisher docs state the default rev share is 80% (publisher receives 80% of the clearing price), with the rest retained by the network; withdrawals require tax paperwork and a $25 default minimum. This is a substantial share and requires sending ad impression traffic to a newer third-party network. Validate company, advertiser demand, desktop inventory acceptance, legal terms, privacy, and payout reliability before using it. Its documented desktop SDK does not establish a rewarded-video format.
- **Vungle — Windows-only fallback.** Current docs describe a rewarded/interstitial SDK for Win32, WinUI, WinForms and WPF via WebView2, not macOS or Tauri directly. It cannot cover ShootR's cross-platform desktop audience by itself.
- **Google AdSense — do not use in the desktop app.** Google policy says publishers may not distribute Google ads through desktop software applications; showing an AdSense page inside software does not make it compliant. Google Ad Manager does offer rewarded ads on desktop web inventory, but that format is for a website/browser surface, not the Tauri native app. A separate website can use web inventory only if users visit that content as an ordinary web experience and it complies with publisher-content rules; do not load an ad-only page from the app to bypass the software restriction.
- **Playwire revenue claims are not ShootR projections.** Marketing examples are not a forecast and are not guaranteed for a small/new photography app.

### Product and revenue guardrails

- Ads run alongside culling without slowing, pausing, or padding the actual local job. Never extend processing to create more ad time.
- The ad is opt-in, clearly labeled, foreground-visible, closeable, and not a condition for using culling or export.
- If rewarded, the benefit must be a disclosed, nontransferable in-app convenience approved by the chosen partner; do not promise cash or imply viewers are paid.
- Do not auto-refresh or repeatedly replay ads unless the provider explicitly permits the format and frequency.
- Show no ad in the background, over the photo review controls, or where it can cause accidental clicks.
- Keep photo bytes and image-derived data out of the ad system. Keep account identity separate from ad identifiers unless users explicitly consent and the provider allows it.
- Since culling runs locally, there is no cloud inference bill per image to offset. Build a real P&L from net ad revenue, install/model delivery, support and service costs.

### Sources

- [Google AdSense ad placement policy](https://support.google.com/adsense/answer/1346295?hl=en) — excludes ads distributed through desktop applications.
- [Google Ad Manager rewarded ads for web](https://support.google.com/admanager/answer/9116812?hl=en) — rewarded ads for desktop/mobile/tablet web inventory.
- [Playwire desktop app application](https://www.playwire.com/apply-desktop-app) — publisher application.
- [Playwire rewarded video format](https://www.playwire.com/rewarded-video-ad-units) — desktop app inventory is listed.
- [Adviverse desktop SDK](https://adviverse.com/guides/desktop-sdk) — explicitly documents Tauri/WebView integrations.
- [Vungle Windows desktop SDK](https://support.vungle.com/hc/en-us/articles/45026606409371-Integrate-Vungle-SDK-for-Win32-WinUI-3-WinForms-or-WPF) — current supported Windows desktop frameworks.

- [Playwire qualification criteria](https://www.playwire.com/qualification-criteria) — app publishers are advised to apply at around 10,000 DAU for ROI.
- [Playwire FAQ](https://www.playwire.com/faq) — separately states 1,000 DAU as the app minimum; ask which applies to a new photo utility.
- [Adviverse desktop SDK](https://adviverse.com/guides/desktop-sdk) and [earnings and payouts](https://adviverse.com/guides/earnings-payouts) — Tauri-compatible webview SDK and default 80% publisher share; not independently validated.
