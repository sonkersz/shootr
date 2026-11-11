/**
 * Provider boundary for ads shown inside the ShootR desktop app.
 *
 * No ad SDK is bundled or called until a desktop publisher account is approved.
 * Keep photo paths, thumbnails, embeddings, culling decisions, and edit data
 * out of this interface. Provider adapters may only receive consent and
 * installation/session identifiers explicitly allowed by the provider.
 */
export type AdUnavailableReason = "not-configured" | "no-fill" | "offline" | "consent-required";

export type AdSlotState =
  | { status: "unavailable"; reason: AdUnavailableReason }
  | { status: "loading" }
  | { status: "ready"; provider: string }
  | { status: "showing"; provider: string }
  | { status: "completed"; provider: string; impressionId?: string };

export interface DesktopAdProvider {
  readonly name: string;
  canServe(): boolean;
  requestOptionalAd(input: {
    foreground: boolean;
    analysisIsRunning: boolean;
    consent: "granted" | "denied" | "unknown";
  }): Promise<AdSlotState>;
  close(): void;
  onStateChange?(listener: (state: AdSlotState) => void): () => void;
}

/** Until publisher approval and SDK credentials exist, fail closed with no ad request. */
export const noAdProvider: DesktopAdProvider = {
  name: "inactive",
  canServe: () => false,
  async requestOptionalAd() {
    return { status: "unavailable", reason: "not-configured" };
  },
  close() {},
};

/** Keep ad opportunities tied to actual visible work, never artificial wait time. */
export function mayRequestAd(input: {
  foreground: boolean;
  analysisIsRunning: boolean;
  consent: "granted" | "denied" | "unknown";
}): boolean {
  return input.foreground && input.analysisIsRunning && input.consent === "granted";
}
