import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaWallet,
  FaClock,
  FaShieldAlt,
  FaUserPlus,
  FaDollarSign,
  FaMoneyCheckAlt,
  FaLayerGroup,
} from "react-icons/fa";
import axios from "axios";
import { PageHeader, StatCard, Card, Button, SkeletonCard } from "../components/ui/kit";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(API_BASE_URL + "/api/admin/dashboard/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setStats(data);
      } catch (err) {
        if (err.response?.status === 403) navigate("/dashboard");
        else setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const cards = [
    { label: "Total Users", value: stats?.users?.total || 0, icon: FaUsers },
    { label: "New Users (7d)", value: stats?.users?.recentRegistrations || 0, icon: FaUserPlus },
    { label: "Total Balance", value: `$${stats?.wallets?.totalBalance || "0.00"}`, icon: FaDollarSign },
    { label: "Pending Recharges", value: stats?.rechargeRequests?.pending || 0, icon: FaClock },
    { label: "Pending Amount", value: `$${stats?.rechargeRequests?.pendingAmount || "0.00"}`, icon: FaWallet },
    { label: "Banned Users", value: stats?.users?.banned || 0, icon: FaShieldAlt },
  ];

  const quick = [
    { to: "/admin/users", label: "Manage users", sub: `${stats?.users?.total || 0} total`, icon: FaUsers },
    { to: "/admin/payments", label: "Payments", sub: `${stats?.rechargeRequests?.pending || 0} pending`, icon: FaMoneyCheckAlt },
    { to: "/admin/packages", label: "Packages", sub: "Plans & pricing", icon: FaLayerGroup },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System overview and management" />

      {error && (
        <Card className="mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((c) => <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />)}
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <motion.button
              key={q.to}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              onClick={() => navigate(q.to)}
              className="ss-card ss-card-pad flex items-center gap-3 text-left"
              whileHover={{ y: -3 }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}>
                <Icon />
              </span>
              <div>
                <p className="font-bold">{q.label}</p>
                <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{q.sub}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
