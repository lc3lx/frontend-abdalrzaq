import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/** Centered auth shell used by Login and Register. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "radial-gradient(1000px circle at 15% 15%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(900px circle at 85% 85%, rgba(20,184,166,0.16), transparent 45%), var(--ss-bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black">S</span>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: "var(--ss-text)" }}>Smart Social</span>
        </Link>

        <div className="ss-card ss-card-pad" style={{ padding: 28 }}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm" style={{ color: "var(--ss-text-muted)" }}>{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="text-center mt-5 text-sm" style={{ color: "var(--ss-text-muted)" }}>{footer}</div>}
      </motion.div>
    </div>
  );
}
