import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaBan, FaUserCheck, FaTrash, FaCrown, FaDollarSign, FaTimes } from "react-icons/fa";
import axios from "axios";
import { PageHeader, Card, Button, Badge, Field, EmptyState, Skeleton } from "../components/ui/kit";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [banModal, setBanModal] = useState(null);
  const [moneyModal, setMoneyModal] = useState(null);
  const navigate = useNavigate();

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: 10, search: searchTerm, role: roleFilter, status: statusFilter });
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/users?${params}`, cfg());
      setUsers(data.users);
      setPagination(data.pagination || {});
    } catch (err) {
      if (err.response?.status === 403) navigate("/dashboard");
      else setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId, reason, duration) => {
    await axios.post(`${API_BASE_URL}/api/admin/users/ban/${userId}`, { reason, duration }, cfg());
    setBanModal(null);
    fetchUsers();
  };
  const unbanUser = async (userId) => {
    await axios.post(`${API_BASE_URL}/api/admin/users/unban/${userId}`, {}, cfg());
    fetchUsers();
  };
  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, cfg());
    fetchUsers();
  };
  const promoteUser = async (userId) => {
    if (!window.confirm("Promote this user to admin?")) return;
    await axios.post(`${API_BASE_URL}/api/admin/users/promote/${userId}`, {}, cfg());
    fetchUsers();
  };
  const addMoney = async (userId, amount, reason) => {
    await axios.post(`${API_BASE_URL}/api/admin/payments/add-money`, { userId, amount, reason }, cfg());
    setMoneyModal(null);
    fetchUsers();
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage platform users" />

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ss-text-faint)" }} />
            <input
              className="ss-input pl-9"
              placeholder="Search by username or email…"
              value={searchTerm}
              onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
            />
          </div>
          <select className="ss-select !w-auto" value={roleFilter} onChange={(e) => { setCurrentPage(1); setRoleFilter(e.target.value); }}>
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select className="ss-select !w-auto" value={statusFilter} onChange={(e) => { setCurrentPage(1); setStatusFilter(e.target.value); }}>
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </Card>

      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}

      {loading ? (
        <Card><Skeleton style={{ height: 28 }} /><Skeleton style={{ height: 28, marginTop: 10 }} /><Skeleton style={{ height: 28, marginTop: 10 }} /></Card>
      ) : users.length === 0 ? (
        <EmptyState icon={FaSearch} title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-xs" style={{ color: "var(--ss-text-muted)" }}>{user.email}</div>
                  </td>
                  <td>{user.role === "admin" ? <Badge variant="accent"><FaCrown /> Admin</Badge> : <Badge>User</Badge>}</td>
                  <td className="font-semibold">${user.walletBalance?.toFixed(2) || "0.00"}</td>
                  <td>{user.isBanned ? <Badge variant="danger">Banned</Badge> : <Badge variant="success">Active</Badge>}</td>
                  <td className="text-sm" style={{ color: "var(--ss-text-muted)" }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" className="!px-2.5" title="Add money" onClick={() => setMoneyModal(user)}><FaDollarSign /></Button>
                      {user.isBanned ? (
                        <Button variant="ghost" className="!px-2.5 !text-green-600" title="Unban" onClick={() => unbanUser(user._id)}><FaUserCheck /></Button>
                      ) : (
                        <Button variant="ghost" className="!px-2.5 !text-amber-600" title="Ban" onClick={() => setBanModal(user)}><FaBan /></Button>
                      )}
                      {user.role !== "admin" && (
                        <Button variant="ghost" className="!px-2.5" title="Promote to admin" onClick={() => promoteUser(user._id)}><FaCrown /></Button>
                      )}
                      <Button variant="ghost" className="!px-2.5 !text-red-500" title="Delete" onClick={() => deleteUser(user._id)}><FaTrash /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button variant="ghost" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm" style={{ color: "var(--ss-text-muted)" }}>Page {pagination.current || currentPage} of {pagination.pages}</span>
          <Button variant="ghost" disabled={currentPage >= pagination.pages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <AnimatePresence>
        {banModal && <BanModal user={banModal} onClose={() => setBanModal(null)} onSubmit={banUser} />}
        {moneyModal && <MoneyModal user={moneyModal} onClose={() => setMoneyModal(null)} onSubmit={addMoney} />}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="ss-card ss-card-pad relative w-full max-w-md"
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{title}</h3>
          <Button variant="ghost" className="!px-2.5" onClick={onClose}><FaTimes /></Button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function BanModal({ user, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  return (
    <Modal title={`Ban ${user.username}`} onClose={onClose}>
      <Field label="Reason"><input className="ss-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for ban" /></Field>
      <Field label="Duration (days, blank = permanent)"><input className="ss-input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 7" /></Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => onSubmit(user._id, reason, duration ? Number(duration) : undefined)}>Ban user</Button>
      </div>
    </Modal>
  );
}

function MoneyModal({ user, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  return (
    <Modal title={`Add money to ${user.username}`} onClose={onClose}>
      <Field label="Amount ($)" required><input className="ss-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></Field>
      <Field label="Reason"><input className="ss-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" /></Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button disabled={!amount} onClick={() => onSubmit(user._id, Number(amount), reason)}>Add money</Button>
      </div>
    </Modal>
  );
}
