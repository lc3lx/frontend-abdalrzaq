import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlug,
  FaPaperPlane,
  FaEnvelope,
  FaRobot,
  FaPenNib,
  FaInbox,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useDashboardStats } from "../hooks/useDashboardStats";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  SkeletonCard,
  Badge,
} from "../components/ui/kit";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const quickActions = [
  { to: "/create-post", label: "Create a post", icon: FaPenNib },
  { to: "/inbox", label: "Open inbox", icon: FaInbox },
  { to: "/automation", label: "Build automation", icon: FaRobot },
  { to: "/products", label: "Manage products", icon: FaBoxOpen },
];

export default function DashboardHome() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

  const cards = [
    { label: "Connected Accounts", value: stats.connectedAccounts, icon: FaPlug },
    { label: "Total Posts", value: stats.totalPosts, icon: FaPaperPlane },
    {
      label: "Messages",
      value: stats.totalMessages,
      icon: FaEnvelope,
      delta: stats.unreadMessages ? `${stats.unreadMessages} unread` : null,
    },
    { label: "Automation Flows", value: stats.totalFlows, icon: FaRobot },
  ];

  const platforms = Object.entries(stats.platformBreakdown || {});

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your workspace activity"
        actions={
          <Link to="/create-post">
            <Button>
              <FaPenNib /> New Post
            </Button>
          </Link>
        }
      />

      {error ? (
        <Card className="flex items-center gap-4">
          <FaExclamationTriangle style={{ color: "var(--ss-danger)" }} className="text-xl" />
          <div className="flex-1">
            <p className="font-semibold">Couldn’t load your stats</p>
            <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{error}</p>
          </div>
          <Button variant="secondary" onClick={refetch}>Retry</Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : cards.map((c) => (
                  <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value ?? 0} delta={c.delta} />
                ))}
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-6">
            <Card className="lg:col-span-2">
              <h3 className="text-base font-bold mb-4">Quick actions</h3>
              <motion.div
                className="grid gap-3 grid-cols-1 sm:grid-cols-2"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <motion.div key={a.to} variants={item}>
                      <Link
                        to={a.to}
                        className="flex items-center gap-3 rounded-xl border p-4 transition-colors"
                        style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}
                        >
                          <Icon />
                        </span>
                        <span className="font-semibold">{a.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Card>

            <Card>
              <h3 className="text-base font-bold mb-4">Platform breakdown</h3>
              {isLoading ? (
                <SkeletonCard />
              ) : platforms.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>
                  No connected platforms yet.{" "}
                  <Link to="/integrations" className="font-semibold" style={{ color: "var(--ss-accent)" }}>
                    Connect one →
                  </Link>
                </p>
              ) : (
                <ul className="space-y-2">
                  {platforms.map(([name, count]) => (
                    <li key={name} className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      <Badge variant="accent">{count}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
