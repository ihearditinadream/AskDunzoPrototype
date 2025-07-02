import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const [isLifetime, setIsLifetime] = useState(false);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 fade-in">
          <h2 className="font-hand text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4 md:mb-6">Choose Your Plan</h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-6 md:mb-8 px-4 sm:px-0">
            Start with our free plan or unlock unlimited power with Premium.
          </p>

          {/* Pricing Toggle */}
          <div className="inline-flex bg-white rounded-lg p-1 border-2 border-black">
            <button
              onClick={() => setIsLifetime(false)}
              className={`px-6 py-2 rounded-md transition-all font-medium ${
                !isLifetime ? 'bg-black text-white' : 'text-black'
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setIsLifetime(true)}
              className={`px-6 py-2 rounded-md transition-all font-medium ${
                isLifetime ? 'bg-black text-white' : 'text-black'
              }`}
            >
              LIFETIME
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="pricing-card bg-white p-8 fade-in">
            <div className="text-center mb-8">
              <h3 className="font-hand text-2xl font-bold text-black mb-2">Free</h3>
              <div className="text-4xl font-bold text-black mb-2">$0</div>
              <div className="text-gray-600">per user</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">3 requests per week</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Basic features</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Weekly reset</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>

            <Button 
              onClick={handleGetStarted}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Get Started Free
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card pricing-popular bg-white p-8 relative fade-in">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>

            <div className="text-center mb-8">
              <h3 className="font-hand text-2xl font-bold text-black mb-2">Premium</h3>
              <div className="text-4xl font-bold text-black mb-2">
                {isLifetime ? '$200' : '$10'}
              </div>
              <div className="text-gray-600">
                {isLifetime ? 'one-time payment' : 'per month'}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">50 requests per week</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Faster generation</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Advanced features</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700">Early access to features</span>
              </li>
              {isLifetime && (
                <>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Lifetime updates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">VIP support</span>
                  </li>
                </>
              )}
            </ul>

            <Button 
              onClick={handleGetStarted}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {isLifetime ? 'Get Lifetime Access' : 'Go Premium'}
            </Button>
          </div>

          {/* Additional card only visible in monthly mode */}
          {!isLifetime && (
            <div className="pricing-card bg-white p-8 fade-in">
              <div className="text-center mb-8">
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Limited Time
                </div>
                <h3 className="font-hand text-2xl font-bold text-black mb-2">Lifetime Premium</h3>
                <div className="text-4xl font-bold text-black mb-2">$200</div>
                <div className="text-gray-600">one-time payment</div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">All premium perks</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Highest priority</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Lifetime updates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">VIP support</span>
                </li>
              </ul>

              <Button 
                onClick={handleGetStarted}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Get Lifetime Access
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
