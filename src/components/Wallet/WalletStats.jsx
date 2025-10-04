import { useState, useEffect } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaCreditCard,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";

const WalletStats = ({ wallet }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/wallet/summary?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching wallet summary:", err);
      // Set default empty summary on error
      setSummary({
        summary: {
          totalDeposits: 0,
          totalSpent: 0,
          transactionCount: 0,
        },
        wallet: {
          totalCards: wallet?.cards?.length || 0,
          activeCards:
            wallet?.cards?.filter((card) => card.isActive !== false)?.length ||
            0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "This Month";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Wallet Statistics</h3>
        <div className="flex gap-2">
          {["day", "week", "month", "year"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Current Balance
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(wallet?.balance || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaWallet className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100 text-sm">
            <span>Available for spending</span>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Deposits
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(summary?.summary?.totalDeposits || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaArrowDown className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-100 text-sm">
            <span>{getPeriodLabel(period)}</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold">
                {formatCurrency(summary?.summary?.totalSpent || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaArrowUp className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-100 text-sm">
            <span>{getPeriodLabel(period)}</span>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Transactions
              </p>
              <p className="text-3xl font-bold">
                {summary?.summary?.transactionCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaChartLine className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-100 text-sm">
            <span>{getPeriodLabel(period)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Cards</h4>
            <FaCreditCard className="text-2xl text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cards:</span>
              <span className="font-semibold">
                {summary?.wallet?.totalCards || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Cards:</span>
              <span className="font-semibold text-green-600">
                {summary?.wallet?.activeCards || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Spending Limits */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Spending Limits
            </h4>
            <FaChartLine className="text-2xl text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily:</span>
              <span className="font-semibold">
                {formatCurrency(
                  wallet?.settings?.spendingLimits?.daily || 1000
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly:</span>
              <span className="font-semibold">
                {formatCurrency(
                  wallet?.settings?.spendingLimits?.monthly || 10000
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h4>
            <FaWallet className="text-2xl text-gray-400" />
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              Add Money
            </button>
            <button className="w-full text-left px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              Add Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletStats;
