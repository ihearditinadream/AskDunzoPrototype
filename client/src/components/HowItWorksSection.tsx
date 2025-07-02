import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function HowItWorksSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 fade-in">
          <h2 className="font-hand text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4 md:mb-6">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto px-4 sm:px-0">
            Three simple steps to transform your website application.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
              <img 
                src={logoBlack} 
                alt="AskDunzo Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Click the Icon</h3>
            <p className="text-gray-600">
              Find AskDunzo in your browser toolbar and click to get started.
            </p>
          </div>

          {/* Step 2 */}
          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-1 bg-white rounded"></div>
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Make a Request</h3>
            <p className="text-gray-600">
              Clearly type what you want to add or change on any website.
            </p>
          </div>

          {/* Step 3 */}
          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Enjoy Your Feature</h3>
            <p className="text-gray-600">
              Watch as your custom feature appears in seconds, ready to use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
