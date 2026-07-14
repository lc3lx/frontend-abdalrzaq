import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaMoon, FaSun, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Sidebar from "../Sidebar";
import { useTheme } from "../../contexts/ThemeContext";

const TITLES = {
  "/dashboard": "Dashboard",
  "/create-post": "Create Post",
  "/inbox": "Inbox",
  "/automation": "Automation",
  "/products": "Products",
  "/integrations": "Integrations",
  "/youtube": "YouTube Upload",
  "/wallet": "Wallet",
  "/packages": "Subscription",
  "/settings": "Settings",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/users": "Users",
  "/admin/payments": "Payments",
  "/admin/packages": "Packages",
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // Close the mobile drawer on route change.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const title =
    TITLES[location.pathname] ||
    Object.entries(TITLES).find(([p]) => location.pathname.startsWith(p))?.[1] ||
    "Smart Social";

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("userEmail") ||
    "Account";

  const logout = () => {
    ["token", "role", "userRole", "username", "userEmail"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="app-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="menu-toggle ss-btn ss-btn-ghost !px-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars />
          </button>

          <h1 className="text-lg font-bold tracking-tight">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="ss-btn ss-btn-ghost !px-2.5"
              aria-label="Toggle theme"
              onClick={toggleDarkMode}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: "var(--ss-border)" }}>
              <FaUserCircle className="text-2xl" style={{ color: "var(--ss-text-faint)" }} />
              <span className="hidden sm:block text-sm font-semibold">{username}</span>
              <button
                type="button"
                className="ss-btn ss-btn-ghost !px-2.5"
                aria-label="Log out"
                title="Log out"
                onClick={logout}
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </header>

        <motion.main
          key={location.pathname}
          className="app-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
