import { AxiosError } from "axios";
import { Navigate } from "react-router-dom";

export function QueryError({
  error,
  redirectOn404 = false,
}: {
  error: unknown;
  redirectOn404?: boolean;
}) {
  if (
    redirectOn404 &&
    error instanceof AxiosError &&
    error.response?.status === 404
  ) {
    return <Navigate to="/not-found" replace />;
  }
  return <div>Something went wrong. Please try again.</div>;
}
