import { Button } from "@/components/ui/button";

export default function WebSquareSection() {
  return (
    <section id="websquare" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-12 md:mb-16 fade-in">
          <h2 className="font-hand text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4 md:mb-6">WebSquare Marketplace</h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto px-4 sm:px-0">
            Browse, share, and install custom features created by the community.
          </p>
        </div>

        {/* Coming Soon Visual */}
        <div className="mb-16 fade-in">
          <div className="hand-drawn-border bg-white p-12 max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🚧</div>
            <h3 className="font-hand text-4xl font-bold text-black mb-4">Coming Soon</h3>
            <p className="text-gray-600 text-lg">We're building something amazing for the community!</p>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Community Powered</h3>
            <p className="text-gray-600">Features created by users, for users.</p>
          </div>

          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Instant Install</h3>
            <p className="text-gray-600">Add powerful features from top creators with a single click.</p>
          </div>

          <div className="hand-drawn-border bg-white p-8 text-center fade-in hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">💰</span>
            </div>
            <h3 className="font-hand text-2xl font-bold text-black mb-4">Earn Money</h3>
            <p className="text-gray-600">Publish your own features and earn tips and rewards from the community.</p>
          </div>
        </div>

        <div className="mt-12 fade-in">
          <Button 
            disabled
            className="bg-gray-400 text-white px-8 py-4 rounded-lg font-medium text-lg cursor-not-allowed"
          >
            BROWSE WEBSQUARE (Coming Soon)
          </Button>
        </div>
      </div>
    </section>
  );
}
