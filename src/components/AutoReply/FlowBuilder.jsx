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
        ? `http://localhost:5000/api/auto-reply/flows/${editingFlow._id}`
        : "http://localhost:5000/api/auto-reply/flows";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {editingFlow ? "Edit Flow" : "Create New Flow"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Flow Settings */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flow Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter flow name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Describe this flow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) =>
                        handleInputChange("platform", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Trigger Keywords
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddKeyword()
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add keyword"
                    />
                    <button
                      onClick={handleAddKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.triggerKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Flow Steps */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  Flow Steps
                </h4>
                <button
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FaPlus />
                  Add Step
                </button>
              </div>

              {formData.flowSteps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No steps added yet. Click "Add Step" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.flowSteps.map((step, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getStepIcon(step.stepType)}
                          </span>
                          <span className="font-medium">
                            Step {step.stepNumber}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveStep(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          </div>
                        )}

                        {step.stepType === "conditional_reply" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                placeholder="Condition value"
                              />
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Enter reply message"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        {!step.isEndStep && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Step number"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
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
                            className="rounded"
                          />
                          <label
                            htmlFor={`endStep-${index}`}
                            className="text-sm font-medium text-gray-700"
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
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
