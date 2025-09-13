import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VideoGenerator from "./pages/VideoGenerator";
import MyVideos from "./pages/MyVideos";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import VideoDetailsPage from "./pages/VideoDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

const queryClient = new QueryClient();

// ProtectedRoute component to handle authentication for specific routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to the auth page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/generate-video"
            element={
              <ProtectedRoute>
                <VideoGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-videos"
            element={
              <ProtectedRoute>
                <MyVideos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-videos/:id"
            element={
              <ProtectedRoute>
                <VideoDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> {/* ThemeProvider added here */}
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;