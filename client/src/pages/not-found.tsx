import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white grid-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img 
            src={logoBlack} 
            alt="AskDunzo Logo" 
            className="w-20 h-20 object-contain mx-auto mb-6"
          />
          <h1 className="font-hand text-8xl font-bold text-black mb-4">404</h1>
          <h2 className="font-hand text-3xl font-semibold text-black mb-4">
            Oops! Lost in the Web
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            We couldn't find the page you're looking for. Maybe AskDunzo can help you add it?
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Go Back Home
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Or try installing our extension to customize any page!
          </p>
        </div>
      </div>
    </div>
  );
}
