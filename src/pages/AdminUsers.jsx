import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaSearch,
  FaBan,
  FaUserCheck,
  FaTrash,
  FaCrown,
  FaUser,
  FaEye,
  FaDollarSign,
} from "react-icons/fa";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showBanModal, setShowBanModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      });

      const response = await axios.get(
        `https://www.sushiluha.com/api/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 403) {
        navigate("/dashboard");
      } else {
        setError("فشل في تحميل المستخدمين");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, reason, duration) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://www.sushiluha.com/api/admin/users/ban/${userId}`,
        { reason, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowBanModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error banning user:", err);
      setError("فشل في حظر المستخدم");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://www.sushiluha.com/api/admin/users/unban/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error unbanning user:", err);
      setError("فشل في إلغاء حظر المستخدم");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://www.sushiluha.com/api/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("فشل في حذف المستخدم");
    }
  };

  const handlePromoteUser = async (userId) => {
    if (!window.confirm("هل تريد ترقية هذا المستخدم إلى أدمن؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://www.sushiluha.com/api/admin/users/promote/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error promoting user:", err);
      setError("فشل في ترقية المستخدم");
    }
  };

  const handleAddMoney = async (userId, amount, reason) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://www.sushiluha.com/api/admin/payments/add-money",
        { userId, amount, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowAddMoneyModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error adding money:", err);
      setError("فشل في إضافة المال");
    }
  };

  if (loading && users.length === 0) {
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
                إدارة المستخدمين
              </h1>
              <p className="text-gray-600 text-lg">
                إدارة شاملة للمستخدمين والحسابات والصلاحيات
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaUsers className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">العودة للوحة التحكم</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              فلاتر البحث
            </h2>
            <p className="text-gray-600">
              ابحث وفلتر المستخدمين حسب المعايير المطلوبة
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
            >
              <option value="">جميع الأدوار</option>
              <option value="user">مستخدم عادي</option>
              <option value="admin">أدمن</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="banned">محظور</option>
            </select>

            <button
              onClick={fetchUsers}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              <FaSearch className="group-hover:scale-110 transition-transform" />
              تحديث
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    الرصيد
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FaUser className="text-white text-lg" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          user.role === "admin"
                            ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
                            : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <FaCrown className="text-sm" />
                            أدمن
                          </>
                        ) : (
                          <>
                            <FaUser className="text-sm" />
                            مستخدم
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ${user.walletBalance?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          user.isBanned
                            ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                            : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                        }`}
                      >
                        {user.isBanned ? (
                          <>
                            <FaBan className="text-sm" />
                            محظور
                          </>
                        ) : (
                          <>
                            <FaUserCheck className="text-sm" />
                            نشط
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAddMoneyModal(true);
                          }}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                          title="إضافة مال"
                        >
                          <FaDollarSign className="text-lg" />
                        </button>

                        {user.isBanned ? (
                          <button
                            onClick={() => handleUnbanUser(user._id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                            title="إلغاء الحظر"
                          >
                            <FaUserCheck className="text-lg" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBanModal(true);
                            }}
                            className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                            title="حظر مؤقت"
                          >
                            <FaBan className="text-lg" />
                          </button>
                        )}

                        {user.role !== "admin" && (
                          <>
                            <button
                              onClick={() => handlePromoteUser(user._id)}
                              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                              title="ترقية إلى أدمن"
                            >
                              <FaCrown className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                              title="حذف المستخدم"
                            >
                              <FaTrash className="text-lg" />
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="group relative inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="group relative inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  التالي
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    عرض{" "}
                    <span className="font-bold text-blue-600">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    إلى{" "}
                    <span className="font-bold text-blue-600">
                      {Math.min(currentPage * 10, pagination.totalUsers)}
                    </span>{" "}
                    من{" "}
                    <span className="font-bold text-blue-600">
                      {pagination.totalUsers}
                    </span>{" "}
                    نتيجة
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="group relative inline-flex items-center px-4 py-3 rounded-r-xl border-2 border-gray-300 bg-white text-sm font-bold text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="group relative inline-flex items-center px-4 py-3 rounded-l-xl border-2 border-gray-300 bg-white text-sm font-bold text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      التالي
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ban Modal */}
        {showBanModal && (
          <BanModal
            user={selectedUser}
            onClose={() => setShowBanModal(false)}
            onConfirm={handleBanUser}
          />
        )}

        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <AddMoneyModal
            user={selectedUser}
            onClose={() => setShowAddMoneyModal(false)}
            onConfirm={handleAddMoney}
          />
        )}
      </div>
    </div>
  );
};

// Ban Modal Component
const BanModal = ({ user, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(24);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user._id, reason, duration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <FaBan className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              حظر المستخدم
            </h3>
            <p className="text-gray-600">{user?.username}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                سبب الحظر
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="اكتب سبب الحظر..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                مدة الحظر (بالساعات)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
                max="168"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
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
                حظر المستخدم
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add Money Modal Component
const AddMoneyModal = ({ user, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user._id, parseFloat(amount), reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FaDollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              إضافة مال للمستخدم
            </h3>
            <p className="text-gray-600">{user?.username}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                المبلغ (دولار أمريكي)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                السبب (اختياري)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="مثال: مكافأة أو تعويض..."
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
                إضافة المال
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
