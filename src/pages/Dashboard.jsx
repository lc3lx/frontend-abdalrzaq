import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaPlus,
  FaPlug,
  FaChartBar,
  FaInbox,
  FaRobot,
  FaWallet,
  FaCrown,
  FaShoppingBag,
} from "react-icons/fa";
import IntegrationsPage from "./IntegrationsPage";
import CreatePostPage from "./CreatePostPage";
import SettingsPage from "./SettingsPage";
import InboxPage from "./InboxPage";
import AutoReplyPage from "./AutoReplyPage";
import WalletPage from "./WalletPage";
import PublishedPosts from "../components/Dashboard/PublishedPosts";
import SubscriptionStatus from "../components/SubscriptionStatus";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("generate");

  // Redirect admin users to admin dashboard
  useEffect(() => {
    console.log("Dashboard - User role:", user.role);
    if (user.role === "admin") {
      console.log(
        "Redirecting admin to admin dashboard from regular dashboard"
      );
      navigate("/admin/dashboard");
    }
  }, [user.role, navigate]);

  const sections = [
    { id: "integrations", label: "Integrations", icon: FaPlug },
    { id: "generate", label: "Create Post", icon: FaPlus },
    { id: "inbox", label: "Inbox", icon: FaInbox },
    { id: "auto-reply", label: "Auto Reply", icon: FaRobot },
    { id: "published", label: "Published Posts", icon: FaChartBar },
    { id: "wallet", label: "Wallet", icon: FaWallet },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "integrations":
        return <IntegrationsPage />;
      case "generate":
        return <CreatePostPage />;
      case "inbox":
        return <InboxPage />;
      case "auto-reply":
        return <AutoReplyPage />;
      case "published":
        return <PublishedPosts />;
      case "wallet":
        return <WalletPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <CreatePostPage />;
    }
  };

  return (
    <div className="font-sans min-h-screen flex bg-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">SmartSocial</h1>
          </div>
          <nav className="mt-4">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full text-left p-4 flex items-center ${
                  activeSection === id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="mr-2" /> {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Welcome Header */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6 border-t-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                Welcome back, {user.username}!
              </h1>
              <p className="text-gray-600">
                Create and manage your social media posts easily.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/packages")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaShoppingBag className="text-lg" />
                باقات الخدمات
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaCrown className="text-lg" />
                  لوحة الإدارة
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="mb-6">
          <SubscriptionStatus />
        </div>

        {/* Active Section Content */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Dashboard;
