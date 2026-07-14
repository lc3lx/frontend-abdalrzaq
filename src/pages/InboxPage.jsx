import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSync,
  FaInbox,
  FaEnvelope,
  FaEnvelopeOpen,
  FaPaperPlane,
  FaArchive,
  FaTimes,
} from "react-icons/fa";
import { useMessages } from "../hooks/useMessages";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  Badge,
  Skeleton,
  EmptyState,
  Field,
} from "../components/ui/kit";

const PLATFORMS = ["Facebook", "Instagram", "WhatsApp", "Telegram", "TikTok", "Twitter", "LinkedIn"];

function timeAgo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function InboxPage() {
  const {
    messages,
    stats,
    isLoading,
    pagination,
    fetchMessages,
    markAsRead,
    archiveMessage,
    syncMessages,
    replyToMessage,
  } = useMessages();

  const [platform, setPlatform] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const filters = useMemo(() => {
    const f = { page };
    if (platform) f.platform = platform;
    if (unreadOnly) f.isRead = "false";
    return f;
  }, [platform, unreadOnly, page]);

  useEffect(() => {
    fetchMessages(filters).catch(() => setError("Failed to load messages"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const openMessage = async (msg) => {
    setSelected(msg);
    setReply("");
    if (!msg.isRead) {
      try {
        await markAsRead(msg._id);
      } catch (_) {}
    }
  };

  const onSync = async () => {
    setSyncing(true);
    setError("");
    try {
      await syncMessages();
    } catch (_) {
      setError("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const onReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    setError("");
    try {
      await replyToMessage(selected._id, reply.trim());
      setReply("");
    } catch (e) {
      setError(e.response?.data?.error || "Could not send reply.");
    } finally {
      setSending(false);
    }
  };

  const onArchive = async (id) => {
    try {
      await archiveMessage(id);
      if (selected?._id === id) setSelected(null);
    } catch (_) {}
  };

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Conversations across all your connected platforms"
        actions={
          <Button variant="secondary" onClick={onSync} loading={syncing}>
            <FaSync /> Sync
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-5">
        <StatCard icon={FaEnvelope} label="Total" value={stats.total ?? 0} />
        <StatCard icon={FaEnvelopeOpen} label="Unread" value={stats.unread ?? 0} />
        <StatCard icon={FaInbox} label="Platforms" value={Object.keys(stats.byPlatform || {}).length} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          className="ss-select !w-auto"
          value={platform}
          onChange={(e) => {
            setPage(1);
            setPlatform(e.target.value);
          }}
        >
          <option value="">All platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <Button
          variant={unreadOnly ? "primary" : "secondary"}
          onClick={() => {
            setPage(1);
            setUnreadOnly((v) => !v);
          }}
        >
          Unread only
        </Button>
      </div>

      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <Skeleton style={{ width: "45%" }} />
                <Skeleton style={{ width: "85%", marginTop: 10 }} />
              </Card>
            ))
          ) : messages.length === 0 ? (
            <EmptyState
              icon={FaInbox}
              title="No messages"
              description="When customers message your connected accounts, they’ll appear here. Try syncing."
              action={<Button onClick={onSync} loading={syncing}><FaSync /> Sync now</Button>}
            />
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
              {messages.map((msg) => (
                <motion.button
                  key={msg._id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => openMessage(msg)}
                  className="ss-card ss-card-pad w-full text-left mb-3 block"
                  style={{
                    borderColor: selected?._id === msg._id ? "var(--ss-accent)" : "var(--ss-border)",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.isRead && (
                        <span className="h-2 w-2 rounded-full flex-none" style={{ background: "var(--ss-accent)" }} />
                      )}
                      <span className="font-semibold truncate">{msg.senderName || msg.senderId}</span>
                      <Badge variant="accent">{msg.platform}</Badge>
                    </div>
                    <span className="text-xs flex-none" style={{ color: "var(--ss-text-faint)" }}>
                      {timeAgo(msg.receivedAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm line-clamp-2" style={{ color: "var(--ss-text-muted)" }}>
                    {msg.content || "(no text)"}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm" style={{ color: "var(--ss-text-muted)" }}>
                Page {pagination.current} of {pagination.pages}
              </span>
              <Button variant="ghost" disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                <ConversationPanel
                  message={selected}
                  reply={reply}
                  setReply={setReply}
                  onReply={onReply}
                  onArchive={() => onArchive(selected._id)}
                  sending={sending}
                />
              </motion.div>
            ) : (
              <EmptyState icon={FaEnvelopeOpen} title="Select a conversation" description="Choose a message on the left to read and reply." />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
            <motion.div
              className="relative w-full"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <ConversationPanel
                message={selected}
                reply={reply}
                setReply={setReply}
                onReply={onReply}
                onArchive={() => onArchive(selected._id)}
                sending={sending}
                onClose={() => setSelected(null)}
                rounded
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConversationPanel({ message, reply, setReply, onReply, onArchive, sending, onClose, rounded }) {
  return (
    <div className={`ss-card ss-card-pad ${rounded ? "rounded-b-none" : ""}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold truncate">{message.senderName || message.senderId}</span>
          <Badge variant="accent">{message.platform}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onArchive} title="Archive" className="!px-2.5">
            <FaArchive />
          </Button>
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="!px-2.5">
              <FaTimes />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: "var(--ss-surface-2)" }}>
        {message.content || "(no text)"}
      </div>

      <Field label="Reply">
        <textarea
          className="ss-textarea"
          rows={3}
          placeholder="Write a reply…"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
      </Field>
      <div className="flex justify-end">
        <Button onClick={onReply} loading={sending} disabled={!reply.trim()}>
          <FaPaperPlane /> Send reply
        </Button>
      </div>
    </div>
  );
}
