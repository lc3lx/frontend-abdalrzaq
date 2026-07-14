import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaCheckCircle,
  FaPlug,
} from "react-icons/fa";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramSetup from "../components/Telegram/TelegramSetup";
import WhatsAppQuickSetup from "../components/WhatsApp/WhatsAppQuickSetup";
import TikTokQuickSetup from "../components/TikTok/TikTokQuickSetup";
import YouTubeQuickSetup from "../components/YouTube/YouTubeQuickSetup";
import { PageHeader, Card, Button, Badge, StatCard } from "../components/ui/kit";

const PLATFORMS = [
  { name: "Facebook", icon: FaFacebook, color: "#1877f2", serviceType: "facebook", mode: "oauth", desc: "Publish, comments & Messenger auto-reply" },
  { name: "Instagram", icon: FaInstagram, color: "#e1306c", serviceType: "instagram", mode: "oauth", desc: "Feed, Reels, carousels & DM automation" },
  { name: "TikTok", icon: FaTiktok, color: "#010101", serviceType: "tiktok", mode: "tiktok", desc: "Video & photo publishing" },
  { name: "WhatsApp", icon: FaWhatsapp, color: "#25d366", serviceType: "whatsapp", mode: "whatsapp", desc: "Cloud API messaging & auto-reply" },
  { name: "Telegram", icon: FaTelegram, color: "#0088cc", serviceType: "telegram", mode: "telegram", desc: "Bot messaging & automation" },
  { name: "Twitter", icon: FaTwitter, color: "#1da1f2", serviceType: "twitter", mode: "oauth", desc: "Tweets & media" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0077b5", serviceType: "linkedin", mode: "oauth", desc: "Professional posts" },
  { name: "YouTube", icon: FaYoutube, color: "#ff0000", serviceType: "youtube", mode: "youtube", desc: "Video uploads" },
];

export default function IntegrationsPage() {
  const { connectedAccounts, connectAccount, disconnectAccount, isLoading } = useSocialAccounts();
  const [setup, setSetup] = useState(null); // 'telegram' | 'whatsapp' | 'tiktok' | 'youtube'
  const [busy, setBusy] = useState("");

  const isConnected = (name) => connectedAccounts.some((a) => a.platform === name);
  const accountFor = (name) => connectedAccounts.find((a) => a.platform === name);

  const handleConnect = async (p) => {
    if (p.mode === "oauth") {
      setBusy(p.name);
      try {
        await connectAccount(p.name);
      } catch (_) {
        /* handled in hook */
      } finally {
        setBusy("");
      }
    } else {
      setSetup(p.mode);
    }
  };

  const handleDisconnect = async (name) => {
    if (!window.confirm(`Disconnect ${name}?`)) return;
    setBusy(name);
    try {
      await disconnectAccount(name);
    } catch (_) {}
    finally {
      setBusy("");
    }
  };

  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect your social and messaging accounts" />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-6">
        <StatCard icon={FaPlug} label="Connected" value={connectedAccounts.length} />
        <StatCard icon={FaCheckCircle} label="Available" value={PLATFORMS.length} />
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          const connected = isConnected(p.name);
          return (
            <motion.div
              key={p.name}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="ss-card ss-card-pad"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-xl text-white"
                  style={{ background: p.color }}
                >
                  <Icon />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{p.name}</h3>
                    {connected && <Badge variant="success"><FaCheckCircle /> Connected</Badge>}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "var(--ss-text-muted)" }}>
                    {connected ? accountFor(p.name)?.displayName || p.desc : p.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {connected ? (
                  <Button
                    variant="secondary"
                    className="w-full !text-red-500"
                    loading={busy === p.name}
                    onClick={() => handleDisconnect(p.name)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <SubscriptionCheck serviceType={p.serviceType}>
                    <Button
                      className="w-full"
                      loading={busy === p.name && isLoading}
                      onClick={() => handleConnect(p)}
                    >
                      <FaPlug /> Connect
                    </Button>
                  </SubscriptionCheck>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {setup === "telegram" && (
          <TelegramSetup onClose={() => setSetup(null)} onSuccess={() => { setSetup(null); window.location.reload(); }} />
        )}
        {setup === "whatsapp" && (
          <WhatsAppQuickSetup onClose={() => setSetup(null)} onSuccess={() => { setSetup(null); window.location.reload(); }} />
        )}
        {setup === "tiktok" && (
          <TikTokQuickSetup onClose={() => setSetup(null)} onSuccess={() => { setSetup(null); window.location.reload(); }} />
        )}
        {setup === "youtube" && (
          <YouTubeQuickSetup onClose={() => setSetup(null)} onSuccess={() => { setSetup(null); window.location.reload(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
