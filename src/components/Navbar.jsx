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

  const isDarkBackground = true;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#07110f]/78 shadow-2xl shadow-black/20 backdrop-blur-2xl"
      >
        <div className="container mx-auto px-5 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-white transition-opacity duration-300 hover:opacity-90"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 via-amber-300 to-rose-400 text-lg font-black text-slate-950 shadow-glow">
                  S
                </span>
                <span className="font-display text-2xl font-black tracking-normal">
                  Sushiluha
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-xl md:flex">
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
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-slate-950 shadow-lg"
                          : "text-white/72 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="text-sm" />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-teal-300 to-amber-300"
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
              className="rounded-xl border border-white/10 bg-white/[0.08] p-2 text-white transition-colors duration-300 hover:bg-white/[0.14] md:hidden"
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
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] border-l border-white/10 bg-[#07110f]/95 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/[0.08] p-2 text-white hover:bg-white/[0.14]"
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
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-white text-slate-950"
                              : "text-white/75 hover:bg-white/10 hover:text-white"
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
                  className="mt-8 border-t border-white/10 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div
                    className="text-center text-white/55"
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
