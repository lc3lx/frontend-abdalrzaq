import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaPlus,
  FaCreditCard,
  FaWallet,
  FaHistory,
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
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  EmptyState,
  Skeleton,
} from "../components/ui/kit";

const TABS = [
  { id: "overview", label: "Overview", icon: FaWallet },
  { id: "cards", label: "Cards", icon: FaCreditCard },
  { id: "transactions", label: "Transactions", icon: FaHistory },
  { id: "referral", label: "Referral", icon: FaShareAlt },
];

export default function WalletPage() {
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
      setError("");
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_BASE_URL + "/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setWallet(data);
    } catch (err) {
      if (err.response?.status === 401) setError("Session expired. Please login again.");
      else if (err.response?.status === 404) setError("Wallet not found. Please contact support.");
      else setError("Failed to load wallet information.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardAdded = (newCard) => {
    setWallet((prev) => ({ ...prev, cards: [...(prev?.cards || []), newCard] }));
    setShowAddCard(false);
  };
  const handleCardSelect = (card) =>
    setSelectedCard(selectedCard?.cardId === card.cardId ? null : card);
  const handleRechargeSuccess = () => {
    fetchWallet();
    setRefreshTransactions((p) => p + 1);
    setShowRecharge(false);
  };
  const handleGiftSuccess = () => {
    fetchWallet();
    setRefreshTransactions((p) => p + 1);
    setShowGift(false);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Wallet" subtitle="Balance, cards & transactions" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><Skeleton style={{ width: "50%" }} /><Skeleton style={{ width: "70%", marginTop: 12, height: 24 }} /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Wallet" />
        <Card className="flex items-center justify-between gap-4" style={{ borderColor: "var(--ss-danger)" }}>
          <div>
            <p className="font-semibold">Error loading wallet</p>
            <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{error}</p>
          </div>
          <Button variant="secondary" onClick={fetchWallet}>Try again</Button>
        </Card>
      </div>
    );
  }

  const cards = wallet?.cards || [];

  return (
    <div>
      <PageHeader
        title="Wallet"
        subtitle="Balance, cards & transactions"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setShowRecharge(true)}><FaWallet /> Recharge</Button>
            <Button variant="secondary" onClick={() => setShowGift(true)}><FaGift /> Gift</Button>
          </div>
        }
      />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-6">
        <StatCard icon={FaWallet} label="Balance" value={`$${(wallet?.balance || 0).toFixed(2)}`} />
        <StatCard icon={FaCreditCard} label="Cards" value={cards.length} />
        <StatCard icon={FaHistory} label="Currency" value={wallet?.currency || "USD"} />
      </div>

      {/* Tabs */}
      <div className="ss-card p-1.5 mb-5 inline-flex flex-wrap gap-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="ss-btn"
              style={{
                background: active ? "var(--ss-accent)" : "transparent",
                color: active ? "#fff" : "var(--ss-text-muted)",
                boxShadow: active ? "0 6px 16px rgba(99,102,241,0.28)" : "none",
              }}
            >
              <Icon /> {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              <WalletStats wallet={wallet} />
              <CardsSection cards={cards} onAdd={() => setShowAddCard(true)} onSelect={handleCardSelect} selectedCard={selectedCard} />
              <TransactionList wallet={wallet} refreshKey={refreshTransactions} />
            </div>
          )}
          {activeTab === "cards" && (
            <CardsSection cards={cards} onAdd={() => setShowAddCard(true)} onSelect={handleCardSelect} selectedCard={selectedCard} showBack />
          )}
          {activeTab === "transactions" && <TransactionList wallet={wallet} refreshKey={refreshTransactions} />}
          {activeTab === "referral" && <ReferralPanel />}
        </motion.div>
      </AnimatePresence>

      <AddCardModal isOpen={showAddCard} onClose={() => setShowAddCard(false)} onCardAdded={handleCardAdded} />
      <RechargeModal isOpen={showRecharge} onClose={() => setShowRecharge(false)} onRechargeSuccess={handleRechargeSuccess} />
      <GiftModal isOpen={showGift} onClose={() => setShowGift(false)} onGiftSuccess={handleGiftSuccess} wallet={wallet} />
    </div>
  );
}

function CardsSection({ cards, onAdd, onSelect, selectedCard, showBack }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">My cards</h3>
        <Button onClick={onAdd}><FaPlus /> Add card</Button>
      </div>
      {cards.length === 0 ? (
        <EmptyState
          icon={FaCreditCard}
          title="No cards yet"
          description="Add your first card to start using your wallet."
          action={<Button onClick={onAdd}><FaPlus /> Add your first card</Button>}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.cardId} className="relative">
              <CreditCard
                card={card}
                onClick={() => onSelect(card)}
                isSelected={selectedCard?.cardId === card.cardId}
                showBack={showBack && selectedCard?.cardId === card.cardId}
              />
              {card.isDefault && (
                <div className="absolute -top-2 -left-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  DEFAULT
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
