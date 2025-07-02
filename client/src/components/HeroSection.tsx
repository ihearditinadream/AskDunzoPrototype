import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function HeroSection() {
  const [demoStep, setDemoStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const runAnimation = () => {
      // Reset state
      setDemoStep(0);
      setInputText("");
      setIsDarkMode(false);

      // Animate the entire process
      const animationSteps = [
        { delay: 1500, action: () => setDemoStep(1) }, // Show AskDunzo icon
        { delay: 2500, action: () => setDemoStep(2) }, // Show input box
        { delay: 3500, action: () => setDemoStep(3) }, // Start typing
        { delay: 6500, action: () => setDemoStep(4) }, // Finish typing, show processing
        { delay: 8000, action: () => setDemoStep(5) }, // Show dark mode button
        { delay: 9500, action: () => setIsDarkMode(true) }, // Auto-toggle dark mode
        { delay: 11000, action: () => setIsDarkMode(false) }, // Toggle back
      ];

      const timers = animationSteps.map(step => 
        setTimeout(step.action, step.delay)
      );

      // Schedule next animation cycle
      const restartTimer = setTimeout(runAnimation, 13000);

      return [...timers, restartTimer];
    };

    const timers = runAnimation();
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (demoStep === 3) {
      const targetText = "Add a dark mode button to this site!";
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= targetText.length) {
          setInputText(targetText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);

      return () => clearInterval(typingInterval);
    }
  }, [demoStep]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleDownloadExtension = () => {
    // In a real app, this would link to the Chrome Web Store
    alert("Extension download would be available in the Chrome Web Store");
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Headlines */}
        <div className="mb-12 fade-in">
          <h1 className="font-hand text-6xl md:text-8xl font-bold text-black mb-6">Keep I.T. Simple</h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light">
            Add any feature to any website or your PC with a simple request.
          </p>
        </div>

        {/* Product Demonstration Container */}
        <div className="mb-12 fade-in">
          <div className="demo-container max-w-4xl mx-auto p-8 bg-white">
            <div className="browser-mockup">
              {/* Browser Header */}
              <div className="browser-header flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-600">myblog.com</div>
              </div>

              {/* AskDunzo Interface Overlay */}
              <div className="relative bg-white p-8">
                {/* AskDunzo Icon - appears in step 1 */}
                {demoStep >= 1 && (
                  <div className={`absolute top-4 right-4 transition-all duration-500 ${
                    demoStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                      <img 
                        src={logoBlack} 
                        alt="AskDunzo" 
                        className="w-6 h-6 object-contain invert"
                      />
                    </div>
                  </div>
                )}

                {/* Demo Input Box - appears in step 2 */}
                {demoStep >= 2 && (
                  <div className={`mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition-all duration-500 ${
                    demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="What would you like to add or change on this site?"
                        value={inputText}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white"
                        readOnly
                      />
                      {demoStep === 3 && showCursor && (
                        <span className="absolute right-8 text-gray-700 animate-pulse">|</span>
                      )}
                    </div>
                    
                    {/* Processing indicator - appears in step 4 */}
                    {demoStep === 4 && (
                      <div className="mt-2 text-sm text-gray-500 animate-pulse">
                        ✨ Processing your request...
                      </div>
                    )}
                  </div>
                )}

                {/* Mock Website Content */}
                <div className={`p-6 rounded-lg transition-all duration-500 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">My Blog</h2>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Welcome to my blog where I share my thoughts and experiences...
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Latest Post</h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Learn how to enhance your browsing experience...
                    </p>
                  </div>

                  {/* Dark Mode Button (appears after demo) */}
                  <div className="flex justify-end">
                    {demoStep >= 5 && (
                      <Button
                        onClick={toggleDarkMode}
                        className={`transition-all duration-500 transform ${
                          demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                        } ${isDarkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                      >
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mb-12 fade-in">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleGetStarted}
              className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
            >
              GET STARTED FOR FREE
            </Button>
            <Button 
              onClick={handleDownloadExtension}
              variant="outline"
              className="border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition-colors font-medium text-lg"
            >
              DOWNLOAD EXTENSION
            </Button>
          </div>

          {/* Compatibility Icons */}
          <div className="flex justify-center items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-sm">Chrome</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-sm">Firefox</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-sm">Windows</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-sm">macOS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
