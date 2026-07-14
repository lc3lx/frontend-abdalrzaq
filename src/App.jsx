import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import LandingPage from "./pages/landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// App shell + guards
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Authenticated feature pages
import DashboardHome from "./pages/DashboardHome";
import CreatePostPage from "./pages/CreatePostPage";
import InboxPage from "./pages/InboxPage";
import AutoReplyPage from "./pages/AutoReplyPage";
import CatalogPage from "./pages/CatalogPage";
import IntegrationsPage from "./pages/IntegrationsPageNew";
import YouTubeUploadPage from "./pages/YouTubeUploadPage";
import WalletPage from "./pages/WalletPage";
import PackagesPage from "./pages/PackagesPageNew";
import SettingsPage from "./pages/SettingsPage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminPackages from "./pages/AdminPackages";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Authenticated app — single layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/automation" element={<AutoReplyPage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/youtube" element={<YouTubeUploadPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin — same layout, admin guard */}
          <Route
            element={
              <AdminRoute>
                <AppLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
