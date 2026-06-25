import { AxiosError } from "axios";
import { Navigate } from "react-router-dom";

export function QueryError({ error }: { error: unknown }) {
  if (error instanceof AxiosError && error.response?.status === 404) {
    return <Navigate to="/not-found" replace />;
  }
  return <div>Something went wrong. Please try again.</div>;
}
