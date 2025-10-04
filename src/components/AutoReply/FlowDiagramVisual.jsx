import { useState } from "react";
import { FaPlay, FaPause, FaArrowRight, FaArrowDown } from "react-icons/fa";

const FlowDiagramVisual = ({ flow }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
        <h3 className="text-xl font-bold text-gray-800">Flow Diagram</h3>
        <div className="flex gap-2">
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

      {/* Flow Diagram */}
      <div className="relative">
        {/* Start Node */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            🚀
          </div>
        </div>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Start</p>
        </div>

        {/* Flow Steps */}
        <div className="space-y-8">
          {flow.flowSteps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            const isWaiting = currentStep < index + 1;
            
            return (
              <div key={step.stepNumber} className="relative">
                {/* Arrow from previous step */}
                {index > 0 && (
                  <div className="flex justify-center mb-4">
                    <FaArrowDown className="text-gray-400 text-2xl" />
                  </div>
                )}

                {/* Step Node */}
                <div className="flex justify-center">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all duration-500 ${
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
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Step {step.stepNumber}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">
                    {step.stepType.replace("_", " ")}
                  </p>
                  
                  {/* Status Badge */}
                  <div className="mb-3">
                    {isCompleted && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 animate-pulse">
                        🔄 Executing...
                      </span>
                    )}
                    {isWaiting && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        ⏳ Waiting
                      </span>
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      {step.replyContent}
                    </p>
                    {step.delay > 0 && (
                      <p className="text-xs text-gray-500">
                        ⏰ Delay: {step.delay} minutes
                      </p>
                    )}
                    {step.condition !== "always" && (
                      <p className="text-xs text-gray-500">
                        🔍 If: {step.condition} = "{step.conditionValue}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End Node */}
        <div className="flex justify-center mt-8">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            🏁
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">End</p>
        </div>
      </div>

      {/* Flow Summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Flow Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {flow.flowSteps.length}
            </div>
            <div className="text-gray-600">Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {flow.platform}
            </div>
            <div className="text-gray-600">Platform</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {flow.triggerKeywords?.length || 0}
            </div>
            <div className="text-gray-600">Keywords</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${flow.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {flow.isActive ? 'ON' : 'OFF'}
            </div>
            <div className="text-gray-600">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowDiagramVisual;
