import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaArrowRight, FaArrowDown } from "react-icons/fa";

const FlowMermaid = ({ flow }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const generateMermaidCode = () => {
    if (!flow || !flow.flowSteps) return "";

    let mermaidCode = "graph TD\n";
    mermaidCode += "    Start([🚀 Start]) --> Step1\n";

    flow.flowSteps.forEach((step, index) => {
      const stepId = `Step${step.stepNumber}`;
      const nextStepId = step.nextStep ? `Step${step.nextStep}` : `End${index + 1}`;
      
      // Step node
      mermaidCode += `    ${stepId}[${getStepIcon(step.stepType)} Step ${step.stepNumber}<br/>${step.stepType.replace("_", " ").toUpperCase()}] --> `;
      
      if (step.isEndStep) {
        mermaidCode += `End${index + 1}\n`;
      } else if (step.nextStep) {
        mermaidCode += `${nextStepId}\n`;
      } else if (index < flow.flowSteps.length - 1) {
        mermaidCode += `Step${step.stepNumber + 1}\n`;
      } else {
        mermaidCode += `End${index + 1}\n`;
      }
    });

    // End node
    mermaidCode += `    End([🏁 End])\n`;

    // Add styling
    mermaidCode += "\n    classDef startEnd fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#fff\n";
    mermaidCode += "    classDef immediate fill:#10B981,stroke:#059669,stroke-width:2px,color:#fff\n";
    mermaidCode += "    classDef delayed fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#fff\n";
    mermaidCode += "    classDef conditional fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#fff\n";
    mermaidCode += "    classDef end fill:#6B7280,stroke:#4B5563,stroke-width:2px,color:#fff\n";

    mermaidCode += "\n    class Start,End startEnd\n";
    
    flow.flowSteps.forEach((step, index) => {
      const stepId = `Step${step.stepNumber}`;
      if (step.stepType === "immediate_reply") {
        mermaidCode += `    class ${stepId} immediate\n`;
      } else if (step.stepType === "delayed_reply") {
        mermaidCode += `    class ${stepId} delayed\n`;
      } else if (step.stepType === "conditional_reply") {
        mermaidCode += `    class ${stepId} conditional\n`;
      } else {
        mermaidCode += `    class ${stepId} end\n`;
      }
    });

    return mermaidCode;
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
        <h3 className="text-xl font-bold text-gray-800">Flow Mermaid Diagram</h3>
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

      {/* Mermaid Code Display */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Mermaid Code</h4>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
            {generateMermaidCode()}
          </pre>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Copy this code to <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mermaid Live Editor</a> to see the visual diagram
        </p>
      </div>

      {/* Flow Steps with Animation */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Flow Steps</h4>
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

export default FlowMermaid;
