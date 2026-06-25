import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // don't retry 4xx — the answer won't change
        if (
          error instanceof AxiosError &&
          error.response?.status &&
          error.response.status < 500
        ) {
          return false;
        }
        // retry server/network errors up to 2 times
        return failureCount < 2;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
