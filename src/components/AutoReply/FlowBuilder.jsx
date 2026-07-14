import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaSave, FaTimes, FaShoppingBag, FaRobot } from "react-icons/fa";
import { Button, Badge, Field } from "../ui/kit";

const defaultFlowData = {
  name: "",
  description: "",
  platform: "All",
  triggerKeywords: [],
  triggerConditions: { type: "keyword", value: "" },
  flowSteps: [],
  settings: {
    maxRepliesPerUser: 3,
    cooldownPeriod: 24,
    workingHours: { enabled: false, startTime: "09:00", endTime: "17:00", timezone: "UTC" },
    catalog: {
      enabled: true,
      prompt: "إذا بتحب تشوف الكتالوج اكتب كتالوج أو منتجات.",
      triggerKeywords: ["كتالوج", "كاتلوج", "منتجات", "catalog", "products"],
      maxProducts: 8,
    },
  },
};

const createFlowData = (flow = {}) => ({
  ...defaultFlowData,
  ...flow,
  triggerKeywords: flow.triggerKeywords || defaultFlowData.triggerKeywords,
  triggerConditions: { ...defaultFlowData.triggerConditions, ...(flow.triggerConditions || {}) },
  flowSteps: flow.flowSteps || defaultFlowData.flowSteps,
  settings: {
    ...defaultFlowData.settings,
    ...(flow.settings || {}),
    workingHours: { ...defaultFlowData.settings.workingHours, ...(flow.settings?.workingHours || {}) },
    catalog: {
      ...defaultFlowData.settings.catalog,
      ...(flow.settings?.catalog || {}),
      triggerKeywords: flow.settings?.catalog?.triggerKeywords || defaultFlowData.settings.catalog.triggerKeywords,
    },
  },
});

const STEP_ICON = {
  immediate_reply: "⚡",
  delayed_reply: "⏰",
  conditional_reply: "❓",
  ai_reply: "🤖",
  end: "🏁",
};

export default function FlowBuilder({ isOpen, onClose, onSave, editingFlow, draftMode = false, title, saveLabel }) {
  const [formData, setFormData] = useState(createFlowData());
  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(createFlowData(editingFlow || undefined));
    setError("");
  }, [editingFlow, isOpen]);

  const setField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const setNested = (parent, field, value) =>
    setFormData((p) => ({ ...p, [parent]: { ...p[parent], [field]: value } }));
  const setCatalog = (field, value) =>
    setFormData((p) => ({ ...p, settings: { ...p.settings, catalog: { ...p.settings.catalog, [field]: value } } }));

  const addKeyword = () => {
    const k = newKeyword.trim();
    if (k && !formData.triggerKeywords.includes(k)) {
      setFormData((p) => ({ ...p, triggerKeywords: [...p.triggerKeywords, k] }));
      setNewKeyword("");
    }
  };
  const removeKeyword = (keyword) =>
    setFormData((p) => ({ ...p, triggerKeywords: p.triggerKeywords.filter((k) => k !== keyword) }));

  const addStep = () =>
    setFormData((p) => ({
      ...p,
      flowSteps: [
        ...p.flowSteps,
        {
          stepNumber: p.flowSteps.length + 1,
          stepType: "immediate_reply",
          delay: 0,
          condition: "always",
          conditionValue: "",
          replyContent: "",
          replyImage: "",
          useAI: false,
          aiPrompt: "",
          aiIncludeProducts: false,
          nextStep: null,
          isEndStep: false,
        },
      ],
    }));
  const updateStep = (index, field, value) =>
    setFormData((p) => ({
      ...p,
      flowSteps: p.flowSteps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  const removeStep = (index) =>
    setFormData((p) => ({
      ...p,
      flowSteps: p.flowSteps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })),
    }));

  const handleSave = async () => {
    setError("");
    if (!formData.name.trim()) return setError("Please enter a flow name.");
    if (formData.flowSteps.length === 0) return setError("Please add at least one step.");
    const hasEmptyReply = formData.flowSteps.some(
      (s) => s.stepType !== "end" && s.stepType !== "ai_reply" && !s.replyContent?.trim()
    );
    if (hasEmptyReply) return setError("Please enter reply content for every reply step.");

    if (draftMode) {
      onSave({ ...formData, enabled: true });
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const url = editingFlow
        ? `${API_BASE_URL}/api/auto-reply/flows/${editingFlow._id}`
        : API_BASE_URL + "/api/auto-reply/flows";
      const response = await axios({
        method: editingFlow ? "PUT" : "POST",
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      onSave(response.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save flow.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="ss-card relative w-full max-w-5xl"
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--ss-border)" }}>
              <h3 className="text-xl font-extrabold">{title || (editingFlow ? "Edit Flow" : "Create New Flow")}</h3>
              <Button variant="ghost" className="!px-2.5" onClick={onClose}><FaTimes /></Button>
            </div>

            <div className="p-5 grid gap-5 lg:grid-cols-2">
              {/* Left column */}
              <div className="space-y-4">
                <section className="rounded-xl border p-4" style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}>
                  <h4 className="font-bold mb-3">Basic information</h4>
                  <Field label="Flow name" required>
                    <input className="ss-input" value={formData.name} onChange={(e) => setField("name", e.target.value)} placeholder="Enter flow name" />
                  </Field>
                  <Field label="Description">
                    <textarea className="ss-textarea" rows={2} value={formData.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe this flow" />
                  </Field>
                  <Field label="Platform">
                    <select className="ss-select" value={formData.platform} onChange={(e) => setField("platform", e.target.value)}>
                      {["All", "Facebook", "Instagram", "WhatsApp", "Telegram", "TikTok", "Twitter", "LinkedIn"].map((p) => (
                        <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>
                      ))}
                    </select>
                  </Field>
                </section>

                <section className="rounded-xl border p-4" style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}>
                  <h4 className="font-bold mb-3">Trigger keywords</h4>
                  <div className="flex gap-2">
                    <input
                      className="ss-input"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      placeholder="Add keyword and press Enter"
                    />
                    <Button type="button" onClick={addKeyword} className="!px-3"><FaPlus /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.triggerKeywords.map((k, i) => (
                      <span key={i} className="ss-badge ss-badge-accent">
                        {k}
                        <button onClick={() => removeKeyword(k)} className="ml-1" aria-label={`Remove ${k}`}><FaTimes /></button>
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border p-4" style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}>
                  <h4 className="font-bold mb-3">Settings</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Max replies / user">
                      <input type="number" min="1" max="10" className="ss-input" value={formData.settings.maxRepliesPerUser}
                        onChange={(e) => setNested("settings", "maxRepliesPerUser", parseInt(e.target.value) || 1)} />
                    </Field>
                    <Field label="Cooldown (hours)">
                      <input type="number" min="1" max="168" className="ss-input" value={formData.settings.cooldownPeriod}
                        onChange={(e) => setNested("settings", "cooldownPeriod", parseInt(e.target.value) || 1)} />
                    </Field>
                  </div>
                </section>

                <section className="rounded-xl border p-4" style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FaShoppingBag style={{ color: "var(--ss-accent)" }} />
                    <h4 className="font-bold">Catalog offer</h4>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <input type="checkbox" checked={formData.settings.catalog.enabled} onChange={(e) => setCatalog("enabled", e.target.checked)} className="h-4 w-4" />
                    Ask for catalog at the end of this flow
                  </label>
                  {formData.settings.catalog.enabled && (
                    <>
                      <Field label="End message">
                        <textarea className="ss-textarea" rows={2} value={formData.settings.catalog.prompt} onChange={(e) => setCatalog("prompt", e.target.value)} />
                      </Field>
                      <Field label="Catalog trigger words (comma-separated)">
                        <input className="ss-input" value={formData.settings.catalog.triggerKeywords.join(", ")}
                          onChange={(e) => setCatalog("triggerKeywords", e.target.value.split(",").map((w) => w.trim()).filter(Boolean))} />
                      </Field>
                      <Field label="Max products to send">
                        <input type="number" min="1" max="20" className="ss-input" value={formData.settings.catalog.maxProducts}
                          onChange={(e) => setCatalog("maxProducts", Math.max(1, parseInt(e.target.value) || 1))} />
                      </Field>
                    </>
                  )}
                </section>
              </div>

              {/* Right column - steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Flow steps</h4>
                  <Button type="button" variant="secondary" onClick={addStep}><FaPlus /> Add step</Button>
                </div>

                {formData.flowSteps.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-10 text-center text-sm" style={{ borderColor: "var(--ss-border)", color: "var(--ss-text-muted)" }}>
                    No steps yet. Click “Add step” to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.flowSteps.map((step, index) => (
                      <motion.div key={index} layout className="rounded-xl border p-4" style={{ borderColor: "var(--ss-border)" }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{STEP_ICON[step.stepType] || "📝"}</span>
                            <span className="font-bold">Step {step.stepNumber}</span>
                          </div>
                          <Button variant="ghost" className="!px-2.5 !text-red-500" onClick={() => removeStep(index)}><FaTrash /></Button>
                        </div>

                        <Field label="Step type">
                          <select className="ss-select" value={step.stepType} onChange={(e) => updateStep(index, "stepType", e.target.value)}>
                            <option value="immediate_reply">Immediate reply</option>
                            <option value="delayed_reply">Delayed reply</option>
                            <option value="conditional_reply">Conditional reply</option>
                            <option value="ai_reply">AI reply</option>
                            <option value="end">End flow</option>
                          </select>
                        </Field>

                        {step.stepType === "delayed_reply" && (
                          <Field label="Delay (minutes)">
                            <input type="number" min="0" className="ss-input" value={step.delay} onChange={(e) => updateStep(index, "delay", parseInt(e.target.value) || 0)} />
                          </Field>
                        )}

                        {step.stepType === "conditional_reply" && (
                          <Field label="Condition">
                            <select className="ss-select" value={step.condition} onChange={(e) => updateStep(index, "condition", e.target.value)}>
                              <option value="always">Always</option>
                              <option value="contains_keyword">Contains keyword</option>
                              <option value="time_based">Time based</option>
                              <option value="sender_based">Sender based</option>
                            </select>
                            {step.condition !== "always" && (
                              <input className="ss-input mt-2" value={step.conditionValue} onChange={(e) => updateStep(index, "conditionValue", e.target.value)} placeholder="Condition value" />
                            )}
                          </Field>
                        )}

                        {step.stepType === "ai_reply" ? (
                          <>
                            <div className="mb-2"><Badge variant="accent"><FaRobot /> AI generates the reply</Badge></div>
                            <Field label="AI instructions (optional)">
                              <textarea className="ss-textarea" rows={2} value={step.aiPrompt || ""} onChange={(e) => updateStep(index, "aiPrompt", e.target.value)} placeholder="e.g. Answer politely and suggest a product." />
                            </Field>
                            <label className="flex items-center gap-2 text-sm mb-3">
                              <input type="checkbox" checked={!!step.aiIncludeProducts} onChange={(e) => updateStep(index, "aiIncludeProducts", e.target.checked)} className="h-4 w-4" />
                              Give the AI access to the product catalog
                            </label>
                          </>
                        ) : step.stepType !== "end" ? (
                          <Field label="Reply content" required>
                            <textarea className="ss-textarea" rows={3} value={step.replyContent} onChange={(e) => updateStep(index, "replyContent", e.target.value)} placeholder="Enter reply message" />
                          </Field>
                        ) : null}

                        {step.stepType !== "end" && (
                          <Field label="Image URL (optional)">
                            <input type="url" className="ss-input" value={step.replyImage} onChange={(e) => updateStep(index, "replyImage", e.target.value)} placeholder="https://example.com/image.jpg" />
                          </Field>
                        )}

                        {!step.isEndStep && step.stepType !== "end" && (
                          <Field label="Next step (optional)">
                            <input type="number" className="ss-input" value={step.nextStep || ""} onChange={(e) => updateStep(index, "nextStep", e.target.value ? parseInt(e.target.value) : null)} placeholder="Step number" />
                          </Field>
                        )}

                        <label className="flex items-center gap-2 text-sm font-medium mt-1">
                          <input type="checkbox" checked={step.isEndStep} onChange={(e) => updateStep(index, "isEndStep", e.target.checked)} className="h-4 w-4" />
                          This is the end step
                        </label>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-5" style={{ borderColor: "var(--ss-border)" }}>
              {error && <div className="ss-error mb-3">{error}</div>}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} loading={isLoading}>
                  <FaSave /> {saveLabel || (editingFlow ? "Update flow" : "Create flow")}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
