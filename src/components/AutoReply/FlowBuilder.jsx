import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlay,
  FaPause,
  FaArrowRight,
  FaCog,
} from "react-icons/fa";

const FlowBuilder = ({ isOpen, onClose, onSave, editingFlow }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "All",
    triggerKeywords: [],
    triggerConditions: {
      type: "keyword",
      value: "",
    },
    flowSteps: [],
    settings: {
      maxRepliesPerUser: 3,
      cooldownPeriod: 24,
      workingHours: {
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
        timezone: "UTC",
      },
    },
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingFlow) {
      setFormData(editingFlow);
    } else {
      // Reset form for new flow
      setFormData({
        name: "",
        description: "",
        platform: "All",
        triggerKeywords: [],
        triggerConditions: {
          type: "keyword",
          value: "",
        },
        flowSteps: [],
        settings: {
          maxRepliesPerUser: 3,
          cooldownPeriod: 24,
          workingHours: {
            enabled: false,
            startTime: "09:00",
            endTime: "17:00",
            timezone: "UTC",
          },
        },
      });
    }
  }, [editingFlow, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleAddKeyword = () => {
    if (
      newKeyword.trim() &&
      !formData.triggerKeywords.includes(newKeyword.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        triggerKeywords: [...prev.triggerKeywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      triggerKeywords: prev.triggerKeywords.filter((k) => k !== keyword),
    }));
  };

  const handleAddStep = () => {
    const newStep = {
      stepNumber: formData.flowSteps.length + 1,
      stepType: "immediate_reply",
      delay: 0,
      condition: "always",
      conditionValue: "",
      replyContent: "",
      replyImage: "",
      nextStep: null,
      isEndStep: false,
    };

    setFormData((prev) => ({
      ...prev,
      flowSteps: [...prev.flowSteps, newStep],
    }));
  };

  const handleUpdateStep = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      flowSteps: prev.flowSteps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  };

  const handleRemoveStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      flowSteps: prev.flowSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          stepNumber: i + 1,
        })),
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a flow name");
      return;
    }

    if (formData.flowSteps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const url = editingFlow
        ? `https://www.sushiluha.com/api/auto-reply/flows/${editingFlow._id}`
        : "https://www.sushiluha.com/api/auto-reply/flows";

      const method = editingFlow ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving flow:", error);
      alert("Failed to save flow");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case "immediate_reply":
        return "⚡";
      case "delayed_reply":
        return "⏰";
      case "conditional_reply":
        return "❓";
      case "end":
        return "🏁";
      default:
        return "📝";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4 pt-20">
      <div className="premium-panel max-w-6xl w-full max-h-[85vh] overflow-y-auto mt-16 rounded-2xl scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
            <h3 className="text-3xl font-black text-white">
              {editingFlow ? "Edit Flow" : "Create New Flow"}
            </h3>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors text-2xl"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Flow Settings */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                <h4 className="text-xl font-bold text-white mb-6">
                  Basic Information
                </h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Flow Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter flow name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      placeholder="Describe this flow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) =>
                        handleInputChange("platform", e.target.value)
                      }
                      className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-slate-900"
                    >
                      <option value="All">All Platforms</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Facebook">Facebook</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Telegram">Telegram</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trigger Keywords */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                <h4 className="text-xl font-bold text-white mb-6">
                  Trigger Keywords
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddKeyword()
                      }
                      className="flex-1 p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Add keyword"
                    />
                    <button
                      onClick={handleAddKeyword}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.triggerKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm font-bold rounded-full flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="text-purple-400 hover:text-white transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                <h4 className="text-xl font-bold text-white mb-6">
                  Settings
                </h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Max Replies Per User
                    </label>
                    <input
                      type="number"
                      value={formData.settings.maxRepliesPerUser}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "settings",
                          "maxRepliesPerUser",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Cooldown Period (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.settings.cooldownPeriod}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "settings",
                          "cooldownPeriod",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Flow Steps */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold text-white">
                  Flow Steps
                </h4>
                <button
                  onClick={handleAddStep}
                  className="px-5 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg flex items-center gap-2 font-bold"
                >
                  <FaPlus />
                  Add Step
                </button>
              </div>

              {formData.flowSteps.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-white/60">No steps added yet. Click "Add Step" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.flowSteps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {getStepIcon(step.stepType)}
                          </span>
                          <span className="text-xl font-bold text-white">
                            Step {step.stepNumber}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveStep(index)}
                          className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 p-2 rounded-lg transition-all"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Step Type
                          </label>
                          <select
                            value={step.stepType}
                            onChange={(e) =>
                              handleUpdateStep(
                                index,
                                "stepType",
                                e.target.value
                              )
                            }
                            className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-slate-900"
                          >
                            <option value="immediate_reply">
                              Immediate Reply
                            </option>
                            <option value="delayed_reply">Delayed Reply</option>
                            <option value="conditional_reply">
                              Conditional Reply
                            </option>
                            <option value="end">End Flow</option>
                          </select>
                        </div>

                        {step.stepType === "delayed_reply" && (
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Delay (minutes)
                            </label>
                            <input
                              type="number"
                              value={step.delay}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "delay",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              min="0"
                            />
                          </div>
                        )}

                        {step.stepType === "conditional_reply" && (
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Condition
                            </label>
                            <select
                              value={step.condition}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "condition",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-slate-900"
                            >
                              <option value="always">Always</option>
                              <option value="contains_keyword">
                                Contains Keyword
                              </option>
                              <option value="time_based">Time Based</option>
                              <option value="sender_based">Sender Based</option>
                            </select>
                            {step.condition !== "always" && (
                              <input
                                type="text"
                                value={step.conditionValue}
                                onChange={(e) =>
                                  handleUpdateStep(
                                    index,
                                    "conditionValue",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mt-3"
                                placeholder="Condition value"
                              />
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Reply Content *
                          </label>
                          <textarea
                            value={step.replyContent}
                            onChange={(e) =>
                              handleUpdateStep(
                                index,
                                "replyContent",
                                e.target.value
                              )
                            }
                            className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                            placeholder="Enter reply message"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Image URL (optional)
                          </label>
                          <input
                            type="url"
                            value={step.replyImage}
                            onChange={(e) =>
                              handleUpdateStep(
                                index,
                                "replyImage",
                                e.target.value
                              )
                            }
                            className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        {!step.isEndStep && (
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Next Step
                            </label>
                            <input
                              type="number"
                              value={step.nextStep || ""}
                              onChange={(e) =>
                                handleUpdateStep(
                                  index,
                                  "nextStep",
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : null
                                )
                              }
                              className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Step number"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/10 rounded-xl">
                          <input
                            type="checkbox"
                            id={`endStep-${index}`}
                            checked={step.isEndStep}
                            onChange={(e) =>
                              handleUpdateStep(
                                index,
                                "isEndStep",
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor={`endStep-${index}`}
                            className="text-sm font-bold text-white cursor-pointer"
                          >
                            This is the end step
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-3 font-bold shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {editingFlow ? "Update Flow" : "Create Flow"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
