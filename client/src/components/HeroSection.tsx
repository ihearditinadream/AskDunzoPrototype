import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";
import { SiGooglechrome, SiFirefox } from "react-icons/si";

export default function HeroSection() {
  const [demoStep, setDemoStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState(1); // 1: dark mode, 2: youtube, 3: instagram, 4: ad blocker
  const [sortedComments, setSortedComments] = useState(false);
  const [downloadButtonAdded, setDownloadButtonAdded] = useState(false);
  const [adsBlocked, setAdsBlocked] = useState(false);

  useEffect(() => {
    const runAnimation = () => {
      // Reset state
      setDemoStep(0);
      setInputText("");
      setIsDarkMode(false);
      setSortedComments(false);
      setDownloadButtonAdded(false);
      setAdsBlocked(false);

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
      } else if (currentAnimation === 4) {
        // Ad blocker animation
        animationSteps = [
          { delay: 1500, action: () => setDemoStep(1) }, // Show AskDunzo icon
          { delay: 2500, action: () => setDemoStep(2) }, // Show input box
          { delay: 3500, action: () => setDemoStep(3) }, // Start typing
          { delay: 6500, action: () => setDemoStep(4) }, // Finish typing, show processing
          { delay: 8000, action: () => setDemoStep(5) }, // Show block ads button
          { delay: 9500, action: () => setAdsBlocked(true) }, // Block ads
        ];
      }

      const timers = animationSteps.map(step => 
        setTimeout(step.action, step.delay)
      );

      // Move to next animation after this one completes
      const nextAnimationTimer = setTimeout(() => {
        setCurrentAnimation(prev => prev === 4 ? 1 : prev + 1);
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
      } else if (currentAnimation === 4) {
        targetText = "Block all ads on this website";
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
                  {currentAnimation === 4 && "news.com"}
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
                  <div className={`transition-all duration-700 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Blog Header */}
                    <div className={`px-6 py-4 border-b transition-all duration-500 ${
                      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <span className="text-2xl">📝</span>
                          </div>
                          <div>
                            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Tech Thoughts
                            </h1>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              A blog about web development
                            </p>
                          </div>
                        </div>
                        
                        {/* Dark Mode Button */}
                        {demoStep >= 5 && (
                          <Button
                            onClick={toggleDarkMode}
                            className={`transition-all duration-500 transform ${
                              demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                            } ${isDarkMode 
                              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-lg' 
                              : 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'
                            } flex items-center gap-2`}
                          >
                            {isDarkMode ? (
                              <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                                Light Mode
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                                Dark Mode
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className={`p-6 transition-all duration-500 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      {/* Featured Post */}
                      <article className={`rounded-xl p-6 mb-6 transition-all duration-500 ${
                        isDarkMode ? 'bg-gray-900 shadow-xl' : 'bg-white shadow-md'
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            Featured
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            5 min read
                          </span>
                        </div>
                        <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          The Future of Web Development
                        </h2>
                        <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Exploring the latest trends in modern web development, from AI-powered tools to 
                          revolutionary frameworks that are changing how we build applications...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${
                              isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                            }`}></div>
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Sarah Chen
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Jan 3, 2025
                              </p>
                            </div>
                          </div>
                          <button className={`text-sm font-medium ${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}>
                            Read more →
                          </button>
                        </div>
                      </article>

                      {/* Recent Posts Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`rounded-lg p-4 transition-all duration-500 ${
                          isDarkMode ? 'bg-gray-900' : 'bg-white shadow-sm'
                        }`}>
                          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            CSS Grid Mastery
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Advanced techniques for complex layouts
                          </p>
                        </div>
                        <div className={`rounded-lg p-4 transition-all duration-500 ${
                          isDarkMode ? 'bg-gray-900' : 'bg-white shadow-sm'
                        }`}>
                          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            React Best Practices
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Write cleaner, more efficient code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentAnimation === 2 && (
                  <div className={`transition-all duration-700 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* YouTube Video Player */}
                    <div className="bg-black p-2 mb-4">
                      <div className="relative bg-gradient-to-br from-red-600 to-pink-600 rounded-lg aspect-video flex items-center justify-center">
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
                        <svg className="w-16 h-16 text-white z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-75 px-2 py-1 rounded">
                          10:24
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Title and Info */}
                    <div className="px-4 mb-4">
                      <h2 className="font-bold text-lg mb-1">Amazing Tutorial: Learn React in 2025</h2>
                      <p className="text-gray-600 text-sm">125K views • 2 days ago</p>
                    </div>

                    {/* Comments Section */}
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base">1,234 Comments</h3>
                        
                        {/* Sort Button */}
                        {demoStep >= 5 && (
                          <Button
                            onClick={() => setSortedComments(!sortedComments)}
                            className={`transition-all duration-500 transform ${
                              demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                            } bg-red-600 text-white hover:bg-red-700 shadow-lg flex items-center gap-2`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            Sort by Likes
                          </Button>
                        )}
                      </div>
                      
                      {/* Comments List */}
                      <div className={`flex flex-col gap-3 transition-all duration-700`}>
                        {sortedComments ? (
                          <>
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                M
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@musicfan</p>
                                  <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">This is the best tutorial I've ever seen! The explanations are so clear 🎵</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="font-semibold">1.2K</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                V
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@viewer123</p>
                                  <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">Who's watching in 2025? This content is still relevant!</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="font-semibold">856</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                C
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@cooluser</p>
                                  <p className="text-xs text-gray-500">3 days ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">Thanks for the tutorial! Finally understood hooks</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span>5</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                C
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@cooluser</p>
                                  <p className="text-xs text-gray-500">3 days ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">Thanks for the tutorial! Finally understood hooks</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span>5</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                V
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@viewer123</p>
                                  <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">Who's watching in 2025? This content is still relevant!</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="font-semibold">856</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                M
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm">@musicfan</p>
                                  <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">This is the best tutorial I've ever seen! The explanations are so clear 🎵</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="font-semibold">1.2K</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                                    </svg>
                                    Reply
                                  </button>
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
                  <div className={`transition-all duration-700 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Instagram Stories Bar */}
                    <div className="px-4 py-3 bg-white border-b border-gray-200">
                      <div className="flex gap-3 overflow-x-auto">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-pink-500"></div>
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1">Your Story</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1">travel_pics</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1">foodie</p>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Post */}
                    <div className="bg-white">
                      {/* Post Header */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                              <div className="w-full h-full bg-white rounded-full p-0.5">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                  P
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">photographer</p>
                            <p className="text-xs text-gray-500">Times Square, New York</p>
                          </div>
                        </div>
                        <button className="text-gray-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Image */}
                      <div className="relative">
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                          <div className="relative h-80 flex items-center justify-center">
                            {/* Simulated city skyline */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 p-4">
                              <div className="w-8 h-24 bg-white bg-opacity-20 rounded-t"></div>
                              <div className="w-10 h-32 bg-white bg-opacity-20 rounded-t"></div>
                              <div className="w-6 h-28 bg-white bg-opacity-20 rounded-t"></div>
                              <div className="w-12 h-40 bg-white bg-opacity-20 rounded-t"></div>
                              <div className="w-8 h-36 bg-white bg-opacity-20 rounded-t"></div>
                              <div className="w-10 h-30 bg-white bg-opacity-20 rounded-t"></div>
                            </div>
                            <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full blur-xl opacity-70"></div>
                          </div>
                        </div>
                        
                        {/* Download Button - appears after demo */}
                        {demoStep >= 5 && (
                          <div className="absolute bottom-4 right-4">
                            <Button
                              onClick={() => setDownloadButtonAdded(true)}
                              className={`transition-all duration-500 transform ${
                                demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                              } ${downloadButtonAdded 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg'
                              } text-white flex items-center gap-2`}
                            >
                              {downloadButtonAdded ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Download Added!
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                  </svg>
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Post Actions */}
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <button className="hover:opacity-60 transition-opacity">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                            <button className="hover:opacity-60 transition-opacity">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </button>
                            <button className="hover:opacity-60 transition-opacity">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.938 18 15.482 18 15c0-.482.114-.938.316-1.342m0 2.684a3 3 0 110-2.684M21 12a9 9 0 11-18 0 9 9 0 0118 0z" transform="rotate(-30 12 12)" />
                              </svg>
                            </button>
                          </div>
                          <button className="hover:opacity-60 transition-opacity">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Likes */}
                        <p className="font-semibold text-sm mb-2">2,543 likes</p>
                        
                        {/* Caption */}
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-semibold">photographer</span> Golden hour in the city that never sleeps 🌆✨ The skyline looks magical during sunset!
                          </p>
                          <button className="text-gray-500 text-sm">View all 89 comments</button>
                          <p className="text-xs text-gray-500 uppercase">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentAnimation === 4 && (
                  <div className={`transition-all duration-700 ${demoStep === 1 ? 'opacity-50' : 'opacity-100'}`}>
                    {/* News Website Header */}
                    <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-white text-2xl font-bold">
                          <span className="bg-white text-red-600 px-2 py-1 rounded">NEWS</span>
                          <span className="ml-1">TODAY</span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-white text-sm">
                        <span>Politics</span>
                        <span>Tech</span>
                        <span>Sports</span>
                        <span>Weather</span>
                      </div>
                    </div>

                    {/* Ad Blocker Button */}
                    {demoStep >= 5 && (
                      <div className="absolute top-20 right-4 z-50">
                        <Button
                          onClick={() => setAdsBlocked(!adsBlocked)}
                          className={`transition-all duration-500 transform ${
                            demoStep >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-0'
                          } ${adsBlocked 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                          } text-white shadow-lg flex items-center gap-2`}
                        >
                          {adsBlocked ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Ads Blocked!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Block Ads
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* News Content */}
                    <div className="bg-gray-100 p-4">
                      {/* Top Banner Ad */}
                      {!adsBlocked && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg mb-4 text-center font-bold animate-pulse">
                          <div className="text-xs mb-1">ADVERTISEMENT</div>
                          <div className="text-xl">🎯 LIMITED TIME OFFER - 50% OFF!</div>
                          <div className="text-sm">Click here for amazing deals!</div>
                        </div>
                      )}

                      {/* Main Content Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Left Sidebar Ad */}
                        {!adsBlocked && (
                          <div className="col-span-1">
                            <div className="bg-gradient-to-b from-purple-500 to-pink-500 text-white p-4 rounded-lg sticky top-4">
                              <div className="text-xs mb-2">SPONSORED</div>
                              <div className="font-bold mb-2">New Phone Release!</div>
                              <div className="text-sm mb-3">Get the latest smartphone with amazing features</div>
                              <button className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-bold">
                                SHOP NOW
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Main Article */}
                        <div className={`${adsBlocked ? 'col-span-3' : 'col-span-2'}`}>
                          {/* Breaking News */}
                          <article className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                                BREAKING
                              </span>
                              <span className="text-gray-500 text-sm">5 minutes ago</span>
                            </div>
                            <h1 className="text-2xl font-bold mb-3">
                              Major Tech Company Announces Revolutionary AI Breakthrough
                            </h1>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              In a stunning announcement today, leading technology company unveiled their latest 
                              artificial intelligence system that promises to transform how we interact with computers...
                            </p>
                            
                            {/* Inline Ad */}
                            {!adsBlocked && (
                              <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded my-4">
                                <div className="text-xs text-blue-600 mb-1">AD</div>
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-16 bg-blue-400 rounded flex items-center justify-center text-white text-2xl">
                                    🏠
                                  </div>
                                  <div>
                                    <div className="font-semibold">Find Your Dream Home</div>
                                    <div className="text-sm text-gray-600">Browse thousands of listings</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <p className="text-gray-700 mb-4">
                              The new system, which has been in development for over three years, demonstrates 
                              capabilities that exceed current industry standards by a significant margin...
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>By Sarah Johnson</span>
                              <span>•</span>
                              <span>Technology</span>
                              <span>•</span>
                              <span>12.5K views</span>
                            </div>
                          </article>

                          {/* More Articles Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <article className="bg-white rounded-lg shadow-sm p-4">
                              <h3 className="font-bold mb-2">Stock Market Hits Record High</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Major indices close at all-time highs as investors...
                              </p>
                              <span className="text-xs text-blue-600">Business • 2h ago</span>
                            </article>
                            
                            {!adsBlocked ? (
                              <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-lg p-4">
                                <div className="text-xs mb-1">PROMOTED</div>
                                <div className="font-bold mb-1">Lose Weight Fast!</div>
                                <div className="text-sm">Try our new fitness program</div>
                              </div>
                            ) : (
                              <article className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-bold mb-2">Climate Summit Reaches Agreement</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  World leaders commit to new environmental targets...
                                </p>
                                <span className="text-xs text-blue-600">Environment • 4h ago</span>
                              </article>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Banner Ad */}
                      {!adsBlocked && (
                        <div className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
                          <div className="text-xs mb-2">ADVERTISEMENT</div>
                          <div className="text-2xl font-bold mb-2">🚗 Auto Insurance Quotes</div>
                          <div className="mb-3">Save up to $500 on your car insurance!</div>
                          <button className="bg-white text-indigo-600 px-6 py-2 rounded font-bold">
                            GET QUOTE
                          </button>
                        </div>
                      )}
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
