import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VideoGenerator from "./pages/VideoGenerator";
import MyVideos from "./pages/MyVideos"; // Import the new MyVideos page
import Navbar from "./components/Navbar"; // Import the Navbar component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar /> {/* Render the Navbar at the top level */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generate-video" element={<VideoGenerator />} />
          <Route path="/my-videos" element={<MyVideos />} /> {/* New route for MyVideos */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;