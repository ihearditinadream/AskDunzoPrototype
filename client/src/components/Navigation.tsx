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
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
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
        )}
      </div>
    </nav>
  );
}
