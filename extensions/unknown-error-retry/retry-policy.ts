const UNKNOWN_NO_DETAILS_RE = /Unknown error \(no error details in response\)/i;
export const RETRYABLE_HINT = "provider returned error";
export const EXTENSION_TAG = "[unknown-error-retry]";

export type AssistantProviderErrorMessage = {
  role: "assistant";
  stopReason: "error";
  errorMessage: string;
  [key: string]: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAssistantProviderErrorMessage(
  message: unknown,
): message is AssistantProviderErrorMessage {
  if (!isObject(message)) return false;

  return (
    message.role === "assistant" &&
    message.stopReason === "error" &&
    typeof message.errorMessage === "string"
  );
}

export function isEmptyDetailUnknownProviderError(
  message: AssistantProviderErrorMessage,
): boolean {
  return UNKNOWN_NO_DETAILS_RE.test(message.errorMessage);
}

export function hasUnknownErrorRetryHint(
  message: AssistantProviderErrorMessage,
): boolean {
  return message.errorMessage.includes(EXTENSION_TAG);
}

export function appendRetryableProviderErrorHint(
  message: AssistantProviderErrorMessage,
): AssistantProviderErrorMessage {
  return {
    ...message,
    errorMessage: `${message.errorMessage}\n\n${EXTENSION_TAG} ${RETRYABLE_HINT}; treating empty-detail provider failure as retryable.`,
  };
}

export function annotateRetryableUnknownProviderError<T>(
  message: T,
): T | undefined {
  if (!isAssistantProviderErrorMessage(message)) return undefined;
  if (!isEmptyDetailUnknownProviderError(message)) return undefined;
  if (hasUnknownErrorRetryHint(message)) return undefined;

  return appendRetryableProviderErrorHint(message) as T;
}
