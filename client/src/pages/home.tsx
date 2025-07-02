import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-white grid-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <img 
              src={logoBlack} 
              alt="AskDunzo Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="font-hand text-2xl font-bold text-black">AskDunzo</div>
              <div className="text-sm text-gray-600 font-sans -mt-1">Keep I.T. Simple</div>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Log Out
          </Button>
        </div>

        <Card className="hand-drawn-border bg-white p-8 mb-8">
          <CardHeader>
            <CardTitle className="font-hand text-3xl">Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              {user && user.profileImageUrl && (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {user && (user.firstName || user.lastName)
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "User"}
                </h2>
                <p className="text-gray-600">{user && user.email}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Ready to transform any website or PC application with simple requests? 
              Download the AskDunzo extension to get started.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-black text-white hover:bg-gray-800">
                Download Extension
              </Button>
              <Button variant="outline" className="border-2 border-black">
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hand-drawn-border bg-white p-6">
            <CardHeader>
              <CardTitle className="font-hand text-xl">Requests This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">3 / 3</div>
              <p className="text-gray-600 text-sm">Free plan limit</p>
            </CardContent>
          </Card>

          <Card className="hand-drawn-border bg-white p-6">
            <CardHeader>
              <CardTitle className="font-hand text-xl">Features Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">12</div>
              <p className="text-gray-600 text-sm">Total features</p>
            </CardContent>
          </Card>

          <Card className="hand-drawn-border bg-white p-6">
            <CardHeader>
              <CardTitle className="font-hand text-xl">Data Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">$4.50</div>
              <p className="text-gray-600 text-sm">This quarter</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
