import { Navigate, useLocation } from "react-router-dom";
import { useMeQuery } from "../store/api/authApi.js";

export default function RequireAuth({ children }) {
  const { data, isLoading, isError } = useMeQuery();
  const location = useLocation();

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
