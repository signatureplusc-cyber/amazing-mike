import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Video } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-lg text-center p-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">Welcome to Your Dyad App</CardTitle>
          <CardDescription className="text-xl text-gray-600 dark:text-gray-400">
            Generate and manage your social media videos with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Hello, {user.user_metadata.full_name || user.email}! What would you like to do today?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/generate-video">
                  <Button size="lg" className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-5 w-5" /> Generate New Video
                  </Button>
                </Link>
                <Link to="/my-videos">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Video className="mr-2 h-5 w-5" /> View My Videos
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Sign in to start generating and managing your videos.
              </p>
              <Button size="lg" onClick={() => { /* signInWithGoogle is handled by Sidebar */ }}>
                Sign In to Get Started
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Index;