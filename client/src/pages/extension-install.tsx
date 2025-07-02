import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function ExtensionInstall() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Download the Extension",
      description: "Click the download button to get the AskDunzo extension file.",
      action: (
        <a href="/downloads/askdunzo-extension.tar.gz" download>
          <Button className="bg-black text-white hover:bg-gray-800">
            Download Extension
          </Button>
        </a>
      )
    },
    {
      title: "Extract the Files",
      description: "Extract the downloaded .tar.gz file to a folder on your computer.",
      note: "On Windows, you may need 7-Zip or WinRAR. On Mac/Linux, double-click to extract."
    },
    {
      title: "Open Chrome Extensions",
      description: 'Navigate to chrome://extensions/ in your Chrome browser.',
      note: "You can also access this from Menu → More Tools → Extensions"
    },
    {
      title: "Enable Developer Mode",
      description: "Toggle the 'Developer mode' switch in the top right corner.",
      note: "This allows you to install unpacked extensions"
    },
    {
      title: "Load the Extension",
      description: "Click 'Load unpacked' and select the extracted extension folder.",
      note: "The extension should now appear in your extensions list"
    },
    {
      title: "You're All Set!",
      description: "Look for the AskDunzo icon in your browser toolbar. Click it to start customizing any website!",
      action: (
        <Button 
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white grid-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src={logoBlack} 
            alt="AskDunzo Logo" 
            className="w-16 h-16 object-contain mr-4"
          />
          <div>
            <h1 className="font-hand text-4xl font-bold text-black">Install AskDunzo Extension</h1>
            <p className="text-gray-600 mt-2">Follow these simple steps to get started</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${index <= currentStep 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <Card className="hand-drawn-border bg-white p-8 mb-8">
          <CardHeader>
            <CardTitle className="font-hand text-3xl">
              Step {currentStep + 1}: {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-4">
              {steps[currentStep].description}
            </p>
            {steps[currentStep].note && (
              <p className="text-sm text-gray-600 mb-6 italic">
                💡 {steps[currentStep].note}
              </p>
            )}
            {steps[currentStep].action && (
              <div className="mb-6">
                {steps[currentStep].action}
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                className="border-2 border-black"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="hand-drawn-border bg-gray-50 p-6">
          <CardHeader>
            <CardTitle className="font-hand text-2xl">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you're having trouble installing the extension, here are some common solutions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Make sure you're using Google Chrome (version 88 or higher)</li>
              <li>Ensure Developer Mode is enabled in chrome://extensions/</li>
              <li>Extract the entire folder, not just individual files</li>
              <li>Try restarting Chrome after installation</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Still having issues? <a href="/help" className="underline font-medium">Contact Support</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}