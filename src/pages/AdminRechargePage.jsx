import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye, FaClock, FaSpinner } from "react-icons/fa";
import axios from "axios";

const AdminRechargePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://www.sushiluha.com/api/admin/recharge-requests?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setRequests(response.data.requests);
    } catch (err) {
      console.error("Error fetching recharge requests:", err);
      setError("Failed to load recharge requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://www.sushiluha.com/api/admin/recharge-requests/${requestId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: "completed" } : req
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://www.sushiluha.com/api/admin/recharge-requests/${requestId}/reject`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setRequests(
        requests.map((req) =>
          req._id === requestId
            ? { ...req, status: "failed", adminNotes: reason }
            : req
        )
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case "sham_cash":
        return "شام كاش";
      case "payeer":
        return "Payeer";
      case "usdt":
        return "USDT TRC20";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إدارة طلبات الشحن
          </h1>
          <p className="text-gray-600">مراجعة وموافقة طلبات شحن المحفظة</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {["all", "pending", "processing", "completed", "failed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status === "all" ? "الكل" : status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    طريقة الشحن
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.user?.name || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMethodName(request.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${request.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(request._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("سبب الرفض:");
                                if (reason) handleReject(request._id, reason);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  تفاصيل طلب الشحن
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      المستخدم:
                    </label>
                    <p className="text-gray-900">
                      {selectedRequest.user?.name || "غير محدد"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      طريقة الشحن:
                    </label>
                    <p className="text-gray-900">
                      {getMethodName(selectedRequest.method)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      المبلغ:
                    </label>
                    <p className="text-gray-900">
                      ${selectedRequest.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      الحالة:
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedRequest.status
                      )}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      تاريخ الطلب:
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleString(
                        "ar-SA"
                      )}
                    </p>
                  </div>

                  {selectedRequest.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        عنوان USDT:
                      </label>
                      <p className="text-gray-900 font-mono text-sm">
                        {selectedRequest.address}
                      </p>
                    </div>
                  )}

                  {selectedRequest.txHash && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        معرف المعاملة:
                      </label>
                      <p className="text-gray-900 font-mono text-sm">
                        {selectedRequest.txHash}
                      </p>
                    </div>
                  )}

                  {selectedRequest.adminNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        ملاحظات الإدارة:
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRechargePage;
