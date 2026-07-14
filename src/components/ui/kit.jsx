import { motion } from "framer-motion";

/* Reusable design-system primitives. Import from "components/ui/kit". */

export function Button({ variant = "primary", className = "", loading, children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`ss-btn ss-btn-${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </motion.button>
  );
}

export function Card({ className = "", pad = true, children, hover = false, ...props }) {
  return (
    <motion.div
      className={`ss-card ${pad ? "ss-card-pad" : ""} ${className}`}
      whileHover={hover ? { y: -3, boxShadow: "var(--ss-shadow)" } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, delta, accent = "var(--ss-accent)" }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: "var(--ss-text-muted)" }}>
          {label}
        </span>
        {Icon && (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--ss-accent-soft)", color: accent }}
          >
            <Icon />
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      {delta != null && (
        <div className="mt-1 text-xs font-semibold" style={{ color: "var(--ss-success)" }}>
          {delta}
        </div>
      )}
    </motion.div>
  );
}

export function Badge({ variant = "", children }) {
  return <span className={`ss-badge ${variant ? `ss-badge-${variant}` : ""}`}>{children}</span>;
}

export function Spinner({ size = 20 }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-current border-r-transparent animate-spin"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Skeleton({ className = "", style }) {
  return <div className={`ss-skeleton ${className}`} style={{ height: 16, ...style }} />;
}

export function SkeletonCard() {
  return (
    <div className="ss-card ss-card-pad">
      <Skeleton style={{ width: "40%", height: 14 }} />
      <Skeleton style={{ width: "70%", height: 24, marginTop: 12 }} />
      <Skeleton style={{ width: "100%", height: 12, marginTop: 16 }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="ss-card ss-card-pad flex flex-col items-center justify-center text-center py-14"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Icon && (
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl mb-4"
          style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}
        >
          <Icon />
        </div>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--ss-text-muted)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function Field({ label, error, children, required }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="ss-label">
          {label} {required && <span style={{ color: "var(--ss-danger)" }}>*</span>}
        </label>
      )}
      {children}
      {error && <span className="ss-error">{error}</span>}
    </div>
  );
}
