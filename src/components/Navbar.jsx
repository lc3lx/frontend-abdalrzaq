import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaFileContract,
  FaShieldAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: FaHome },
    {
      name: "Terms of Service",
      path: "/terms-of-service",
      icon: FaFileContract,
    },
    { name: "Privacy Policy", path: "/privacy-policy", icon: FaShieldAlt },
    { name: "Login", path: "/login", icon: FaSignInAlt },
    { name: "Register", path: "/register", icon: FaUserPlus },
  ];

  const isDarkBackground =
    location.pathname === "/" ||
    location.pathname === "/terms-of-service" ||
    location.pathname === "/privacy-policy";

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isDarkBackground
            ? "bg-white/10 backdrop-blur-xl border-b border-white/20"
            : "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className={`text-3xl font-black ${
                  isDarkBackground
                    ? "text-white"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                } hover:opacity-80 transition-opacity duration-300`}
              >
                Sushiluha
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link
                      to={item.path}
                      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        isDarkBackground
                          ? isActive
                            ? "text-white bg-white/20"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                          : isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="text-sm" />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                            isDarkBackground ? "bg-white" : "bg-blue-600"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkBackground
                  ? "text-white hover:bg-white/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] ${
                isDarkBackground
                  ? "bg-slate-900/95 backdrop-blur-xl border-l border-white/20"
                  : "bg-white shadow-2xl"
              } z-50 md:hidden`}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${
                      isDarkBackground
                        ? "text-white hover:bg-white/20"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaTimes className="text-xl" />
                  </motion.button>
                </div>

                {/* Mobile Nav Items */}
                <div className="space-y-4">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                            isDarkBackground
                              ? isActive
                                ? "text-white bg-white/20"
                                : "text-white/80 hover:text-white hover:bg-white/10"
                              : isActive
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="text-lg" />
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Logo */}
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div
                    className={`text-center ${
                      isDarkBackground ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    <p className="text-sm">© 2025 Sushiluha</p>
                    <p className="text-xs mt-1">All rights reserved</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
