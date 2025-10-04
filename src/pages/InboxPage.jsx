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
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 flex items-center gap-2"
        >
          <FaSync className={isLoading ? "animate-spin" : ""} />
          Sync Messages
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FaEnvelope className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-800">{stats.unread}</p>
            </div>
            <FaEnvelopeOpen className="text-red-500 text-2xl" />
          </div>
        </div>

        {Object.entries(stats.byPlatform).map(([platform, data]) => {
          const platformData = platforms.find((p) => p.name === platform);
          if (!platformData) return null;

          return (
            <div
              key={platform}
              className="bg-white p-4 rounded-lg shadow-md border-t-4 border-gray-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{platform}</p>
                  <p className="text-lg font-bold text-gray-800">
                    {data.total}
                  </p>
                  {data.unread > 0 && (
                    <p className="text-xs text-red-500">{data.unread} unread</p>
                  )}
                </div>
                {getPlatformIcon(platform)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange("platform", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform.name} value={platform.name}>
                {platform.name}
              </option>
            ))}
          </select>

          <select
            value={filters.isRead}
            onChange={(e) => handleFilterChange("isRead", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Messages</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>

          <div className="flex items-center gap-2 flex-1">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md">
        {messages.length === 0 ? (
          <div className="p-8 text-center">
            <FaEnvelope className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No messages found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filters.platform || filters.isRead || filters.search
                ? "Try adjusting your filters"
                : "Sync your social media accounts to see messages"}
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
              <div className="p-4 bg-blue-50 border-b flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedMessages.length} message(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("read")}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleBulkAction("archive")}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Archive
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !message.isRead
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message._id)}
                      onChange={() => handleSelectMessage(message._id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPlatformIcon(message.platform)}
                        <span className="font-medium text-gray-800">
                          {message.senderName}
                        </span>
                        {message.senderUsername && (
                          <span className="text-gray-500 text-sm">
                            @{message.senderUsername}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          {formatDate(message.receivedAt)}
                        </span>
                        {!message.isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-2">
                        {truncateText(message.content)}
                      </p>

                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {message.attachments.map((attachment, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                              >
                                📎 {attachment.mediaType || "attachment"}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(message)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Mark as read"
                        >
                          <FaEye />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(message._id)}
                        className="text-gray-600 hover:text-gray-800 p-1"
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
              <div className="p-4 border-t flex justify-between items-center">
                <button
                  onClick={() =>
                    fetchMessages({ ...filters, page: pagination.current - 1 })
                  }
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {pagination.current} of {pagination.pages}
                </span>

                <button
                  onClick={() =>
                    fetchMessages({ ...filters, page: pagination.current + 1 })
                  }
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </section>
  );
};

export default InboxPage;
