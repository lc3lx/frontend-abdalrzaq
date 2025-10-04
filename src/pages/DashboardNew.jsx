import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";

// Import existing pages
import IntegrationsPage from "./IntegrationsPage";
import CreatePostPage from "./CreatePostPage";
import SettingsPage from "./SettingsPage";
import InboxPage from "./InboxPage";
import AutoReplyPage from "./AutoReplyPage";
import WalletPage from "./WalletPage";
import PublishedPosts from "../components/Dashboard/PublishedPosts";
import SubscriptionStatus from "../components/SubscriptionStatus";

// Import new components
import AnimatedCard from "../components/ui/AnimatedCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user.role, navigate]);

  const sections = [
    {
      id: "overview",
      label: "نظرة عامة",
      icon: FaChartBar,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "integrations",
      label: "ربط المنصات",
      icon: FaPlug,
      color: "from-green-500 to-green-600",
    },
    {
      id: "generate",
      label: "إنشاء منشور",
      icon: FaPlus,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "inbox",
      label: "صندوق الرسائل",
      icon: FaInbox,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "auto-reply",
      label: "الرد التلقائي",
      icon: FaRobot,
      color: "from-red-500 to-red-600",
    },
    {
      id: "published",
      label: "المنشورات",
      icon: FaCalendarAlt,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "wallet",
      label: "المحفظة",
      icon: FaWallet,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: FaCog,
      color: "from-gray-500 to-gray-600",
    },
  ];

  const overviewStats = [
    {
      label: "إجمالي المنشورات",
      value: statsLoading ? "..." : stats.totalPosts.toString(),
      icon: FaPlus,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "المنصات المربوطة",
      value: statsLoading ? "..." : stats.connectedAccounts.toString(),
      icon: FaPlug,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "الرسائل الجديدة",
      value: statsLoading ? "..." : stats.unreadMessages.toString(),
      icon: FaInbox,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "الردود التلقائية",
      value: statsLoading ? "..." : stats.autoRepliesCount.toString(),
      icon: FaRobot,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  const OverviewSection = () => (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-glow-white relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
        />

        <div className="relative z-10">
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            مرحباً، {user.username}! 👋
          </motion.h1>
          <motion.p
            className="text-blue-100 text-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            إدارة مواقع التواصل الاجتماعي بسهولة وفعالية
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <AnimatedCard
            key={stat.label}
            delay={index * 0.1}
            variant="glass"
            className="p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <motion.p
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </motion.p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Error Message */}
      {statsError && (
        <AnimatedCard className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm">
            خطأ في تحميل الإحصائيات: {statsError}
          </p>
        </AnimatedCard>
      )}

      {/* Recent Activity */}
      <AnimatedCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          النشاط الأخير (آخر 7 أيام)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600">منشورات جديدة</p>
              <p className="text-2xl font-bold text-blue-600">
                {statsLoading ? "..." : stats.recentActivity.posts}
              </p>
            </div>
            <FaPlus className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600">رسائل جديدة</p>
              <p className="text-2xl font-bold text-green-600">
                {statsLoading ? "..." : stats.recentActivity.messages}
              </p>
            </div>
            <FaInbox className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedButton
            variant="primary"
            icon={FaPlus}
            onClick={() => setActiveSection("generate")}
            className="justify-center py-4"
          >
            إنشاء منشور جديد
          </AnimatedButton>
          <AnimatedButton
            variant="success"
            icon={FaPlug}
            onClick={() => setActiveSection("integrations")}
            className="justify-center py-4"
          >
            ربط منصة جديدة
          </AnimatedButton>
          <AnimatedButton
            variant="social"
            icon={FaRobot}
            onClick={() => setActiveSection("auto-reply")}
            className="justify-center py-4"
          >
            إعداد رد تلقائي
          </AnimatedButton>
        </div>
      </AnimatedCard>

      {/* Subscription Status */}
      <SubscriptionStatus />
    </motion.div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
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
        return <OverviewSection />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-blue-500/5 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          variants={sidebarVariants}
          animate={sidebarCollapsed ? "collapsed" : "expanded"}
          className="bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-xl relative z-10"
        >
          <div className="p-6">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              animate={{
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaCrown className="w-5 h-5 text-glow-white" />
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.h1
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Smart Social
                  </motion.h1>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${
                      activeSection === section.id
                        ? "bg-gradient-to-r " +
                          section.color +
                          " text-glow-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {section.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChartBar className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-8 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sections.find((s) => s.id === activeSection)?.label ||
                    "نظرة عامة"}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Dark Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {darkMode ? (
                    <FaSun className="w-5 h-5" />
                  ) : (
                    <FaMoon className="w-5 h-5" />
                  )}
                </motion.button>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FaBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <main className="flex-1 p-8 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}>
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
