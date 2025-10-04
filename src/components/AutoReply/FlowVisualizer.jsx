import { useState } from "react";
import FlowChart from "./FlowChart";
import FlowDiagramVisual from "./FlowDiagramVisual";
import FlowMermaid from "./FlowMermaid";
import {
  FaPlay,
  FaPause,
  FaArrowRight,
  FaArrowDown,
  FaChartLine,
  FaSitemap,
  FaCode,
} from "react-icons/fa";

const FlowVisualizer = ({ flow }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState("list"); // "list", "chart", "diagram", "mermaid"

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

  const getStepColor = (stepType, isActive, isCompleted) => {
    if (isCompleted) return "bg-green-500";
    if (isActive) return "bg-blue-500";

    switch (stepType) {
      case "immediate_reply":
        return "bg-green-400";
      case "delayed_reply":
        return "bg-yellow-400";
      case "conditional_reply":
        return "bg-purple-400";
      case "end":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const animateFlow = () => {
    if (!flow || !flow.flowSteps) return;

    setIsAnimating(true);
    setCurrentStep(0);

    const executeStep = (stepIndex) => {
      if (stepIndex >= flow.flowSteps.length) {
        setIsAnimating(false);
        return;
      }

      setCurrentStep(stepIndex + 1);

      // Simulate delay based on step type
      const step = flow.flowSteps[stepIndex];
      const delay = step.stepType === "delayed_reply" ? step.delay * 100 : 2000; // Faster for demo

      setTimeout(() => {
        executeStep(stepIndex + 1);
      }, delay);
    };

    executeStep(0);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  if (!flow || !flow.flowSteps) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <p>No flow selected or flow has no steps</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Flow Visualization</h3>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                viewMode === "chart"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaChartLine />
              Chart View
            </button>
            <button
              onClick={() => setViewMode("diagram")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                viewMode === "diagram"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaSitemap />
              Diagram View
            </button>
            <button
              onClick={() => setViewMode("mermaid")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                viewMode === "mermaid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaCode />
              Mermaid View
            </button>
          </div>
          {!isAnimating ? (
            <button
              onClick={animateFlow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlay />
              Animate Flow
            </button>
          ) : (
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaPause />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Flow Visualization */}
      {viewMode === "chart" ? (
        <FlowChart flow={flow} />
      ) : viewMode === "diagram" ? (
        <FlowDiagramVisual flow={flow} />
      ) : viewMode === "mermaid" ? (
        <FlowMermaid flow={flow} />
      ) : (
        <div className="space-y-6">
          {flow.flowSteps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            const isWaiting = currentStep < index + 1;

            return (
              <div key={step.stepNumber} className="relative">
                {/* Step Node */}
                <div className="flex items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-500 ${
                      isActive
                        ? "scale-110 shadow-lg ring-4 ring-blue-300"
                        : isCompleted
                        ? "scale-105"
                        : "scale-100"
                    } ${getStepColor(step.stepType, isActive, isCompleted)}`}
                  >
                    {getStepIcon(step.stepType)}
                  </div>
                </div>

                {/* Step Info */}
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-gray-800">
                    Step {step.stepNumber}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {step.stepType.replace("_", " ")}
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {step.replyContent}
                    </p>
                    {step.delay > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Delay: {step.delay} minutes
                      </p>
                    )}
                    {step.condition !== "always" && (
                      <p className="text-xs text-gray-500 mt-1">
                        If: {step.condition} = "{step.conditionValue}"
                      </p>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-2">
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                        🔄 Executing...
                      </span>
                    )}
                    {isWaiting && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        ⏳ Waiting
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow to next step */}
                {index < flow.flowSteps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="flex flex-col items-center">
                      <FaArrowDown className="text-gray-400 text-xl" />
                      {step.nextStep &&
                        step.nextStep !== step.stepNumber + 1 && (
                          <span className="text-xs text-gray-500 mt-1">
                            → Step {step.nextStep}
                          </span>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Flow Summary */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Flow Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Total Steps:</span>
            <span className="ml-1">{flow.flowSteps.length}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Platform:</span>
            <span className="ml-1">{flow.platform}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Keywords:</span>
            <span className="ml-1">{flow.triggerKeywords?.length || 0}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Status:</span>
            <span
              className={`ml-1 ${
                flow.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {flow.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowVisualizer;
