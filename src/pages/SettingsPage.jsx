import { useState } from "react";
import { FaUser, FaKey, FaSave, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import { PageHeader, Card, Button, Field } from "../components/ui/kit";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updateData = {};
    if (newUsername) updateData.username = newUsername;
    if (newPassword) updateData.password = newPassword;
    if (Object.keys(updateData).length === 0) {
      setError("No changes to update.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile(updateData);
      setNewUsername("");
      setNewPassword("");
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <FaUser style={{ color: "var(--ss-accent)" }} />
          <h3 className="font-bold">Personal information</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "var(--ss-surface-2)" }}>
            <p className="text-xs" style={{ color: "var(--ss-text-muted)" }}>Username</p>
            <p className="font-semibold">{user.username || "—"}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--ss-surface-2)" }}>
            <p className="text-xs" style={{ color: "var(--ss-text-muted)" }}>Email</p>
            <p className="font-semibold break-all">{user.email || "—"}</p>
          </div>
        </div>
      </Card>

      <Card className="mb-5">
        <form onSubmit={handleUpdateProfile}>
          <div className="flex items-center gap-2 mb-4">
            <FaKey style={{ color: "var(--ss-accent)" }} />
            <h3 className="font-bold">Update profile</h3>
          </div>

          <Field label="New username">
            <input
              className="ss-input"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              autoComplete="username"
            />
          </Field>

          <Field label="New password" error={error && newPassword ? error : ""}>
            <input
              type="password"
              className={`ss-input ${error && newPassword ? "has-error" : ""}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Field>

          {error && !newPassword && <div className="ss-error mb-3">{error}</div>}
          {success && (
            <div className="mb-3 text-sm font-medium" style={{ color: "var(--ss-success)" }}>
              {success}
            </div>
          )}

          <Button type="submit" className="w-full" loading={saving}>
            <FaSave /> Update profile
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Appearance</h3>
            <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>Toggle light or dark theme</p>
          </div>
          <Button variant="secondary" onClick={toggleDarkMode}>
            {darkMode ? <><FaSun /> Light</> : <><FaMoon /> Dark</>}
          </Button>
        </div>
      </Card>
    </div>
  );
}
