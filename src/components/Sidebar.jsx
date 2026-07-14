import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaThLarge,
  FaPenNib,
  FaInbox,
  FaRobot,
  FaBoxOpen,
  FaPlug,
  FaWallet,
  FaCreditCard,
  FaCog,
  FaYoutube,
  FaUserShield,
  FaUsers,
  FaMoneyCheckAlt,
  FaLayerGroup,
} from "react-icons/fa";

const primaryNav = [
  { to: "/dashboard", label: "Dashboard", icon: FaThLarge },
  { to: "/create-post", label: "Create Post", icon: FaPenNib },
  { to: "/inbox", label: "Inbox", icon: FaInbox },
  { to: "/automation", label: "Automation", icon: FaRobot },
  { to: "/products", label: "Products", icon: FaBoxOpen },
  { to: "/integrations", label: "Integrations", icon: FaPlug },
  { to: "/youtube", label: "YouTube Upload", icon: FaYoutube },
];

const accountNav = [
  { to: "/wallet", label: "Wallet", icon: FaWallet },
  { to: "/packages", label: "Subscription", icon: FaCreditCard },
  { to: "/settings", label: "Settings", icon: FaCog },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Admin", icon: FaUserShield },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/payments", label: "Payments", icon: FaMoneyCheckAlt },
  { to: "/admin/packages", label: "Packages", icon: FaLayerGroup },
];

function NavSection({ title, items, onNavigate }) {
  return (
    <div className="mb-2">
      {title && (
        <p className="px-6 pt-4 pb-1 text-[0.68rem] font-bold uppercase tracking-wider text-white/35">
          {title}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon className="nav-ico" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const role = (localStorage.getItem("userRole") || localStorage.getItem("role") || "").toLowerCase();
  const isAdmin = role === "admin";

  return (
    <motion.aside
      className={`app-sidebar ${open ? "open" : ""}`}
      initial={false}
    >
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black">
          S
        </div>
        <span className="text-white font-extrabold tracking-tight text-lg">
          Smart Social
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <NavSection items={primaryNav} onNavigate={onClose} />
        <NavSection title="Account" items={accountNav} onNavigate={onClose} />
        {isAdmin && (
          <NavSection title="Administration" items={adminNav} onNavigate={onClose} />
        )}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-white/40 text-xs">
        © {new Date().getFullYear()} Smart Social
      </div>
    </motion.aside>
  );
}
