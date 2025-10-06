import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)",
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl lg:text-6xl font-black text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Privacy Policy – Sushiluha
            </motion.h1>
            <motion.p
              className="text-xl text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to Sushiluha. We are committed to protecting your privacy
              and ensuring your data is used safely and responsibly. This policy
              explains how we collect, use, and share your information when you
              use our services.
            </motion.p>
          </div>

          {/* Content */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="space-y-8 text-white">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  1. Information We Collect
                </h2>
                <p className="text-white/90 mb-4">
                  We may collect the following types of information:
                </p>
                <ul className="space-y-3 text-white/90">
                  <li>
                    <strong>Account information:</strong> such as name, email,
                    or login information to platforms you connect to our
                    services (Facebook, Instagram, TikTok, WhatsApp, Telegram).
                  </li>
                  <li>
                    <strong>Page and platform data:</strong> such as comments,
                    messages, audience data, permissions for pages.
                  </li>
                  <li>
                    <strong>Usage data:</strong> such as activity logs, time
                    spent in the platform, device and browser type.
                  </li>
                  <li>
                    <strong>Content of catalogs and messages:</strong> sent
                    through our services.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  2. How We Use Information
                </h2>
                <p className="text-white/90 mb-4">We use your data to:</p>
                <ul className="space-y-3 text-white/90">
                  <li>Provide automatic reply services and send catalogs.</li>
                  <li>
                    Manage content and interact on your behalf on your
                    platforms.
                  </li>
                  <li>Improve our services and develop new features.</li>
                  <li>Provide technical support when needed.</li>
                  <li>Comply with legal requirements if necessary.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  3. Information Sharing
                </h2>
                <p className="text-white/90 mb-4">
                  We do not sell or share your personal information with third
                  parties, except:
                </p>
                <ul className="space-y-3 text-white/90">
                  <li>
                    Trusted service providers who help us provide our services
                    (such as messaging services, APIs for social platforms).
                  </li>
                  <li>
                    When required by law or to protect our rights and safety.
                  </li>
                  <li>With your explicit consent for specific purposes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  4. Data Security
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    We implement appropriate technical and organizational
                    measures to protect your personal information.
                  </li>
                  <li>
                    However, no method of transmission over the internet is 100%
                    secure, and we cannot guarantee absolute security.
                  </li>
                  <li>
                    You are responsible for keeping your account credentials
                    secure.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  5. Data Retention
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    We retain your personal information only as long as
                    necessary for the purposes outlined in this policy.
                  </li>
                  <li>
                    You may request deletion of your data at any time, subject
                    to legal and legitimate business requirements.
                  </li>
                  <li>
                    Some data may be retained in backup systems for a limited
                    period.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  6. Your Rights
                </h2>
                <p className="text-white/90 mb-4">You have the right to:</p>
                <ul className="space-y-3 text-white/90">
                  <li>Access the personal information we hold about you.</li>
                  <li>Correct inaccurate or incomplete information.</li>
                  <li>Request deletion of your personal information.</li>
                  <li>
                    Object to or restrict certain processing of your data.
                  </li>
                  <li>Data portability for your information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  7. Cookies and Tracking
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    We use cookies and similar technologies to enhance your
                    experience and analyze usage patterns.
                  </li>
                  <li>
                    You can control cookie settings through your browser
                    preferences.
                  </li>
                  <li>
                    Third-party services integrated with our platform may also
                    use cookies according to their own policies.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  8. Changes to This Policy
                </h2>
                <p className="text-white/90">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes through our platform or by
                  email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  9. Contact Us
                </h2>
                <p className="text-white/90">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us through our support
                  channels.
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
