import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";
import { SiGooglechrome, SiFirefox } from "react-icons/si";

export default function HeroSection() {
  const [demoStep, setDemoStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState(1); // 1: dark mode, 2: youtube, 3: instagram
  const [sortedComments, setSortedComments] = useState(false);
  const [downloadButtonAdded, setDownloadButtonAdded] = useState(false);

  useEffect(() => {
    const runAnimation = () => {
      // Reset state
      setDemoStep(0);
      setInputText("");
      setIsDarkMode(false);
      setSortedComments(false);
      setDownloadButtonAdded(false);

      // Animate the entire process
      let animationSteps: { delay: number; action: () => void }[] = [];
      
      if (currentAnimation === 1) {
        // Dark mode animation
        animationSteps = [
          { delay: 1500, action: () => setDemoStep(1) }, // Show AskDunzo icon
          { delay: 2500, action: () => setDemoStep(2) }, // Show input box
          { delay: 3500, action: () => setDemoStep(3) }, // Start typing
          { delay: 6500, action: () => setDemoStep(4) }, // Finish typing, show processing
          { delay: 8000, action: () => setDemoStep(5) }, // Show dark mode button
          { delay: 9500, action: () => setIsDarkMode(true) }, // Auto-toggle dark mode
          { delay: 11000, action: () => setIsDarkMode(false) }, // Toggle back
        ];
      } else if (currentAnimation === 2) {
        // YouTube comments animation
        animationSteps = [
          { delay: 1500, action: () => setDemoStep(1) }, // Show AskDunzo icon
          { delay: 2500, action: () => setDemoStep(2) }, // Show input box
          { delay: 3500, action: () => setDemoStep(3) }, // Start typing
          { delay: 6500, action: () => setDemoStep(4) }, // Finish typing, show processing
          { delay: 8000, action: () => setDemoStep(5) }, // Show sort button
          { delay: 9500, action: () => setSortedComments(true) }, // Sort comments
          { delay: 11000, action: () => setSortedComments(false) }, // Reset
        ];
      } else if (currentAnimation === 3) {
        // Instagram download animation
        animationSteps = [
          { delay: 1500, action: () => setDemoStep(1) }, // Show AskDunzo icon
          { delay: 2500, action: () => setDemoStep(2) }, // Show input box
          { delay: 3500, action: () => setDemoStep(3) }, // Start typing
          { delay: 6500, action: () => setDemoStep(4) }, // Finish typing, show processing
          { delay: 8000, action: () => setDemoStep(5) }, // Show download button
          { delay: 9500, action: () => setDownloadButtonAdded(true) }, // Show added state
        ];
      }

      const timers = animationSteps.map(step => 
        setTimeout(step.action, step.delay)
      );

      // Move to next animation after this one completes
      const nextAnimationTimer = setTimeout(() => {
        setCurrentAnimation(prev => prev === 3 ? 1 : prev + 1);
      }, 13000);

      return [...timers, nextAnimationTimer];
    };

    const timers = runAnimation();
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [currentAnimation]);

  // Typing animation effect
  useEffect(() => {
    if (demoStep === 3) {
      let targetText = "";
      
      if (currentAnimation === 1) {
        targetText = "Add a dark mode button to this site!";
      } else if (currentAnimation === 2) {
        targetText = "Sort YouTube comments by likes";
      } else if (currentAnimation === 3) {
        targetText = "Add a download button to Instagram";
      }
      
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
  }, [demoStep, currentAnimation]);

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
    window.location.href = "/download";
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Headlines */}
        <div className="mb-8 md:mb-12 fade-in">
          <h1 className="font-hand text-5xl sm:text-6xl md:text-8xl font-bold text-black mb-4 sm:mb-6">Keep I.T. Simple</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light px-4 sm:px-0">
            Add any feature to any website or your PC with a simple request.
          </p>
        </div>

        {/* Product Demonstration Container */}
        <div className="mb-8 md:mb-12 fade-in">
          <div className="demo-container max-w-2xl md:max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white">
            <div className="browser-mockup">
              {/* Browser Header */}
              <div className="browser-header flex items-center px-2 sm:px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-600">
                  {currentAnimation === 1 && "myblog.com"}
                  {currentAnimation === 2 && "youtube.com"}
                  {currentAnimation === 3 && "instagram.com"}
                </div>
              </div>

              {/* AskDunzo Interface Overlay */}
              <div className="relative bg-white p-4 sm:p-6 md:p-8 min-h-[250px] sm:min-h-[350px] md:min-h-[400px]">
                {/* Step 1: Show only centered logo */}
                {demoStep === 1 && (
                  <div className="absolute inset-0 flex justify-center items-center z-50">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center animate-pulse">
                      <img 
                        src={logoBlack} 
                        alt="AskDunzo" 
                        className="w-12 h-12 object-contain invert"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2+: Logo in corner with higher z-index */}
                {demoStep >= 2 && (
                  <div className="absolute top-4 right-4 z-50">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
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
                  <div className={`relative z-40 transition-all duration-500 ${
                    demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}>
                    <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex items-center relative">
                        <input
                          type="text"
                          placeholder="What would you like to add or change on this site?"
                          value={inputText}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 bg-white pr-12"
                          readOnly
                        />
                        {demoStep === 3 && showCursor && (
                          <span className="absolute right-4 text-gray-700 animate-pulse">|</span>
                        )}
                      </div>
                      
                      {/* Processing indicator - appears in step 4 */}
                      {demoStep === 4 && (
                        <div className="mt-3 text-sm text-gray-500 animate-pulse">
                          ✨ Dunzo is processing your request...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mock Website Content - Different for each animation */}
                {currentAnimation === 1 && (
                  <div className={`p-6 rounded-lg transition-all duration-500 ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                  } ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
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
                )}

                {currentAnimation === 2 && (
                  <div className={`p-4 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* YouTube Comments Section */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg mb-3">Comments</h3>
                      
                      {/* Sort Button */}
                      {demoStep >= 5 && (
                        <div className="mb-4">
                          <Button
                            onClick={() => setSortedComments(!sortedComments)}
                            className={`transition-all duration-500 transform ${
                              demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                            } bg-blue-600 text-white hover:bg-blue-700`}
                          >
                            📊 Sort by Likes
                          </Button>
                        </div>
                      )}
                      
                      {/* Comments List */}
                      <div className={`flex flex-col gap-3 transition-all duration-700`}>
                        {sortedComments ? (
                          <>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@musicfan</p>
                                  <p className="text-sm text-gray-700">This is the best song ever! 🎵</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 1.2K likes</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@viewer123</p>
                                  <p className="text-sm text-gray-700">Who's watching in 2025?</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 856 likes</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@cooluser</p>
                                  <p className="text-sm text-gray-700">Thanks for the tutorial!</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 5 likes</p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@cooluser</p>
                                  <p className="text-sm text-gray-700">Thanks for the tutorial!</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 5 likes</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@viewer123</p>
                                  <p className="text-sm text-gray-700">Who's watching in 2025?</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 856 likes</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg transition-all duration-500">
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">@musicfan</p>
                                  <p className="text-sm text-gray-700">This is the best song ever! 🎵</p>
                                  <p className="text-xs text-gray-500 mt-1">👍 1.2K likes</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentAnimation === 3 && (
                  <div className={`p-4 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Instagram Post */}
                    <div className="max-w-sm mx-auto">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">@photographer</p>
                          <p className="text-xs text-gray-500">New York, NY</p>
                        </div>
                      </div>
                      
                      {/* Image Placeholder */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-64 rounded-lg mb-3"></div>
                        
                        {/* Download Button - appears after demo */}
                        {demoStep >= 5 && (
                          <div className="absolute bottom-2 right-2">
                            <Button
                              onClick={() => setDownloadButtonAdded(true)}
                              className={`transition-all duration-500 transform ${
                                demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                              } ${downloadButtonAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                            >
                              {downloadButtonAdded ? '✓ Download Added!' : '⬇ Download'}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Post Actions */}
                      <div className="flex gap-4 mb-2">
                        <span className="text-2xl">❤️</span>
                        <span className="text-2xl">💬</span>
                        <span className="text-2xl">📤</span>
                      </div>
                      
                      {/* Post Caption */}
                      <p className="text-sm">
                        <span className="font-medium">@photographer</span> Beautiful sunset in the city 🌅
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                )}
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
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <SiGooglechrome className="w-6 h-6 text-[#4285F4]" />
              <span className="text-sm">Chrome</span>
            </div>
            <div className="flex items-center space-x-2">
              <SiFirefox className="w-6 h-6 text-[#FF7139]" />
              <span className="text-sm">Firefox</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
              </div>
              <span className="text-sm">Windows</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <span className="text-sm">macOS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
