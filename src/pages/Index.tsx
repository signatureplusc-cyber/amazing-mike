"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer"; // Import Footer to ensure it's used correctly if MadeWithDyad was there

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">Welcome to Immaculate Videos</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Generate new videos and post them to different social media platforms.
        </p>
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate-video">
              <Button size="lg">Generate a New Video</Button>
            </Link>
            <Link to="/my-videos">
              <Button size="lg" variant="outline">View My Videos</Button>
            </Link>
          </div>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <Link to="/auth">
              <Button size="lg">Sign in or Sign up</Button>
            </Link> to start generating videos!
          </p>
        )}
      </div>
      {/* Footer is now handled by App.tsx, so MadeWithDyad is removed from here */}
    </div>
  );
};

export default Index;