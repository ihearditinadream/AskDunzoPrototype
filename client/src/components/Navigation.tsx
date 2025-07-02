import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSignUp = () => {
    window.location.href = "/api/login";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoBlack} 
              alt="AskDunzo Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <div className="font-hand text-xl font-bold text-black">AskDunzo</div>
              <div className="text-xs text-gray-600 font-sans -mt-1">Keep I.T. Simple</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("websquare")}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              WebSquare
            </button>
            <button
              onClick={() => scrollToSection("data-sharing")}
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Data Sharing
            </button>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a href="/download" className="relative group">
              <div className="absolute inset-0 bg-black rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <Button className="relative bg-white text-black px-6 py-2 font-medium font-hand text-lg border-2 border-black rounded-lg hover:bg-gray-50 transition-all duration-200 transform -rotate-1 group-hover:rotate-0">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Download
              </Button>
            </a>
            <Button variant="ghost" onClick={handleLogin} className="text-gray-700 hover:text-black font-medium px-4 py-2">
              Login
            </Button>
            <Button onClick={handleSignUp} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden border-t border-gray-200 overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4">
            <div className="flex flex-col space-y-4">
              <a href="/download" className="px-4 relative group">
                <div className="absolute inset-0 mx-4 bg-black rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <Button className="relative w-full bg-white text-black font-medium font-hand text-lg border-2 border-black rounded-lg hover:bg-gray-50 transition-all duration-200 transform -rotate-1 group-hover:rotate-0">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download AskDunzo
                </Button>
              </a>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-gray-700 hover:text-black transition-colors font-medium px-4 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-left text-gray-700 hover:text-black transition-colors font-medium px-4 py-2"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("websquare")}
                className="text-left text-gray-700 hover:text-black transition-colors font-medium px-4 py-2"
              >
                WebSquare
              </button>
              <button
                onClick={() => scrollToSection("data-sharing")}
                className="text-left text-gray-700 hover:text-black transition-colors font-medium px-4 py-2"
              >
                Data Sharing
              </button>
              <div className="flex space-x-3 px-4">
                <Button variant="ghost" onClick={handleLogin} className="text-gray-700 hover:text-black font-medium">
                  Login
                </Button>
                <Button onClick={handleSignUp} className="bg-black text-white hover:bg-gray-800 font-medium">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
