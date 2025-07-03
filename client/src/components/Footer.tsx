import logoWhite from "@assets/download_1751431724398.png";
import { FaXTwitter, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-black text-white py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left section - Logo and social */}
          <div className="lg:w-1/3">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={logoWhite} 
                alt="AskDunzo Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="font-hand text-2xl font-bold">AskDunzo</div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              © 2026 AskDunzo, Keep I.T. Simple
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://twitter.com/askdunzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter/X"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@askdunzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/askdunzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/askdunzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right section - Links grid */}
          <div className="lg:w-2/3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contact Us
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Ethos
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Acts Notices
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              News
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
