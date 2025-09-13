"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  created_at: string;
}

const VideoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(); // Use .single() to get a single record

      if (error) {
        toast.error(`Failed to fetch video details: ${error.message}`);
        console.error("Error fetching video details:", error);
        setVideo(null);
      } else {
        setVideo(data);
      }
      setLoading(false);
    };

    if (!authLoading && id) {
      fetchVideoDetails();
    }
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading video details...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-2xl shadow-lg text-center p-8">
          <CardTitle className="text-3xl font-bold mb-4">Video Not Found</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mb-6">
            The video you are looking for does not exist or you do not have permission to view it.
          </CardDescription>
          <Link to="/my-videos">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Videos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{video.title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Details for your generated video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {video.description || "No description provided."}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Platforms:</h3>
            <div className="flex flex-wrap gap-2">
              {video.platforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated On:</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(video.created_at).toLocaleDateString()} at{" "}
              {new Date(video.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/my-videos">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Videos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoDetailsPage;