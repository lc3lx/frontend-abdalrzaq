import { useState } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import { Button, Field } from "../components/ui/kit";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(API_BASE_URL + "/api/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      if (data.username) localStorage.setItem("username", data.username);
      const role = (data.role || "user").toString().toLowerCase().trim();
      localStorage.setItem("userRole", role === "admlin" ? "admin" : role);
      navigate(role === "admin" || role === "admlin" ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Smart Social account"
      footer={<>Don’t have an account? <Link to="/register" className="font-semibold" style={{ color: "var(--ss-accent)" }}>Create one</Link></>}
    >
      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)", padding: 12 }}>
          <span className="text-sm" style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <Field label="Email address">
          <input type="email" className="ss-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="ss-input pr-10"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ss-text-faint)" }} aria-label="Toggle password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          <FaSignInAlt /> Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
