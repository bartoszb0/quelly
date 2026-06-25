import { isAxiosError } from "axios";
import { toast } from "sonner";

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  429: "Too many requests. Please try again later.",
  500: "Something went wrong on our end. Please try again later.",
};

export function toastApiError(
  error: unknown,
  messages: Record<number, string> = {},
) {
  if (isAxiosError(error)) {
    // No response means the request never completed (offline, CORS, timeout).
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return;
    }

    const status = error.response.status;
    const message = messages[status] ?? DEFAULT_MESSAGES[status];
    if (message) {
      toast.error(message);
      return;
    }
  }

  // Unmatched status or non-Axios error: log it and show a generic message.
  console.error(error);
  toast.error("Something went wrong. Please try again.");
}
