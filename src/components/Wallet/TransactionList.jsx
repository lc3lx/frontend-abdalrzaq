import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaArrowUp,
  FaArrowDown,
  FaCreditCard,
  FaWallet,
  FaGift,
  FaUndo,
  FaCoins,
  FaMoneyBillWave,
  FaHeart,
  FaHandHoldingHeart,
} from "react-icons/fa";
import axios from "axios";

const TransactionList = ({ wallet, refreshKey }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [page, filter]);

  useEffect(() => {
    if (refreshKey > 0) {
      setPage(1);
      setTransactions([]);
      fetchTransactions();
    }
  }, [refreshKey]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view transactions");
        setLoading(false);
        return;
      }

      let response;

      if (filter === "recharge") {
        // Fetch recharge requests
        response = await axios.get(
          "http://localhost:5000/api/wallet/recharge-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const rechargeTransactions = response.data.rechargeRequests || [];
        if (page === 1) {
          setTransactions(rechargeTransactions);
        } else {
          setTransactions((prev) => [...prev, ...rechargeTransactions]);
        }
        setHasMore(false); // No pagination for recharge requests
      } else {
        // Fetch regular transactions
        response = await axios.get(
          `http://localhost:5000/api/wallet/transactions?page=${page}&limit=10&type=${
            filter === "all" ? "" : filter
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (page === 1) {
          setTransactions(response.data.transactions || []);
        } else {
          setTransactions((prev) => [
            ...prev,
            ...(response.data.transactions || []),
          ]);
        }

        setHasMore(
          response.data.pagination?.page < response.data.pagination?.pages
        );
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.code === "ECONNREFUSED") {
        setError("Backend server is not running. Please start the server.");
      } else {
        setError("Failed to load transactions");
      }
      // Set empty transactions on error
      if (page === 1) {
        setTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type, paymentMethod) => {
    // Check if it's a recharge transaction
    if (
      paymentMethod === "sham_cash" ||
      paymentMethod === "payeer" ||
      paymentMethod === "usdt"
    ) {
      switch (paymentMethod) {
        case "sham_cash":
          return <FaMoneyBillWave className="text-blue-600" />;
        case "payeer":
          return <FaCreditCard className="text-green-600" />;
        case "usdt":
          return <FaCoins className="text-purple-600" />;
        default:
          return <FaWallet className="text-gray-600" />;
      }
    }

    // Regular transaction icons
    switch (type) {
      case "deposit":
        return <FaArrowDown className="text-green-600" />;
      case "payment":
        return <FaCreditCard className="text-blue-600" />;
      case "refund":
        return <FaUndo className="text-orange-600" />;
      case "bonus":
        return <FaGift className="text-purple-600" />;
      case "gift_sent":
        return <FaHeart className="text-red-500" />;
      case "gift_received":
        return <FaHandHoldingHeart className="text-pink-500" />;
      default:
        return <FaWallet className="text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "deposit":
      case "refund":
      case "bonus":
      case "gift_received":
        return "text-green-600";
      case "payment":
      case "gift_sent":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amount, type) => {
    const sign =
      type === "deposit" ||
      type === "refund" ||
      type === "bonus" ||
      type === "gift_received"
        ? "+"
        : "-";
    return `${sign}$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setTransactions([]);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">المعاملات الأخيرة</h3>
        <div className="flex gap-3 flex-wrap">
          {[
            "all",
            "deposit",
            "payment",
            "refund",
            "gift_sent",
            "gift_received",
            "recharge",
          ].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleFilterChange(filterType)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === filterType
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              {filterType === "recharge"
                ? "طلبات الشحن"
                : filterType === "all"
                ? "الكل"
                : filterType === "deposit"
                ? "إيداع"
                : filterType === "payment"
                ? "دفع"
                : filterType === "refund"
                ? "استرداد"
                : filterType === "gift_sent"
                ? "هدايا مرسلة"
                : filterType === "gift_received"
                ? "هدايا مستلمة"
                : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaWallet className="text-3xl text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            لا توجد معاملات
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === "all"
              ? "لم تقم بأي معاملات بعد."
              : filter === "recharge"
              ? "لا توجد طلبات شحن."
              : `لا توجد معاملات ${filter} موجودة.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.transactionId}
              className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center shadow-sm border border-blue-100">
                  {getTransactionIcon(
                    transaction.type,
                    transaction.paymentMethod
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {transaction.description}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{formatDate(transaction.createdAt)}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status === "pending"
                        ? "في الانتظار"
                        : transaction.status === "processing"
                        ? "جاري المعالجة"
                        : transaction.status === "completed"
                        ? "مكتمل"
                        : transaction.status === "failed"
                        ? "فشل"
                        : transaction.status === "cancelled"
                        ? "ملغي"
                        : transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold text-lg ${getTransactionColor(
                    transaction.type
                  )}`}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                <div className="text-sm text-gray-500">
                  {transaction.paymentMethod === "sham_cash"
                    ? "شام كاش"
                    : transaction.paymentMethod === "payeer"
                    ? "Payeer"
                    : transaction.paymentMethod === "usdt"
                    ? "USDT TRC20"
                    : transaction.paymentMethod === "gift"
                    ? "هدية"
                    : transaction.paymentMethod === "referral"
                    ? "عمولة إحالة"
                    : transaction.paymentMethod === "admin"
                    ? "إضافة من الإدارة"
                    : transaction.paymentMethod === "package"
                    ? "اشتراك في باقة"
                    : transaction.paymentMethod.replace("_", " ").toUpperCase()}
                </div>
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "جاري التحميل..." : "تحميل المزيد"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

TransactionList.propTypes = {
  wallet: PropTypes.object,
  refreshKey: PropTypes.number,
};

export default TransactionList;
