import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Planes = lazy(() => import("./pages/Planes"));
const Portafolio = lazy(() => import("./pages/Portafolio"));
const Apps = lazy(() => import("./pages/Apps"));
const Demos = lazy(() => import("./pages/Demos"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy so @supabase/supabase-js only loads for visitors who hit /auth or /admin,
// instead of being bundled into the marketing site's main chunk for every visitor.
const AuthProvider = lazy(() =>
  import("@/hooks/useAuth").then((m) => ({ default: m.AuthProvider }))
);

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portafolio" element={<Portafolio />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/planes" element={<Planes />} />
              {/* Legacy redirect */}
              <Route path="/pricing" element={<Planes />} />
              <Route path="/demos" element={<Demos />} />
              <Route
                path="/auth"
                element={
                  <AuthProvider>
                    <Auth />
                  </AuthProvider>
                }
              />
              <Route
                path="/admin"
                element={
                  <AuthProvider>
                    <Admin />
                  </AuthProvider>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
