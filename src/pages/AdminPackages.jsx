import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaTimes } from "react-icons/fa";
import axios from "axios";
import { PageHeader, Card, Button, Badge, Field, EmptyState, SkeletonCard } from "../components/ui/kit";

const SERVICE_TYPES = [
  "facebook", "instagram", "twitter", "linkedin", "tiktok", "youtube",
  "auto_reply", "analytics", "scheduling", "all_services",
];

const emptyPkg = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  price: "", duration: 30, maxAccounts: 1, maxPostsPerDay: 10, maxProducts: 50,
  isPopular: false, isActive: true, services: [],
};

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', pkg }
  const navigate = useNavigate();

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get(API_BASE_URL + "/api/packages/admin/all", cfg());
      setPackages(data.packages || []);
    } catch (err) {
      if (err.response?.status === 403) navigate("/dashboard");
      else setError("Failed to load packages.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    await axios.put(`${API_BASE_URL}/api/packages/admin/${id}`, { isActive: !isActive }, cfg());
    fetchPackages();
  };
  const deletePkg = async (id) => {
    if (!window.confirm("Delete this package? This cannot be undone.")) return;
    await axios.delete(`${API_BASE_URL}/api/packages/admin/${id}`, cfg());
    fetchPackages();
  };
  const savePkg = async (form) => {
    const payload = {
      name: form.name, nameAr: form.nameAr || form.name,
      description: form.description, descriptionAr: form.descriptionAr || form.description,
      price: Number(form.price), duration: Number(form.duration),
      maxAccounts: Number(form.maxAccounts), maxPostsPerDay: Number(form.maxPostsPerDay),
      maxProducts: Number(form.maxProducts), isPopular: form.isPopular, isActive: form.isActive,
      services: (form.services || []).map((t) => ({ type: t, name: t, nameAr: t, enabled: true })),
      features: [],
    };
    if (modal.mode === "edit") {
      await axios.put(`${API_BASE_URL}/api/packages/admin/${modal.pkg._id}`, payload, cfg());
    } else {
      await axios.post(`${API_BASE_URL}/api/packages/admin/create`, payload, cfg());
    }
    setModal(null);
    fetchPackages();
  };

  return (
    <div>
      <PageHeader
        title="Packages"
        subtitle="Create and manage subscription plans"
        actions={<Button onClick={() => setModal({ mode: "create", pkg: emptyPkg })}><FaPlus /> New package</Button>}
      />

      {error && (
        <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
          <span style={{ color: "var(--ss-danger)" }}>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : packages.length === 0 ? (
        <EmptyState icon={FaStar} title="No packages yet" description="Create your first subscription plan." action={<Button onClick={() => setModal({ mode: "create", pkg: emptyPkg })}><FaPlus /> New package</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <motion.div key={pkg._id} layout className="ss-card ss-card-pad" style={{ opacity: pkg.isActive ? 1 : 0.6 }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{pkg.name}</h3>
                    {pkg.isPopular && <Badge variant="accent"><FaStar /> Popular</Badge>}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "var(--ss-text-muted)" }}>{pkg.description}</p>
                </div>
                <Badge variant={pkg.isActive ? "success" : "warning"}>{pkg.isActive ? "Active" : "Hidden"}</Badge>
              </div>
              <div className="my-3">
                <span className="text-2xl font-extrabold">{pkg.price}</span>
                <span className="text-sm" style={{ color: "var(--ss-text-muted)" }}> / {pkg.duration}d</span>
              </div>
              <div className="text-sm space-y-1" style={{ color: "var(--ss-text-muted)" }}>
                <div>Accounts: {pkg.maxAccounts ?? "—"} · Posts/day: {pkg.maxPostsPerDay ?? "—"}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="secondary" onClick={() => setModal({ mode: "edit", pkg })}><FaEdit /> Edit</Button>
                <Button variant="ghost" onClick={() => toggleActive(pkg._id, pkg.isActive)}>{pkg.isActive ? <><FaEyeSlash /> Hide</> : <><FaEye /> Show</>}</Button>
                <Button variant="ghost" className="!text-red-500" onClick={() => deletePkg(pkg._id)}><FaTrash /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && <PackageModal mode={modal.mode} initial={modal.pkg} onClose={() => setModal(null)} onSave={savePkg} />}
      </AnimatePresence>
    </div>
  );
}

function PackageModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState({ ...emptyPkg, ...initial, services: (initial.services || []).map((s) => (typeof s === "object" ? s.type : s)) });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleService = (t) =>
    setForm((p) => ({ ...p, services: p.services.includes(t) ? p.services.filter((x) => x !== t) : [...p.services, t] }));

  const submit = async () => {
    setErr("");
    if (!form.name || !form.description || form.price === "") {
      setErr("Name, description and price are required.");
      return;
    }
    try {
      setSaving(true);
      await onSave(form);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save package.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div className="ss-card ss-card-pad relative w-full max-w-lg max-h-[90vh] overflow-y-auto" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{mode === "edit" ? "Edit package" : "New package"}</h3>
          <Button variant="ghost" className="!px-2.5" onClick={onClose}><FaTimes /></Button>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-4">
          <Field label="Name (EN)" required><input className="ss-input" value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Name (AR)"><input className="ss-input" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} /></Field>
        </div>
        <Field label="Description (EN)" required><input className="ss-input" value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label="Description (AR)"><input className="ss-input" value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} /></Field>

        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-4">
          <Field label="Price" required><input className="ss-input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
          <Field label="Duration (days)"><input className="ss-input" type="number" value={form.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
          <Field label="Max accounts"><input className="ss-input" type="number" value={form.maxAccounts} onChange={(e) => set("maxAccounts", e.target.value)} /></Field>
          <Field label="Max posts / day"><input className="ss-input" type="number" value={form.maxPostsPerDay} onChange={(e) => set("maxPostsPerDay", e.target.value)} /></Field>
          <Field label="Max products"><input className="ss-input" type="number" value={form.maxProducts} onChange={(e) => set("maxProducts", e.target.value)} /></Field>
        </div>

        <Field label="Included services">
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleService(t)}
                className="ss-badge"
                style={form.services.includes(t) ? { background: "var(--ss-accent-soft)", color: "var(--ss-accent-700)", borderColor: "#e0e7ff" } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex gap-4 my-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPopular} onChange={(e) => set("isPopular", e.target.checked)} /> Popular</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Active</label>
        </div>

        {err && <div className="ss-error mb-3">{err}</div>}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={submit}>{mode === "edit" ? "Save changes" : "Create package"}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
