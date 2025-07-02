import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoBlack from "@assets/unnamed (1)_1751431724399.jpg";
import { ChevronRight, Download, Monitor, Globe } from "lucide-react";
import { Link } from "wouter";

export default function DownloadPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<"extension" | "desktop">("extension");

  return (
    <div className="min-h-screen bg-white grid-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={logoBlack} 
            alt="AskDunzo Logo" 
            className="w-20 h-20 object-contain mx-auto mb-6"
          />
          <h1 className="font-hand text-5xl font-bold text-black mb-4">
            Download AskDunzo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred way to use AskDunzo. Both options give you the power to transform any website with simple requests.
          </p>
        </div>

        {/* Platform Selection */}
        <Tabs defaultValue="extension" className="mb-12" onValueChange={(v) => setSelectedPlatform(v as any)}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="extension" className="font-medium">
              <Globe className="w-4 h-4 mr-2" />
              Browser Extension
            </TabsTrigger>
            <TabsTrigger value="desktop" className="font-medium">
              <Monitor className="w-4 h-4 mr-2" />
              Desktop App
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extension">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Chrome Extension */}
              <Card className="hand-drawn-border bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      C
                    </div>
                    <div>
                      <CardTitle className="font-hand text-2xl">Chrome Extension</CardTitle>
                      <CardDescription>For Google Chrome & Edge browsers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Works on any website instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Lightweight and fast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Auto-syncs across devices</span>
                    </li>
                  </ul>
                  <Link href="/install-extension">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download Chrome Extension
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Requires manual installation (not on Chrome Store yet)
                  </p>
                </CardContent>
              </Card>

              {/* Firefox Extension */}
              <Card className="hand-drawn-border bg-gray-50 opacity-75">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                      F
                    </div>
                    <div>
                      <CardTitle className="font-hand text-2xl">Firefox Extension</CardTitle>
                      <CardDescription>For Mozilla Firefox</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">○</span>
                      <span>Same powerful features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">○</span>
                      <span>Privacy-focused</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">○</span>
                      <span>Cross-platform support</span>
                    </li>
                  </ul>
                  <Button className="w-full" disabled variant="outline">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="desktop">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Windows */}
              <Card className="hand-drawn-border bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="font-hand text-2xl">Windows</CardTitle>
                      <CardDescription>Windows 10 or later</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Native Windows integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>System-wide features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Offline capability</span>
                    </li>
                  </ul>
                  <a href="/downloads/askdunzo-win.exe" download>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download .exe
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* macOS */}
              <Card className="hand-drawn-border bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="font-hand text-2xl">macOS</CardTitle>
                      <CardDescription>macOS 10.15+</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Native macOS app</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Menu bar integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Apple Silicon ready</span>
                    </li>
                  </ul>
                  <a href="/downloads/askdunzo-mac.dmg" download>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download .dmg
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Linux */}
              <Card className="hand-drawn-border bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="font-hand text-2xl">Linux</CardTitle>
                      <CardDescription>Ubuntu, Debian, Fedora</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>AppImage format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>No installation needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Universal compatibility</span>
                    </li>
                  </ul>
                  <a href="/downloads/askdunzo-linux.AppImage" download>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <Download className="w-4 h-4 mr-2" />
                      Download AppImage
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Comparison */}
        <Card className="hand-drawn-border bg-gray-50 p-8">
          <CardHeader>
            <CardTitle className="font-hand text-3xl text-center mb-6">
              Which Should I Choose?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Choose Browser Extension if you:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Primarily want to customize websites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Prefer lightweight, fast solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Want automatic updates</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Choose Desktop App if you:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Want to customize your entire PC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Need system-level modifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Prefer standalone applications</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}