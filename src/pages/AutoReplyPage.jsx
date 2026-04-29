import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FlowDiagram from "../components/AutoReply/FlowDiagram";
import FlowBuilder from "../components/AutoReply/FlowBuilder";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramQuickConnect from "../components/Telegram/TelegramQuickConnect";
import WhatsAppQuickConnect from "../components/WhatsApp/WhatsAppQuickConnect";
import {
  FaPlay,
  FaPause,
  FaChartBar,
  FaRobot,
  FaArrowRight,
  FaProjectDiagram,
  FaMagic,
} from "react-icons/fa";

const AutoReplyPage = () => {
  const [flows, setFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/auto-reply/flows",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setFlows(response.data);
    } catch (error) {
      console.error("Error fetching flows:", error);
      alert("Failed to fetch auto reply flows");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFlow = async (flowId, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://www.sushiluha.com/api/auto-reply/flows/${flowId}/toggle`,
        { isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchFlows();
    } catch (error) {
      console.error("Error toggling flow:", error);
      alert("Failed to toggle flow");
    }
  };

  const handleDeleteFlow = async (flowId) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://www.sushiluha.com/api/auto-reply/flows/${flowId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchFlows();
    } catch (error) {
      console.error("Error deleting flow:", error);
      alert("Failed to delete flow");
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
    if (editingFlow) {
      // Update existing flow in the list
      setFlows(
        flows.map((flow) => (flow._id === savedFlow._id ? savedFlow : flow))
      );
    } else {
      // Add new flow to the list
      setFlows([savedFlow, ...flows]);
    }
  };

  const activeFlows = flows.filter((flow) => flow.isActive);
  const inactiveFlows = flows.filter((flow) => !flow.isActive);

  return (
    <div className="relative">
      <div className="relative z-10 pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-teal-300 via-amber-300 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-8 text-slate-950 shadow-glow">
              <FaProjectDiagram className="text-4xl text-white" />
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white mb-6">
              Auto Reply Flows
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Create intelligent automated response flows that engage your
              customers automatically
            </p>

            {/* Create Flow Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <SubscriptionCheck serviceType="auto_reply">
                <button
                  onClick={handleCreateFlow}
                  className="premium-button text-lg"
                >
                  <FaMagic />
                  Create New Flow
                  <FaArrowRight />
                </button>
              </SubscriptionCheck>
            </motion.div>
          </motion.div>

          {/* Quick Connections */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="premium-panel rounded-2xl p-8">
              <TelegramQuickConnect onTelegramConnected={fetchFlows} />
            </div>
            <div className="premium-panel rounded-2xl p-8">
              <WhatsAppQuickConnect onWhatsAppConnected={fetchFlows} />
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Your Flow Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-teal-400 to-cyan-600 p-8 rounded-2xl text-center shadow-2xl"
              >
                <FaRobot className="text-4xl text-white mx-auto mb-4" />
                <div className="text-3xl font-black text-white mb-2">
                  {flows.length}
                </div>
                <div className="text-white/90 font-medium">Total Flows</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-emerald-400 to-teal-600 p-8 rounded-2xl text-center shadow-2xl"
              >
                <FaPlay className="text-4xl text-white mx-auto mb-4" />
                <div className="text-3xl font-black text-white mb-2">
                  {activeFlows.length}
                </div>
                <div className="text-white/90 font-medium">Active Flows</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-amber-300 to-orange-500 p-8 rounded-2xl text-center shadow-2xl"
              >
                <FaPause className="text-4xl text-white mx-auto mb-4" />
                <div className="text-3xl font-black text-white mb-2">
                  {inactiveFlows.length}
                </div>
                <div className="text-white/90 font-medium">Inactive Flows</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-rose-400 to-fuchsia-600 p-8 rounded-2xl text-center shadow-2xl"
              >
                <FaChartBar className="text-4xl text-white mx-auto mb-4" />
                <div className="text-3xl font-black text-white mb-2">
                  {flows.reduce(
                    (sum, flow) => sum + (flow.statistics?.totalReplies || 0),
                    0
                  )}
                </div>
                <div className="text-white/90 font-medium">Total Replies</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Active Flows */}
          {activeFlows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <FaPlay className="text-green-400 text-2xl" />
                <h3 className="text-3xl font-bold text-white">
                  Active Flows ({activeFlows.length})
                </h3>
                <FaPlay className="text-green-400 text-2xl" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeFlows.map((flow, index) => (
                  <motion.div
                    key={flow._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FlowDiagram
                      flow={flow}
                      onEdit={handleEditFlow}
                      onDelete={handleDeleteFlow}
                      onToggle={handleToggleFlow}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Inactive Flows */}
          {inactiveFlows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <FaPause className="text-yellow-400 text-2xl" />
                <h3 className="text-3xl font-bold text-white">
                  Inactive Flows ({inactiveFlows.length})
                </h3>
                <FaPause className="text-yellow-400 text-2xl" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {inactiveFlows.map((flow, index) => (
                  <motion.div
                    key={flow._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FlowDiagram
                      flow={flow}
                      onEdit={handleEditFlow}
                      onDelete={handleDeleteFlow}
                      onToggle={handleToggleFlow}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {flows.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="premium-panel rounded-2xl p-16 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-teal-300 via-amber-300 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-8 text-slate-950 shadow-glow">
                <FaRobot className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No Auto Reply Flows Yet
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                Create your first intelligent auto reply flow to start engaging
                with your customers automatically
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateFlow}
                className="premium-button text-lg"
              >
                <FaMagic />
                Create Your First Flow
                <FaArrowRight />
              </motion.button>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-32"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-teal-300"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-300 to-amber-300 opacity-20"></div>
                </div>
                <p className="text-white/80 font-medium">
                  Loading your flows...
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Flow Builder Modal */}
      <FlowBuilder
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveFlow}
        editingFlow={editingFlow}
      />
    </div>
  );
};

export default AutoReplyPage;
