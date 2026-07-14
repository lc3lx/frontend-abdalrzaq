import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaChartBar,
  FaRobot,
  FaMagic,
  FaEdit,
  FaTrash,
  FaComments,
} from "react-icons/fa";
import FlowBuilder from "../components/AutoReply/FlowBuilder";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramQuickConnect from "../components/Telegram/TelegramQuickConnect";
import WhatsAppQuickConnect from "../components/WhatsApp/WhatsAppQuickConnect";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  Badge,
  Skeleton,
  EmptyState,
} from "../components/ui/kit";

export default function AutoReplyPage() {
  const [flows, setFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);

  useEffect(() => {
    fetchFlows();
  }, []);

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  const fetchFlows = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_BASE_URL + "/api/auto-reply/flows", cfg());
      setFlows(data);
    } catch (error) {
      console.error("Error fetching flows:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFlow = async (flowId, isActive) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/auto-reply/flows/${flowId}/toggle`, { isActive }, cfg());
      fetchFlows();
    } catch (e) {
      console.error("Error toggling flow:", e);
    }
  };

  const handleDeleteFlow = async (flowId) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/auto-reply/flows/${flowId}`, cfg());
      fetchFlows();
    } catch (e) {
      console.error("Error deleting flow:", e);
    }
  };

  const handleEditFlow = (flow) => {
    setEditingFlow(flow);
    setShowCreateModal(true);
  };

  const handleCreateFlow = () => {
    setEditingFlow(null);
    setShowCreateModal(true);
  };

  const handleSaveFlow = (savedFlow) => {
    setFlows((prev) =>
      editingFlow ? prev.map((f) => (f._id === savedFlow._id ? savedFlow : f)) : [savedFlow, ...prev]
    );
  };

  const activeFlows = flows.filter((f) => f.isActive);
  const totalReplies = flows.reduce((s, f) => s + (f.statistics?.totalReplies || 0), 0);

  return (
    <div>
      <PageHeader
        title="Automation"
        subtitle="Intelligent auto-reply flows that engage customers automatically"
        actions={
          <SubscriptionCheck serviceType="auto_reply">
            <Button onClick={handleCreateFlow}>
              <FaMagic /> New Flow
            </Button>
          </SubscriptionCheck>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard icon={FaRobot} label="Total Flows" value={flows.length} />
        <StatCard icon={FaPlay} label="Active" value={activeFlows.length} />
        <StatCard icon={FaPause} label="Inactive" value={flows.length - activeFlows.length} />
        <StatCard icon={FaChartBar} label="Total Replies" value={totalReplies} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card><TelegramQuickConnect onTelegramConnected={fetchFlows} /></Card>
        <Card><WhatsAppQuickConnect onWhatsAppConnected={fetchFlows} /></Card>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton style={{ width: "50%" }} />
              <Skeleton style={{ width: "80%", marginTop: 10 }} />
            </Card>
          ))}
        </div>
      ) : flows.length === 0 ? (
        <EmptyState
          icon={FaRobot}
          title="No automation flows yet"
          description="Create your first flow to start replying to comments and messages automatically."
          action={<Button onClick={handleCreateFlow}><FaMagic /> Create your first flow</Button>}
        />
      ) : (
        <motion.div
          className="grid gap-4 lg:grid-cols-2"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          <AnimatePresence>
            {flows.map((flow) => (
              <FlowCard
                key={flow._id}
                flow={flow}
                onEdit={handleEditFlow}
                onDelete={handleDeleteFlow}
                onToggle={handleToggleFlow}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <FlowBuilder
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveFlow}
        editingFlow={editingFlow}
      />
    </div>
  );
}

function FlowCard({ flow, onEdit, onDelete, onToggle }) {
  const keywords = flow.triggerKeywords || [];
  const steps = flow.flowSteps?.length || 0;
  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="ss-card ss-card-pad"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl" style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}>
            <FaComments />
          </span>
          <div className="min-w-0">
            <h3 className="font-bold truncate">{flow.name || "Untitled flow"}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge>{flow.platform || "All"}</Badge>
              <Badge variant={flow.isActive ? "success" : "warning"}>
                {flow.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {keywords.slice(0, 6).map((k, i) => (
            <Badge key={i} variant="accent">{k}</Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-sm" style={{ color: "var(--ss-text-muted)" }}>
        <span>{steps} step{steps === 1 ? "" : "s"}</span>
        <span>{flow.statistics?.totalReplies || 0} replies</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="secondary" onClick={() => onEdit(flow)}><FaEdit /> Edit</Button>
        <Button variant="ghost" onClick={() => onToggle(flow._id, !flow.isActive)}>
          {flow.isActive ? <><FaPause /> Pause</> : <><FaPlay /> Activate</>}
        </Button>
        <Button variant="ghost" className="!text-red-500" onClick={() => onDelete(flow._id)}><FaTrash /></Button>
      </div>
    </motion.div>
  );
}
