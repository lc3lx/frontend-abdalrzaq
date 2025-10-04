import { useState, useEffect } from "react";
import {
  FaPlus,
  FaCreditCard,
  FaWallet,
  FaHistory,
  FaCog,
  FaShareAlt,
  FaGift,
} from "react-icons/fa";
import CreditCard from "../components/Wallet/CreditCard";
import AddCardModal from "../components/Wallet/AddCardModal";
import WalletStats from "../components/Wallet/WalletStats";
import TransactionList from "../components/Wallet/TransactionList";
import RechargeModal from "../components/Wallet/RechargeModal";
import GiftModal from "../components/Wallet/GiftModal";
import ReferralPanel from "../components/Referral/ReferralPanel";
import axios from "axios";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [refreshTransactions, setRefreshTransactions] = useState(0);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to access wallet");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://www.sushiluha.com/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setWallet(response.data);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Wallet not found. Please contact support.");
      } else if (err.code === "ECONNREFUSED") {
        setError("Backend server is not running. Please start the server.");
      } else {
        setError("Failed to load wallet information");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardAdded = (newCard) => {
    setWallet((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
    setShowAddCard(false);
  };

  const handleCardSelect = (card) => {
    setSelectedCard(selectedCard?.cardId === card.cardId ? null : card);
  };

  const handleRechargeSuccess = () => {
    fetchWallet(); // تحديث بيانات المحفظة
    setRefreshTransactions((prev) => prev + 1); // تحديث قائمة المعاملات
    setShowRecharge(false);
  };

  const handleGiftSuccess = () => {
    fetchWallet(); // تحديث بيانات المحفظة
    setRefreshTransactions((prev) => prev + 1); // تحديث قائمة المعاملات
    setShowGift(false);
  };

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: FaWallet },
    { id: "cards", label: "البطاقات", icon: FaCreditCard },
    { id: "transactions", label: "المعاملات", icon: FaHistory },
    { id: "referral", label: "الإحالة", icon: FaShareAlt },
    { id: "settings", label: "الإعدادات", icon: FaCog },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Wallet</h2>
            <p>{error}</p>
            <button
              onClick={fetchWallet}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">محفظتي المالية</h1>
                <p className="text-blue-100 text-lg">
                  إدارة بطاقاتك ومعاملاتك وإعدادات المحفظة
                </p>
                {wallet && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <p className="text-sm text-blue-100">الرصيد الحالي</p>
                      <p className="text-2xl font-bold">
                        ${wallet.balance?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <p className="text-sm text-blue-100">عدد البطاقات</p>
                      <p className="text-2xl font-bold">
                        {wallet.cards?.length || 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRecharge(true)}
                  className="flex items-center gap-3 px-6 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaWallet className="text-xl" />
                  <span className="font-semibold text-lg">شحن المحفظة</span>
                </button>
                <button
                  onClick={() => setShowGift(true)}
                  className="flex items-center gap-3 px-6 py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaGift className="text-xl" />
                  <span className="font-semibold text-lg">إهداء المال</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Wallet Stats */}
            <WalletStats wallet={wallet} />

            {/* Recent Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    بطاقاتي
                  </h3>
                  <p className="text-gray-600">إدارة بطاقات الدفع الخاصة بك</p>
                </div>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaPlus className="text-lg" />
                  <span className="font-semibold">إضافة بطاقة</span>
                </button>
              </div>

              {wallet?.cards?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCreditCard className="text-3xl text-blue-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    لم تتم إضافة أي بطاقات بعد
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    أضف بطاقتك الأولى للبدء في استخدام محفظتك المالية
                  </p>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    إضافة بطاقتي الأولى
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wallet?.cards?.map((card) => (
                    <div key={card.cardId} className="relative">
                      <CreditCard
                        card={card}
                        onClick={() => handleCardSelect(card)}
                        isSelected={selectedCard?.cardId === card.cardId}
                      />
                      {card.isDefault && (
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          DEFAULT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <TransactionList wallet={wallet} refreshKey={refreshTransactions} />
          </div>
        )}

        {activeTab === "cards" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    إدارة البطاقات
                  </h2>
                  <p className="text-gray-600">
                    إضافة وتعديل وحذف بطاقات الدفع
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaPlus className="text-lg" />
                  <span className="font-semibold">إضافة بطاقة جديدة</span>
                </button>
              </div>

              {wallet?.cards?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCreditCard className="text-2xl text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    No Cards Added
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Add your first card to start using your wallet
                  </p>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Card
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wallet?.cards?.map((card) => (
                    <div key={card.cardId} className="relative">
                      <CreditCard
                        card={card}
                        onClick={() => handleCardSelect(card)}
                        isSelected={selectedCard?.cardId === card.cardId}
                        showBack={selectedCard?.cardId === card.cardId}
                      />
                      {card.isDefault && (
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          DEFAULT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  سجل المعاملات
                </h2>
                <p className="text-gray-600">عرض جميع معاملاتك وطلبات الشحن</p>
              </div>
              <TransactionList
                wallet={wallet}
                refreshKey={refreshTransactions}
              />
            </div>
          </div>
        )}

        {activeTab === "referral" && (
          <div className="space-y-8">
            <ReferralPanel />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Wallet Settings
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Coming Soon
              </h3>
              <p className="text-gray-600">
                Wallet settings and preferences will be available soon.
              </p>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        <AddCardModal
          isOpen={showAddCard}
          onClose={() => setShowAddCard(false)}
          onCardAdded={handleCardAdded}
        />

        {/* Recharge Modal */}
        <RechargeModal
          isOpen={showRecharge}
          onClose={() => setShowRecharge(false)}
          onRechargeSuccess={handleRechargeSuccess}
        />

        {/* Gift Modal */}
        <GiftModal
          isOpen={showGift}
          onClose={() => setShowGift(false)}
          onGiftSuccess={handleGiftSuccess}
          wallet={wallet}
        />
      </div>
    </div>
  );
};

export default WalletPage;
