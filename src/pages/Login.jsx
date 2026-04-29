import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
  const navigate = useNavigate();

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://www.sushiluha.com/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      const role = (response.data.role || "user").toString().toLowerCase().trim();
      localStorage.setItem("userRole", role === "admlin" ? "admin" : role);

      // Redirect based on user role (admlin = typo for admin)
      if (role === "admin" || role === "admlin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="app-bg min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-35"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, #18d5bd 0%, transparent 50%)",
            "radial-gradient(600px circle at 80% 70%, #f5b84b 0%, transparent 50%)",
            "radial-gradient(600px circle at 40% 80%, #f05776 0%, transparent 50%)",
            "radial-gradient(600px circle at 20% 30%, #18d5bd 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * windowSize.width,
                Math.random() * windowSize.width,
              ],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="premium-panel rounded-2xl p-8 lg:p-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-300 via-amber-300 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <FaSignInAlt className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-normal">
                Welcome Back
              </h1>
              <p className="text-white/80">Sign in to your Sushiluha account</p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
              >
                <p className="text-red-300 text-center">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="premium-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="premium-input pr-12"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="premium-button w-full text-lg"
              >
                <FaSignInAlt />
                Sign In
              </motion.button>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center my-8"
            >
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-white/60 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </motion.div>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-white/80 mb-4">
                Don&apos;t have an account yet?
              </p>
              <Link
                to="/register"
                className="premium-muted-button"
              >
                <FaUserPlus />
                Create Account
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
