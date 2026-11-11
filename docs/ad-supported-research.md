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
