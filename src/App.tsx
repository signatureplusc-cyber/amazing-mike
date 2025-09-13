import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VideoGenerator from "./pages/VideoGenerator";
import MyVideos from "./pages/MyVideos";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Footer from "./components/Footer"; // Import the new Footer component

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen"> {/* Use min-h-screen for overall app height */}
      <Navbar />
      <div className="flex-grow"> {/* This div will take up available space */}
        <Routes>
          <Route path="/" element={<Index />} />
          {user ? (
            <>
              <Route path="/generate-video" element={<VideoGenerator />} />
              <Route path="/my-videos" element={<MyVideos />} />
            </>
          ) : (
            // Redirect to home or show a message if not authenticated
            <Route path="/generate-video" element={<Index />} />
          )}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer /> {/* Render the Footer at the bottom */}
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
          <AuthChecker />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const AuthChecker = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <AppContent />;
};

export default App;