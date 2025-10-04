import { useState } from "react";
import FlowVisualizer from "./FlowVisualizer";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaEye,
} from "react-icons/fa";

const FlowDiagram = ({ flow, onEdit, onDelete, onToggle }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [showVisualizer, setShowVisualizer] = useState(false);

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

  const getStepColor = (stepType) => {
    switch (stepType) {
      case "immediate_reply":
        return "bg-green-100 border-green-500 text-green-800";
      case "delayed_reply":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "conditional_reply":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "end":
        return "bg-gray-100 border-gray-500 text-gray-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Flow Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{flow.name}</h3>
          <p className="text-gray-600 text-sm">{flow.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                flow.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {flow.isActive ? "Active" : "Inactive"}
            </span>
            <span className="text-xs text-gray-500">
              Platform: {flow.platform}
            </span>
            <span className="text-xs text-gray-500">
              Triggers: {flow.triggerKeywords?.length || 0}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200"
            title="Visualize Flow"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onToggle(flow._id, !flow.isActive)}
            className={`p-2 rounded-lg ${
              flow.isActive
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={flow.isActive ? "Deactivate" : "Activate"}
          >
            {flow.isActive ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={() => onEdit(flow)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Edit Flow"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(flow._id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
            title="Delete Flow"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Flow Steps */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Flow Steps</h4>

        {flow.flowSteps?.map((step, index) => (
          <div key={step.stepNumber} className="relative">
            {/* Step Card */}
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedStep === step.stepNumber
                  ? "ring-2 ring-blue-500"
                  : getStepColor(step.stepType)
              }`}
              onClick={() =>
                setSelectedStep(
                  selectedStep === step.stepNumber ? null : step.stepNumber
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getStepIcon(step.stepType)}</div>
                  <div>
                    <h5 className="font-medium">
                      Step {step.stepNumber}:{" "}
                      {step.stepType.replace("_", " ").toUpperCase()}
                    </h5>
                    <p className="text-sm opacity-75 line-clamp-2">
                      {step.replyContent}
                    </p>
                    {step.delay > 0 && (
                      <p className="text-xs opacity-60 mt-1">
                        Delay: {step.delay} minutes
                      </p>
                    )}
                    {step.condition !== "always" && (
                      <p className="text-xs opacity-60 mt-1">
                        Condition: {step.condition} = {step.conditionValue}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-60">
                    {step.isEndStep
                      ? "END"
                      : `→ Step ${step.nextStep || step.stepNumber + 1}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow to next step */}
            {index < flow.flowSteps.length - 1 && (
              <div className="flex justify-center my-2">
                <FaArrowRight className="text-gray-400" />
              </div>
            )}
          </div>
        ))}

        {/* Add Step Button */}
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
          <FaPlus />
          Add New Step
        </button>
      </div>

      {/* Flow Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {flow.statistics?.totalTriggers || 0}
            </div>
            <div className="text-xs text-gray-600">Total Triggers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {flow.statistics?.totalReplies || 0}
            </div>
            <div className="text-xs text-gray-600">Total Replies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {flow.flowSteps?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {flow.triggerKeywords?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Keywords</div>
          </div>
        </div>
      </div>

      {/* Trigger Keywords */}
      {flow.triggerKeywords && flow.triggerKeywords.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Trigger Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {flow.triggerKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flow Visualizer */}
      {showVisualizer && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <FlowVisualizer flow={flow} />
        </div>
      )}
    </div>
  );
};

export default FlowDiagram;
