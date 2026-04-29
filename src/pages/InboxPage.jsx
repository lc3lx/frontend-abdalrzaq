import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import ReplyModal from "../components/Inbox/ReplyModal";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSync,
  FaEye,
  FaArchive,
  FaFilter,
  FaSearch,
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
} from "react-icons/fa";

const InboxPage = () => {
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

  const [filters, setFilters] = useState({
    platform: "",
    isRead: "",
    search: "",
  });
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    message: null,
  });
  const [isReplying, setIsReplying] = useState(false);

  const platforms = [
    { name: "Twitter", icon: FaTwitter, color: "text-blue-400" },
    { name: "Facebook", icon: FaFacebook, color: "text-blue-600" },
    { name: "Instagram", icon: FaInstagram, color: "text-pink-500" },
    { name: "LinkedIn", icon: FaLinkedin, color: "text-blue-700" },
  ];

  const getPlatformIcon = (platform) => {
    const platformData = platforms.find((p) => p.name === platform);
    if (platformData) {
      const Icon = platformData.icon;
      return <Icon className={`${platformData.color} text-lg`} />;
    }
    return null;
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchMessages(newFilters);
  };

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    fetchMessages(newFilters);
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((msg) => msg._id));
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
    } catch (error) {
      alert("Failed to mark message as read");
    }
  };

  const handleArchive = async (messageId) => {
    try {
      await archiveMessage(messageId);
    } catch (error) {
      alert("Failed to archive message");
    }
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === "read") {
        await Promise.all(selectedMessages.map((id) => markAsRead(id)));
      } else if (action === "archive") {
        await Promise.all(selectedMessages.map((id) => archiveMessage(id)));
      }
      setSelectedMessages([]);
    } catch (error) {
      alert(`Failed to ${action} messages`);
    }
  };

  const handleSync = async () => {
    try {
      await syncMessages();
      alert("Messages synced successfully!");
    } catch (error) {
      alert("Failed to sync messages");
    }
  };

  const handleReply = (message) => {
    setReplyModal({
      isOpen: true,
      message: message,
    });
  };

  const handleSendReply = async (content, imageUrl) => {
    try {
      setIsReplying(true);
      await replyToMessage(replyModal.message._id, content, imageUrl);
      setReplyModal({ isOpen: false, message: null });
      alert("Reply sent successfully!");
    } catch (error) {
      alert("Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, message: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Inbox</h2>
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="premium-button disabled:opacity-50"
        >
          <FaSync className={isLoading ? "animate-spin" : ""} />
          Sync Messages
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Total Messages</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <FaEnvelope className="text-blue-400 text-3xl" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Unread</p>
              <p className="text-3xl font-bold text-white">{stats.unread}</p>
            </div>
            <FaEnvelopeOpen className="text-red-400 text-3xl" />
          </div>
        </div>

        {Object.entries(stats.byPlatform).map(([platform, data]) => {
          const platformData = platforms.find((p) => p.name === platform);
          if (!platformData) return null;

          return (
            <div
              key={platform}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">{platform}</p>
                  <p className="text-2xl font-bold text-white">
                    {data.total}
                  </p>
                  {data.unread > 0 && (
                    <p className="text-sm text-red-400 font-semibold mt-1">{data.unread} unread</p>
                  )}
                </div>
                <div className="text-2xl bg-white/5 p-3 rounded-xl border border-white/10">
                    {getPlatformIcon(platform)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl mt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FaFilter className="text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-white/90">Filters:</span>
          </div>

          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange("platform", e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-300/40 transition-all appearance-none"
          >
            <option value="" className="bg-slate-800">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform.name} value={platform.name} className="bg-slate-800">
                {platform.name}
              </option>
            ))}
          </select>

          <select
            value={filters.isRead}
            onChange={(e) => handleFilterChange("isRead", e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-300/40 transition-all appearance-none"
          >
            <option value="" className="bg-slate-800">All Messages</option>
            <option value="false" className="bg-slate-800">Unread Only</option>
            <option value="true" className="bg-slate-800">Read Only</option>
          </select>

          <div className="flex items-center gap-2 flex-1 relative">
            <FaSearch className="absolute left-4 text-white/50" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.08] border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl mt-8 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-16 text-center text-white">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaEnvelope className="text-white/40 text-5xl" />
            </div>
            <p className="text-xl font-semibold mb-2">No messages found</p>
            <p className="text-white/60">
              {filters.platform || filters.isRead || filters.search
                ? "Try adjusting your filters to see more results."
                : "Sync your social media accounts to start receiving messages."}
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
              <div className="p-4 bg-purple-900/40 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold text-purple-200">
                  {selectedMessages.length} message(s) selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBulkAction("read")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleBulkAction("archive")}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition"
                  >
                    Archive
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-white/10">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-6 hover:bg-white/5 transition-all duration-300 ${
                    !message.isRead
                      ? "bg-purple-900/20 border-l-4 border-purple-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message._id)}
                      onChange={() => handleSelectMessage(message._id)}
                      className="mt-1.5 h-5 w-5 text-teal-300 border-white/30 rounded bg-white/10 focus:ring-teal-300"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            {getPlatformIcon(message.platform)}
                        </div>
                        <span className="font-bold text-lg text-white">
                          {message.senderName}
                        </span>
                        {message.senderUsername && (
                          <span className="text-white/50 text-sm">
                            @{message.senderUsername}
                          </span>
                        )}
                        <span className="text-white/40 text-sm ml-auto">
                          {formatDate(message.receivedAt)}
                        </span>
                        {!message.isRead && (
                          <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-white/80 mb-4 ml-12 text-lg leading-relaxed">
                        {truncateText(message.content)}
                      </p>

                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="flex gap-2 mb-2 ml-12">
                            {message.attachments.map((attachment, index) => (
                              <span
                                key={index}
                                className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
                              >
                                📎 {attachment.mediaType || "Photo"}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleReply(message)}
                        className="text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 p-3 rounded-xl transition-all"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          className="text-teal-300 hover:text-teal-200 bg-teal-400/10 hover:bg-teal-400/20 p-3 rounded-xl transition-all"
                          title="Mark as read"
                        >
                          <FaEye />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(message._id)}
                        className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
                        title="Archive"
                      >
                        <FaArchive />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/5">
                <button
                  onClick={() =>
                    fetchMessages({ ...filters, page: pagination.current - 1 })
                  }
                  disabled={!pagination.hasPrev}
                  className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 disabled:opacity-50 transition border border-white/10"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-white/70">
                  Page <span className="text-white">{pagination.current}</span> of <span className="text-white">{pagination.pages}</span>
                </span>

                <button
                  onClick={() =>
                    fetchMessages({ ...filters, page: pagination.current + 1 })
                  }
                  disabled={!pagination.hasNext}
                  className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 disabled:opacity-50 transition border border-white/10"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModal.isOpen}
        onClose={closeReplyModal}
        onReply={handleSendReply}
        message={replyModal.message}
        isLoading={isReplying}
      />
    </div>
  );
};

export default InboxPage;
