import { useState } from "react";

export default function DataSharingSection() {
  const [selectedSplit, setSelectedSplit] = useState('50-50');

  return (
    <section id="data-sharing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 fade-in">
          <h2 className="font-hand text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 md:mb-6 px-4 sm:px-0">Get Paid For Your Data. Seriously.</h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto px-4 sm:px-0">
            We believe your data has value. Join our program and earn cash while helping improve AskDunzo for everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Benefits */}
          <div className="fade-in">
            <h3 className="font-hand text-3xl font-bold text-black mb-8">The Benefits</h3>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">100% Anonymized</h4>
                  <p className="text-gray-600">Your privacy is our top priority. All data is anonymized and aggregated before it's used.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🎛️</span>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">Your Choice</h4>
                  <p className="text-gray-600">Opt-in or out at any time. You are always in control of your data and can see who it's sold to on your dashboard.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">Real Money</h4>
                  <p className="text-gray-600">We don't just reward you with points. Earn real cash payouts every 3 months for your contribution.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Deal */}
          <div className="fade-in">
            <h3 className="font-hand text-3xl font-bold text-black mb-8">Choose Your Split</h3>

            <div className="grid gap-6">
              <div 
                className={`hand-drawn-border p-6 cursor-pointer transition-all ${
                  selectedSplit === '50-50' ? 'bg-green-50 border-green-500' : 'bg-white'
                }`}
                onClick={() => setSelectedSplit('50-50')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-black">50/50 Split</h4>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Popular</span>
                </div>
                <p className="text-gray-600 mb-4">Keep 50% of profits from your anonymized data</p>
                
              </div>

              <div 
                className={`hand-drawn-border p-6 cursor-pointer transition-all ${
                  selectedSplit === '100' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedSplit('100')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-black">100% to AskDunzo</h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Extra Perks</span>
                </div>
                <p className="text-gray-600 mb-4">Give 100% of profits for premium benefits</p>
                <div className="text-lg font-bold text-black">+ Extra premium slot + Ad-blocking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
