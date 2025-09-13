import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import GenerateVideo from "./pages/GenerateVideo";
import MyVideos from "./pages/MyVideos";
import VideoDetailsPage from "./pages/VideoDetailsPage";
import EditVideoPage from "./pages/EditVideoPage"; // Assuming this page exists or will be created

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/generate-video" element={<GenerateVideo />} />
              <Route path="/my-videos" element={<MyVideos />} />
              <Route path="/my-videos/:id" element={<VideoDetailsPage />} />
              <Route path="/my-videos/:id/edit" element={<EditVideoPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;