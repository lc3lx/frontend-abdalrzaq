import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FaUserPlus, FaEye, FaEyeSlash, FaGift } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import { Button, Field, Badge } from "../components/ui/kit";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_BASE_URL + "/api/register", {
        email,
        username,
        password,
        referralCode: referralCode || undefined,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your social presence"
      footer={<>Already have an account? <Link to="/login" className="font-semibold" style={{ color: "var(--ss-accent)" }}>Sign in</Link></>}
    >
      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)", padding: 12 }}>
          <span className="text-sm" style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}
      <form onSubmit={handleRegister}>
        <Field label="Email address">
          <input type="email" className="ss-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </Field>
        <Field label="Username">
          <input className="ss-input" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="ss-input pr-10"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ss-text-faint)" }} aria-label="Toggle password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>
        <Field label="Referral code (optional)">
          <input className="ss-input" placeholder="Enter referral code" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
          {referralCode && <div className="mt-2"><Badge variant="success"><FaGift /> Referral applied</Badge></div>}
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          <FaUserPlus /> Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
