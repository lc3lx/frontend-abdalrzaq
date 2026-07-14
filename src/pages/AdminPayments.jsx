import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaClock, FaCheck, FaTimes, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { PageHeader, StatCard, Card, Button, Field, EmptyState, Skeleton } from "../components/ui/kit";

const METHOD_NAMES = { sham_cash: "Sham Cash", payeer: "Payeer", usdt: "USDT TRC20" };

export default function AdminPayments() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const navigate = useNavigate();

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  useEffect(() => {
    fetchPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_BASE_URL + "/api/admin/payments/pending", cfg());
      setPendingRequests(data.pendingRequests || []);
    } catch (err) {
      if (err.response?.status === 403) navigate("/dashboard");
      else setError("Failed to load payment requests.");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (transactionId, amount, notes) => {
    await axios.post(`${API_BASE_URL}/api/admin/payments/approve/${transactionId}`, { amount, notes }, cfg());
    setApproveModal(null);
    fetchPendingRequests();
  };
  const reject = async (transactionId, reason) => {
    await axios.post(`${API_BASE_URL}/api/admin/payments/reject/${transactionId}`, { reason }, cfg());
    setRejectModal(null);
    fetchPendingRequests();
  };

  const totalPending = pendingRequests.reduce((s, r) => s + (r.amount || 0), 0);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Approve or reject wallet recharge requests" />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-6">
        <StatCard icon={FaClock} label="Pending" value={pendingRequests.length} />
        <StatCard icon={FaDollarSign} label="Pending amount" value={`$${totalPending.toFixed(2)}`} />
      </div>

      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}

      {loading ? (
        <Card><Skeleton style={{ height: 28 }} /><Skeleton style={{ height: 28, marginTop: 10 }} /></Card>
      ) : pendingRequests.length === 0 ? (
        <EmptyState icon={FaWallet} title="No pending requests" description="All recharge requests have been processed." />
      ) : (
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((r) => (
                <tr key={r.transactionId}>
                  <td>
                    <div className="font-semibold">{r.username}</div>
                    <div className="text-xs" style={{ color: "var(--ss-text-muted)" }}>{r.email}</div>
                  </td>
                  <td className="font-semibold">${r.amount?.toFixed(2)}</td>
                  <td>{METHOD_NAMES[r.paymentMethod] || r.paymentMethod}</td>
                  <td className="text-sm" style={{ color: "var(--ss-text-muted)" }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" className="!px-2.5 !text-green-600" title="Approve" onClick={() => setApproveModal(r)}><FaCheck /></Button>
                      <Button variant="ghost" className="!px-2.5 !text-red-500" title="Reject" onClick={() => setRejectModal(r)}><FaTimes /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {approveModal && <ApproveModal request={approveModal} onClose={() => setApproveModal(null)} onConfirm={approve} />}
        {rejectModal && <RejectModal request={rejectModal} onClose={() => setRejectModal(null)} onConfirm={reject} />}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div className="ss-card ss-card-pad relative w-full max-w-md" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{title}</h3>
          <Button variant="ghost" className="!px-2.5" onClick={onClose}><FaTimes /></Button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ApproveModal({ request, onClose, onConfirm }) {
  const [amount, setAmount] = useState(request?.amount?.toString() || "");
  const [notes, setNotes] = useState("");
  return (
    <Modal title={`Approve — ${request.username}`} onClose={onClose}>
      <Field label="Amount ($)" required><input className="ss-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="Notes"><input className="ss-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" /></Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button disabled={!amount} onClick={() => onConfirm(request.transactionId, parseFloat(amount), notes)}><FaCheck /> Approve</Button>
      </div>
    </Modal>
  );
}

function RejectModal({ request, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <Modal title={`Reject — ${request.username}`} onClose={onClose}>
      <p className="mb-3 text-sm" style={{ color: "var(--ss-text-muted)" }}>Amount: ${request?.amount?.toFixed(2)}</p>
      <Field label="Reason" required><input className="ss-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection" /></Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" disabled={!reason} onClick={() => onConfirm(request.transactionId, reason)}><FaTimes /> Reject</Button>
      </div>
    </Modal>
  );
}
