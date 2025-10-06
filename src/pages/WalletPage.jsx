import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCreditCard,
  FaWallet,
  FaHistory,
  FaCog,
  FaShareAlt,
  FaGift,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
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
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)",
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * windowSize.width,
                Math.random() * windowSize.width,
              ],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-20 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaWallet className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
              My Wallet
            </h1>
            <p className="text-xl text-white/80">
              Manage your cards, transactions, and wallet settings
            </p>
          </motion.div>

          {/* Wallet Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Financial Wallet
              </h2>
              <p className="text-white/80 text-lg">
                Manage your cards, transactions, and wallet settings
              </p>
            </div>

            {wallet && (
              <div className="flex justify-center gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                  <p className="text-sm text-white/70 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ${wallet.balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                  <p className="text-sm text-white/70 mb-1">Total Cards</p>
                  <p className="text-3xl font-bold text-white">
                    {wallet.cards?.length || 0}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-center gap-6 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecharge(true)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <FaWallet className="text-xl" />
                Recharge Wallet
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGift(true)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <FaGift className="text-xl" />
                Send Gift
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              <nav className="flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-white text-purple-600 shadow-lg"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="text-lg" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Wallet Stats */}
                  <WalletStats wallet={wallet} />

                  {/* Recent Cards */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          My Cards
                        </h3>
                        <p className="text-white/70">
                          Manage your payment cards
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddCard(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
                      >
                        <FaPlus className="text-lg" />
                        <span>Add Card</span>
                      </motion.button>
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
                  <TransactionList
                    wallet={wallet}
                    refreshKey={refreshTransactions}
                  />
                </div>
              )}

              {activeTab === "cards" && (
                <div className="space-y-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          إدارة البطاقات
                        </h2>
                        <p className="text-white/70">
                          إضافة وتعديل وحذف بطاقات الدفع
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddCard(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
                      >
                        <FaPlus className="text-lg" />
                        <span>إضافة بطاقة جديدة</span>
                      </motion.button>
                    </div>

                    {wallet?.cards?.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaCreditCard className="text-2xl text-white/60" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">
                          No Cards Added
                        </h4>
                        <p className="text-white/70 mb-4">
                          Add your first card to start using your wallet
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAddCard(true)}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                          Add Your First Card
                        </motion.button>
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
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        سجل المعاملات
                      </h2>
                      <p className="text-white/70">
                        عرض جميع معاملاتك وطلبات الشحن
                      </p>
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
                  <h2 className="text-2xl font-bold text-white">
                    Wallet Settings
                  </h2>
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Coming Soon
                    </h3>
                    <p className="text-white/70">
                      Wallet settings and preferences will be available soon.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Modals */}
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
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;
