import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaCheck,
  FaCrown,
  FaShoppingCart,
  FaUsers,
  FaRocket,
  FaStar,
  FaBolt,
  FaInfinity,
  FaShieldAlt,
} from "react-icons/fa";
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Skeleton,
  EmptyState,
} from "../components/ui/kit";

function packageIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("مجاني") || n.includes("basic")) return FaUsers;
  if (n.includes("متقدم") || n.includes("pro")) return FaRocket;
  if (n.includes("مميز") || n.includes("premium")) return FaCrown;
  return FaStar;
}

const limitValue = (v) =>
  v === -1 ? <FaInfinity className="inline" /> : v == null ? "—" : v;

export default function PackagesPageNew() {
  const [packages, setPackages] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.all([fetchPackages(), fetchUserSubscription()]).finally(() => setLoading(false));
  }, []);

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get(API_BASE_URL + "/api/packages", cfg());
      setPackages(data.packages || []);
    } catch (err) {
      setError("Failed to load subscription plans.");
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const { data } = await axios.get(API_BASE_URL + "/api/packages/my-subscription", cfg());
      setUserSubscription(data.subscription);
    } catch (_) {}
  };

  const purchasePackage = async (packageId) => {
    setPurchasing(packageId);
    setNotice("");
    setError("");
    try {
      await axios.post(API_BASE_URL + "/api/packages/purchase", { packageId }, cfg());
      setNotice("Subscription activated successfully.");
      fetchUserSubscription();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase the plan.");
    } finally {
      setPurchasing(null);
    }
  };

  const isCurrent = (id) => userSubscription?.package?._id === id;
  const remainingDays = () => {
    if (!userSubscription) return 0;
    return Math.max(0, Math.ceil((new Date(userSubscription.endDate) - new Date()) / 86400000));
  };
  const expired = () => userSubscription && new Date(userSubscription.endDate) < new Date();

  if (loading) {
    return (
      <div>
        <PageHeader title="Subscription" subtitle="Choose the plan that fits your workspace" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton style={{ width: "40%" }} />
              <Skeleton style={{ width: "60%", height: 30, marginTop: 14 }} />
              <Skeleton style={{ width: "100%", marginTop: 16 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Subscription" subtitle="Choose the plan that fits your workspace" />

      {userSubscription && (
        <Card className="mb-6" hover>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}>
                <FaShieldAlt />
              </span>
              <div>
                <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>Current plan</p>
                <p className="font-bold text-lg">{userSubscription.package?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-extrabold">{remainingDays()}</p>
                <p className="text-xs" style={{ color: "var(--ss-text-muted)" }}>days left</p>
              </div>
              <Badge variant={expired() ? "danger" : "success"}>{expired() ? "Expired" : "Active"}</Badge>
            </div>
          </div>
        </Card>
      )}

      {notice && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-success)" }}>
          <span style={{ color: "var(--ss-success)" }}>{notice}</span>
        </div>
      )}
      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}

      {packages.length === 0 ? (
        <EmptyState icon={FaCrown} title="No plans available" description="Subscription plans will appear here once configured." />
      ) : (
        <motion.div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {packages.map((pkg) => {
            const Icon = packageIcon(pkg.name);
            const current = isCurrent(pkg._id);
            const popular = (pkg.name || "").includes("متقدم") || (pkg.name || "").toLowerCase().includes("pro");
            return (
              <motion.div
                key={pkg._id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="ss-card ss-card-pad relative flex flex-col"
                style={{ borderColor: current ? "var(--ss-success)" : popular ? "var(--ss-accent)" : "var(--ss-border)" }}
                whileHover={{ y: -4 }}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">Most popular</Badge>
                  </span>
                )}
                {current && (
                  <span className="absolute -top-3 right-4">
                    <Badge variant="success">Current</Badge>
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg,var(--ss-accent),var(--ss-accent-700))" }}>
                    <Icon />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{pkg.description}</p>
                  </div>
                </div>

                <div className="my-5">
                  <span className="text-4xl font-black">{pkg.price}</span>
                  <span className="text-sm" style={{ color: "var(--ss-text-muted)" }}> / {pkg.duration} {pkg.duration === 1 ? "day" : "days"}</span>
                </div>

                <ul className="space-y-2 mb-4 flex-1">
                  {(pkg.features || []).slice(0, 6).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <FaCheck style={{ color: "var(--ss-success)" }} className="flex-none" />
                      <span>{typeof f === "object" ? f.nameAr || f.name : String(f)}</span>
                    </li>
                  ))}
                  {(pkg.services || []).slice(0, 6).map((s, i) => (
                    <li key={`s${i}`} className="flex items-center gap-2 text-sm">
                      <FaBolt style={{ color: "var(--ss-accent)" }} className="flex-none" />
                      <span className="capitalize">{typeof s === "object" ? s.nameAr || s.name || s.type : String(s)}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-3 mb-4 space-y-1.5 text-sm" style={{ borderColor: "var(--ss-border)" }}>
                  <div className="flex justify-between"><span style={{ color: "var(--ss-text-muted)" }}>Accounts</span><span className="font-semibold">{limitValue(pkg.maxAccounts)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ss-text-muted)" }}>Posts / day</span><span className="font-semibold">{limitValue(pkg.maxPostsPerDay)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "var(--ss-text-muted)" }}>Products</span><span className="font-semibold">{limitValue(pkg.maxProducts)}</span></div>
                </div>

                <Button
                  className="w-full"
                  variant={current ? "secondary" : "primary"}
                  disabled={current}
                  loading={purchasing === pkg._id}
                  onClick={() => purchasePackage(pkg._id)}
                >
                  {current ? <><FaCheck /> Current plan</> : <><FaShoppingCart /> Subscribe</>}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
