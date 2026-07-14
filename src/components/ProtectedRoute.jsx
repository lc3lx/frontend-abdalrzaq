import { Navigate, useLocation } from "react-router-dom";

/**
 * Guards authenticated routes. Redirects to /login when no auth token is
 * present, preserving the intended destination for post-login redirect.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
