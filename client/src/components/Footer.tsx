import logoWhite from "@assets/download_1751431724398.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src={logoWhite} 
              alt="AskDunzo Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <div className="font-hand text-xl font-bold">AskDunzo</div>
              <div className="text-sm text-gray-400 -mt-1">Keep I.T. Simple</div>
            </div>
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform any website or PC application with simple requests. Join thousands of users who are already keeping I.T. simple.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("features")}
                  className="hover:text-white transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("pricing")}
                  className="hover:text-white transition-colors text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a href="/download" className="hover:text-white transition-colors">
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("websquare")}
                  className="hover:text-white transition-colors text-left"
                >
                  WebSquare
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Developers
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Forum
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Help Center
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Bug Reports
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors text-left">
                  About
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 AskDunzo. All rights reserved. Keep I.T. Simple.</p>
        </div>
      </div>
    </footer>
  );
}
