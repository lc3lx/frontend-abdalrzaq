import { useState } from "react";
import { FaPlay, FaStop, FaEye } from "react-icons/fa";

const FlowExample = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const exampleFlow = {
    name: "Customer Support Flow",
    description: "Automated customer support responses",
    platform: "All",
    triggerKeywords: ["help", "support", "problem", "issue"],
    flowSteps: [
      {
        stepNumber: 1,
        stepType: "immediate_reply",
        replyContent: "Hello! Thank you for reaching out. I'm here to help you. How can I assist you today?",
        delay: 0,
        condition: "always",
        isEndStep: false,
      },
      {
        stepNumber: 2,
        stepType: "delayed_reply",
        replyContent: "I see you haven't responded yet. Is there anything specific you'd like help with? I'm here to assist!",
        delay: 30, // 30 minutes
        condition: "always",
        isEndStep: false,
      },
      {
        stepNumber: 3,
        stepType: "conditional_reply",
        replyContent: "Great! I'm glad I could help. If you have any other questions, feel free to ask anytime!",
        delay: 0,
        condition: "contains_keyword",
        conditionValue: "thanks",
        isEndStep: true,
      },
    ],
  };

  const simulateFlow = () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Simulate step execution
    const executeStep = (stepIndex) => {
      if (stepIndex >= exampleFlow.flowSteps.length) {
        setIsRunning(false);
        return;
      }

      const step = exampleFlow.flowSteps[stepIndex];
      setCurrentStep(stepIndex + 1);

      // Simulate delay
      setTimeout(() => {
        executeStep(stepIndex + 1);
      }, step.delay * 1000); // Convert minutes to milliseconds for demo
    };

    executeStep(0);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Flow Example</h3>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={simulateFlow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaPlay />
              Run Example
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaStop />
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {exampleFlow.flowSteps.map((step, index) => (
          <div
            key={step.stepNumber}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentStep > index
                ? "bg-green-100 border-green-500"
                : currentStep === index + 1
                ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {step.stepType === "immediate_reply" && "⚡"}
                  {step.stepType === "delayed_reply" && "⏰"}
                  {step.stepType === "conditional_reply" && "❓"}
                </div>
                <div>
                  <h5 className="font-medium">
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
                {currentStep > index && (
                  <span className="text-green-600 text-sm font-medium">✓ Executed</span>
                )}
                {currentStep === index + 1 && (
                  <span className="text-blue-600 text-sm font-medium animate-pulse">
                    Executing...
                  </span>
                )}
                {currentStep < index + 1 && (
                  <span className="text-gray-400 text-sm">Waiting</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Customer sends message with keywords: "help", "support", "problem", or "issue"</li>
          <li>2. <strong>Immediate Reply:</strong> Bot responds instantly with welcome message</li>
          <li>3. <strong>Delayed Reply:</strong> After 30 minutes, bot sends follow-up if no response</li>
          <li>4. <strong>Conditional Reply:</strong> If customer says "thanks", bot sends closing message</li>
        </ol>
      </div>
    </div>
  );
};

export default FlowExample;
