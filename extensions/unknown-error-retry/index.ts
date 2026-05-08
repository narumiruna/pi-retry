import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { annotateRetryableUnknownProviderError } from "./retry-policy.js";

export default function unknownErrorRetry(pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    ctx.ui.setStatus("unknown-error-retry", "unknown-error retry: on");
  });

  pi.on("session_shutdown", (_event, ctx) => {
    ctx.ui.setStatus("unknown-error-retry", undefined);
  });

  pi.on("message_end", (event, ctx) => {
    // pi already has agent-level auto-retry for transient provider errors, but its
    // matcher does not classify this empty-detail "Unknown error" message as retryable.
    // Adding the retryable-provider-error hint before the message is finalized makes
    // pi's built-in auto-retry path pick it up, remove the failed assistant message
    // from live agent state, and call agent.continue() with the normal retry settings/backoff.
    const message = annotateRetryableUnknownProviderError(event.message);
    if (!message) return;

    if (ctx.hasUI) {
      ctx.ui.notify(
        "Matched provider 'Unknown error (no error details in response)'; letting pi auto-retry this turn.",
        "warning",
      );
    }

    return { message };
  });
}
