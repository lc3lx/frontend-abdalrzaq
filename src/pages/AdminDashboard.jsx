import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaWallet,
  FaClock,
  FaChartLine,
  FaShieldAlt,
  FaGift,
  FaUserPlus,
  FaDollarSign,
  FaExclamationTriangle,
  FaShoppingBag,
} from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/admin/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      if (err.response?.status === 403) {
        navigate("/dashboard");
      } else {
        setError("فشل في تحميل الإحصائيات");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي المستخدمين",
      value: stats?.users?.total || 0,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "المستخدمون الجدد",
      value: stats?.users?.recentRegistrations || 0,
      icon: FaUserPlus,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "إجمالي الرصيد",
      value: `$${stats?.wallets?.totalBalance || "0.00"}`,
      icon: FaDollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "طلبات الشحن المعلقة",
      value: stats?.rechargeRequests?.pending || 0,
      icon: FaClock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "قيمة الطلبات المعلقة",
      value: `$${stats?.rechargeRequests?.pendingAmount || "0.00"}`,
      icon: FaWallet,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "المستخدمون المحظورون",
      value: stats?.users?.banned || 0,
      icon: FaShieldAlt,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-right">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                لوحة تحكم الإدارة
              </h1>
              <p className="text-gray-600 text-lg">
                نظرة عامة شاملة على إحصائيات النظام وإدارة المستخدمين
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaUsers className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">إدارة المستخدمين</span>
              </button>
              <button
                onClick={() => navigate("/admin/payments")}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaWallet className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">إدارة المدفوعات</span>
              </button>
              <button
                onClick={() => navigate("/admin/packages")}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">إدارة الباقات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`text-2xl ${card.textColor}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {card.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {card.value}
                    </p>
                    <div
                      className={`h-1 w-16 mx-auto bg-gradient-to-r ${card.color} rounded-full`}
                    ></div>
                  </div>
                </div>
                <div
                  className={`h-2 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              إجراءات سريعة
            </h2>
            <p className="text-gray-600">إدارة سريعة للنظام والمستخدمين</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => navigate("/admin/payments")}
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaClock className="text-2xl" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">طلبات الشحن</p>
                  <p className="text-sm opacity-90">
                    {stats?.rechargeRequests?.pending || 0} طلب معلق
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">إدارة المستخدمين</p>
                  <p className="text-sm opacity-90">
                    {stats?.users?.total || 0} مستخدم نشط
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/users?status=banned")}
              className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">المستخدمون المحظورون</p>
                  <p className="text-sm opacity-90">
                    {stats?.users?.banned || 0} مستخدم محظور
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/analytics")}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine className="text-2xl" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">التحليلات</p>
                  <p className="text-sm opacity-90">إحصائيات مفصلة</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              النشاط الأخير
            </h2>
            <p className="text-gray-600">آخر التحديثات والإحصائيات</p>
          </div>
          <div className="space-y-6">
            <div className="group flex items-center gap-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg mb-1">
                  {stats?.users?.recentRegistrations || 0} مستخدم جديد
                </p>
                <p className="text-gray-600">في الأسبوع الماضي</p>
                <div className="mt-2 text-sm text-green-600 font-medium">
                  منذ 7 أيام
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  +{stats?.users?.recentRegistrations || 0}
                </div>
              </div>
            </div>

            <div className="group flex items-center gap-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaClock className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg mb-1">
                  {stats?.rechargeRequests?.pending || 0} طلب شحن معلق
                </p>
                <p className="text-gray-600">يحتاج موافقة</p>
                <div className="mt-2 text-sm text-orange-600 font-medium">
                  بقيمة ${stats?.rechargeRequests?.pendingAmount || "0.00"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.rechargeRequests?.pending || 0}
                </div>
              </div>
            </div>

            <div className="group flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FaGift className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg mb-1">
                  {stats?.referrals?.active || 0} إحالة مكتملة
                </p>
                <p className="text-gray-600">
                  من أصل {stats?.referrals?.total || 0} إحالة
                </p>
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  معدل النجاح:{" "}
                  {stats?.referrals?.total > 0
                    ? Math.round(
                        (stats?.referrals?.active / stats?.referrals?.total) *
                          100
                      )
                    : 0}
                  %
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.referrals?.active || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
