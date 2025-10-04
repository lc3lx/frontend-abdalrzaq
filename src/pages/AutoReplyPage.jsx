import { useState, useEffect } from "react";
import axios from "axios";
import FlowDiagram from "../components/AutoReply/FlowDiagram";
import FlowBuilder from "../components/AutoReply/FlowBuilder";
import FlowExample from "../components/AutoReply/FlowExample";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramQuickConnect from "../components/Telegram/TelegramQuickConnect";
import WhatsAppQuickConnect from "../components/WhatsApp/WhatsAppQuickConnect";
import {
  FaPlus,
  FaPlay,
  FaPause,
  FaEdit,
  FaTrash,
  FaCog,
  FaChartBar,
  FaRobot,
} from "react-icons/fa";

const AutoReplyPage = () => {
  const [flows, setFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);

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
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Auto Reply Flows</h2>
          <p className="text-gray-600">
            Create and manage automated response flows
          </p>
        </div>
        <SubscriptionCheck serviceType="auto_reply">
          <button
            onClick={handleCreateFlow}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaPlus />
            Create Flow
          </button>
        </SubscriptionCheck>
      </div>

      {/* Flow Example */}
      <FlowExample />

      {/* Telegram Quick Connect */}
      <TelegramQuickConnect onTelegramConnected={fetchFlows} />

      {/* WhatsApp Quick Connect */}
      <WhatsAppQuickConnect onWhatsAppConnected={fetchFlows} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Flows</p>
              <p className="text-2xl font-bold text-gray-800">{flows.length}</p>
            </div>
            <FaRobot className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Flows</p>
              <p className="text-2xl font-bold text-gray-800">
                {activeFlows.length}
              </p>
            </div>
            <FaPlay className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Flows</p>
              <p className="text-2xl font-bold text-gray-800">
                {inactiveFlows.length}
              </p>
            </div>
            <FaPause className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Replies</p>
              <p className="text-2xl font-bold text-gray-800">
                {flows.reduce(
                  (sum, flow) => sum + (flow.statistics?.totalReplies || 0),
                  0
                )}
              </p>
            </div>
            <FaChartBar className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Active Flows */}
      {activeFlows.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPlay className="text-green-500" />
            Active Flows ({activeFlows.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeFlows.map((flow) => (
              <FlowDiagram
                key={flow._id}
                flow={flow}
                onEdit={handleEditFlow}
                onDelete={handleDeleteFlow}
                onToggle={handleToggleFlow}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Flows */}
      {inactiveFlows.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPause className="text-yellow-500" />
            Inactive Flows ({inactiveFlows.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inactiveFlows.map((flow) => (
              <FlowDiagram
                key={flow._id}
                flow={flow}
                onEdit={handleEditFlow}
                onDelete={handleDeleteFlow}
                onToggle={handleToggleFlow}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {flows.length === 0 && !isLoading && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaRobot className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Auto Reply Flows
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first auto reply flow to start automating responses
          </p>
          <button
            onClick={handleCreateFlow}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Create Your First Flow
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Flow Builder Modal */}
      <FlowBuilder
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveFlow}
        editingFlow={editingFlow}
      />
    </section>
  );
};

export default AutoReplyPage;
