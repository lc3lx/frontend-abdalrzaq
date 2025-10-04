import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaClock,
  FaCheck,
  FaTimes,
  FaEye,
  FaDollarSign,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";
import axios from "axios";

const AdminPayments = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/admin/payments/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPendingRequests(response.data.pendingRequests);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      if (err.response?.status === 403) {
        navigate("/dashboard");
      } else {
        setError("فشل في تحميل طلبات الشحن");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (transactionId, amount, notes) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://www.sushiluha.com/api/admin/payments/approve/${transactionId}`,
        { amount, notes },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowApprovalModal(false);
      fetchPendingRequests();
    } catch (err) {
      console.error("Error approving request:", err);
      setError("فشل في الموافقة على طلب الشحن");
    }
  };

  const handleRejectRequest = async (transactionId, reason) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://www.sushiluha.com/api/admin/payments/reject/${transactionId}`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowRejectionModal(false);
      fetchPendingRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("فشل في رفض طلب الشحن");
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "sham_cash":
        return <FaShieldAlt className="text-green-600" />;
      case "payeer":
        return <FaCreditCard className="text-blue-600" />;
      case "usdt":
        return <FaDollarSign className="text-orange-600" />;
      default:
        return <FaWallet className="text-gray-600" />;
    }
  };

  const getPaymentMethodName = (method) => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-right">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                إدارة المدفوعات
              </h1>
              <p className="text-gray-600 text-lg">
                مراجعة وموافقة طلبات شحن المحفظة
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaWallet className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">العودة للوحة التحكم</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaClock className="text-3xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  طلبات الشحن المعلقة
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {pendingRequests.length}
              </p>
              <div className="h-1 w-16 mx-auto bg-gradient-to-r from-orange-500 to-amber-600 rounded-full"></div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaDollarSign className="text-3xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  إجمالي المبلغ المعلق
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                $
                {pendingRequests
                  .reduce((sum, req) => sum + req.amount, 0)
                  .toFixed(2)}
              </p>
              <div className="h-1 w-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaWallet className="text-3xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  متوسط الطلب
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                $
                {pendingRequests.length > 0
                  ? (
                      pendingRequests.reduce(
                        (sum, req) => sum + req.amount,
                        0
                      ) / pendingRequests.length
                    ).toFixed(2)
                  : "0.00"}
              </p>
              <div className="h-1 w-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              طلبات الشحن المعلقة
            </h2>
            <p className="text-gray-600 mt-2">
              مراجعة وموافقة طلبات شحن المحفظة
            </p>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
                <FaClock className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-medium">
                لا توجد طلبات شحن معلقة
              </p>
              <p className="text-gray-400 mt-2">
                سيتم عرض الطلبات هنا عند توفرها
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      طريقة الدفع
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      تاريخ الطلب
                    </th>
                    <th className="px-8 py-6 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr
                      key={request.transactionId}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-lg">
                                {request.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="mr-4">
                            <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {request.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-2xl font-bold text-gray-900">
                          ${request.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getPaymentMethodIcon(request.paymentMethod)}
                          </div>
                          <span className="text-lg font-medium text-gray-900">
                            {getPaymentMethodName(request.paymentMethod)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-900 max-w-xs truncate font-medium">
                          {request.description}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {new Date(request.createdAt).toLocaleDateString(
                          "ar-SA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApprovalModal(true);
                            }}
                            className="p-3 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-300 transform hover:scale-110 font-bold"
                            title="موافقة"
                          >
                            <FaCheck className="text-xl" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectionModal(true);
                            }}
                            className="p-3 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110 font-bold"
                            title="رفض"
                          >
                            <FaTimes className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <ApprovalModal
            request={selectedRequest}
            onClose={() => setShowApprovalModal(false)}
            onConfirm={handleApproveRequest}
          />
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <RejectionModal
            request={selectedRequest}
            onClose={() => setShowRejectionModal(false)}
            onConfirm={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
};

// Approval Modal Component
const ApprovalModal = ({ request, onClose, onConfirm }) => {
  const [amount, setAmount] = useState(request?.amount?.toString() || "");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.transactionId, parseFloat(amount), notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              موافقة على طلب الشحن
            </h3>
            <p className="text-gray-600">تأكيد الموافقة على طلب شحن المحفظة</p>
          </div>

          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">
                  المستخدم:
                </p>
                <p className="font-bold text-gray-900">{request?.username}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">
                  طريقة الدفع:
                </p>
                <p className="font-bold text-gray-900">
                  {request?.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                المبلغ المراد الموافقة عليه
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="ملاحظات إضافية..."
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl"
              >
                موافقة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Rejection Modal Component
const RejectionModal = ({ request, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.transactionId, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <FaTimes className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              رفض طلب الشحن
            </h3>
            <p className="text-gray-600">تأكيد رفض طلب شحن المحفظة</p>
          </div>

          <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">
                  المستخدم:
                </p>
                <p className="font-bold text-gray-900">{request?.username}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">المبلغ:</p>
                <p className="font-bold text-gray-900">
                  ${request?.amount?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                سبب الرفض
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="اكتب سبب رفض طلب الشحن..."
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl"
              >
                رفض
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
