import { useState } from "react";
import { FaPlay, FaPause, FaArrowRight, FaArrowDown } from "react-icons/fa";

const FlowSVG = ({ flow }) => {
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
    if (isCompleted) return "#10B981";
    if (isActive) return "#3B82F6";
    
    switch (stepType) {
      case "immediate_reply":
        return "#10B981";
      case "delayed_reply":
        return "#F59E0B";
      case "conditional_reply":
        return "#8B5CF6";
      case "end":
        return "#6B7280";
      default:
        return "#9CA3AF";
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

  const svgWidth = 800;
  const svgHeight = 600;
  const nodeWidth = 120;
  const nodeHeight = 80;
  const nodeSpacing = 150;
  const startY = 50;
  const stepY = startY + 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Flow SVG Diagram</h3>
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

      {/* SVG Flow Diagram */}
      <div className="flex justify-center mb-6">
        <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded-lg">
          {/* Start Node */}
          <circle
            cx={svgWidth / 2}
            cy={startY}
            r="30"
            fill="#3B82F6"
            stroke="#1E40AF"
            strokeWidth="3"
            className="transition-all duration-500"
          />
          <text
            x={svgWidth / 2}
            y={startY + 5}
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            🚀
          </text>
          <text
            x={svgWidth / 2}
            y={startY + 40}
            textAnchor="middle"
            fill="#374151"
            fontSize="12"
            fontWeight="bold"
          >
            Start
          </text>

          {/* Flow Steps */}
          {flow.flowSteps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            const isWaiting = currentStep < index + 1;
            
            const x = svgWidth / 2;
            const y = stepY + (index * nodeSpacing);
            const color = getStepColor(step.stepType, isActive, isCompleted);
            
            return (
              <g key={step.stepNumber}>
                {/* Arrow from previous step */}
                {index > 0 && (
                  <line
                    x1={x}
                    y1={stepY + ((index - 1) * nodeSpacing) + nodeHeight / 2}
                    x2={x}
                    y2={y - nodeHeight / 2}
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                )}

                {/* Step Node */}
                <rect
                  x={x - nodeWidth / 2}
                  y={y - nodeHeight / 2}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="10"
                  ry="10"
                  fill={color}
                  stroke={isActive ? "#3B82F6" : "#374151"}
                  strokeWidth={isActive ? "3" : "2"}
                  className={`transition-all duration-500 ${
                    isActive ? "drop-shadow-lg" : ""
                  }`}
                />

                {/* Step Icon */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                >
                  {getStepIcon(step.stepType)}
                </text>

                {/* Step Number */}
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Step {step.stepNumber}
                </text>

                {/* Step Type */}
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {step.stepType.replace("_", " ").toUpperCase()}
                </text>

                {/* Status Indicator */}
                {isCompleted && (
                  <circle
                    cx={x + nodeWidth / 2 - 15}
                    cy={y - nodeHeight / 2 + 15}
                    r="8"
                    fill="#10B981"
                  />
                )}
                {isActive && (
                  <circle
                    cx={x + nodeWidth / 2 - 15}
                    cy={y - nodeHeight / 2 + 15}
                    r="8"
                    fill="#3B82F6"
                    className="animate-pulse"
                  />
                )}
                {isWaiting && (
                  <circle
                    cx={x + nodeWidth / 2 - 15}
                    cy={y - nodeHeight / 2 + 15}
                    r="8"
                    fill="#9CA3AF"
                  />
                )}

                {/* Status Text */}
                {isCompleted && (
                  <text
                    x={x + nodeWidth / 2 - 15}
                    y={y - nodeHeight / 2 + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
                {isActive && (
                  <text
                    x={x + nodeWidth / 2 - 15}
                    y={y - nodeHeight / 2 + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    🔄
                  </text>
                )}
                {isWaiting && (
                  <text
                    x={x + nodeWidth / 2 - 15}
                    y={y - nodeHeight / 2 + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    ⏳
                  </text>
                )}
              </g>
            );
          })}

          {/* End Node */}
          <circle
            cx={svgWidth / 2}
            cy={stepY + (flow.flowSteps.length * nodeSpacing)}
            r="30"
            fill="#6B7280"
            stroke="#4B5563"
            strokeWidth="3"
          />
          <text
            x={svgWidth / 2}
            y={stepY + (flow.flowSteps.length * nodeSpacing) + 5}
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            🏁
          </text>
          <text
            x={svgWidth / 2}
            y={stepY + (flow.flowSteps.length * nodeSpacing) + 40}
            textAnchor="middle"
            fill="#374151"
            fontSize="12"
            fontWeight="bold"
          >
            End
          </text>

          {/* Arrow from last step to end */}
          {flow.flowSteps.length > 0 && (
            <line
              x1={svgWidth / 2}
              y1={stepY + ((flow.flowSteps.length - 1) * nodeSpacing) + nodeHeight / 2}
              x2={svgWidth / 2}
              y2={stepY + (flow.flowSteps.length * nodeSpacing) - 30}
              stroke="#9CA3AF"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#9CA3AF"
              />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Flow Steps Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Flow Steps Details</h4>
        {flow.flowSteps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          const isWaiting = currentStep < index + 1;
          
          return (
            <div
              key={step.stepNumber}
              className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                isActive
                  ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                  : isCompleted
                  ? "bg-green-100 border-green-500"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getStepIcon(step.stepType)}</div>
                  <div>
                    <h5 className="font-medium text-gray-800">
                      Step {step.stepNumber}: {step.stepType.replace("_", " ").toUpperCase()}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.replyContent}
                    </p>
                    {step.delay > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Delay: {step.delay} minutes
                      </p>
                    )}
                    {step.condition !== "always" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Condition: {step.condition} = "{step.conditionValue}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
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
            </div>
          );
        })}
      </div>

      {/* Flow Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
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

export default FlowSVG;
