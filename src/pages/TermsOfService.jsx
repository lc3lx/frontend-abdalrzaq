import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";

const TermsOfService = () => {
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
              Terms of Service – Sushiluha
            </motion.h1>
            <motion.p
              className="text-xl text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to Sushiluha. By using our services, you agree to the
              following terms, so please read them carefully.
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
                  1. Definitions
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    <strong>Sushiluha:</strong> is the website and service that
                    provides tools for managing pages and automatic replies and
                    sending catalogs on various platforms.
                  </li>
                  <li>
                    <strong>User:</strong> is any person or entity using the
                    website's services.
                  </li>
                  <li>
                    <strong>Services:</strong> include page management,
                    automatic replies to comments, sending catalogs privately,
                    and support for connecting with platforms (Facebook,
                    Instagram, TikTok, WhatsApp, Telegram).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  2. Terms of Use
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>The user must be at least 18 years old.</li>
                  <li>
                    Services must be used only for legal and licensed purposes.
                  </li>
                  <li>
                    It is prohibited to use the platform to publish harmful,
                    offensive, illegal or fraudulent content.
                  </li>
                  <li>
                    The website reserves the right to suspend or terminate the
                    service in case of violation of the terms.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  3. Access to External Platforms
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    To provide our services, it requires linking the user's
                    accounts to platforms such as Facebook, Instagram, TikTok
                    and others.
                  </li>
                  <li>
                    The user is responsible for ensuring that they have the
                    permissions to give Sushiluha access to these accounts.
                  </li>
                  <li>
                    We do not store passwords or direct login data, and linking
                    is done through official APIs.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  4. Intellectual Property Rights
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    All content, features, and functionality of Sushiluha are
                    owned by us and are protected by copyright, trademark, and
                    other intellectual property laws.
                  </li>
                  <li>
                    You may not copy, modify, distribute, or create derivative
                    works of our service without explicit written permission.
                  </li>
                  <li>
                    User-generated content remains the property of the user, but
                    by using our services, you grant us a license to use it as
                    necessary for service provision.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  5. Limitation of Liability
                </h2>
                <ul className="space-y-3 text-white/90">
                  <li>
                    Sushiluha is provided "as is" without warranties of any
                    kind.
                  </li>
                  <li>
                    We are not liable for any damages arising from your use of
                    our services.
                  </li>
                  <li>
                    We do not guarantee uninterrupted service availability.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  6. Changes to Terms
                </h2>
                <p className="text-white/90">
                  We reserve the right to modify these terms at any time.
                  Continued use of our services after changes constitutes
                  acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  7. Contact Us
                </h2>
                <p className="text-white/90">
                  If you have any questions about these Terms of Service, please
                  contact us through our support channels.
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
