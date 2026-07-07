import i18n from "@/i18n";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const DEFAULT_MESSAGE_KEYS: Record<number, string> = {
  400: "common:apiErrors.400",
  403: "common:apiErrors.403",
  404: "common:apiErrors.404",
  429: "common:apiErrors.429",
  500: "common:apiErrors.500",
};

export function toastApiError(
  error: unknown,
  messages: Record<number, string> = {},
) {
  if (isAxiosError(error)) {
    // No response means the request never completed (offline, CORS, timeout).
    if (!error.response) {
      toast.error(i18n.t("common:apiErrors.network"));
      return;
    }

    const status = error.response.status;
    // Caller overrides arrive already translated; defaults are keys.
    const message =
      messages[status] ??
      (DEFAULT_MESSAGE_KEYS[status]
        ? i18n.t(DEFAULT_MESSAGE_KEYS[status])
        : undefined);
    if (message) {
      toast.error(message);
      return;
    }
  }

  // Unmatched status or non-Axios error: log it and show a generic message.
  console.error(error);
  toast.error(i18n.t("common:apiErrors.generic"));
}
