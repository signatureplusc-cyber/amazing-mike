"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Edit, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Video {
  id: string;
  title: string;
  description: string | null;
  platforms: string[];
  created_at: string;
  updated_at: string | null;
  user_id: string;
}

const VideoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!user || !id) {
        setLoadingVideo(false);
        return;
      }

      setLoadingVideo(true);
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast.error(`Failed to fetch video details: ${error.message}`);
        console.error("Error fetching video details:", error);
        setVideo(null);
      } else {
        setVideo(data);
      }
      setLoadingVideo(false);
    };

    if (!authLoading && id) {
      fetchVideoDetails();
    }
  }, [id, user, authLoading]);

  const handleDeleteVideo = async () => {
    if (!user || !id) {
      toast.error("Authentication error or video ID missing.");
      return;
    }

    setIsDeleting(true);
    const loadingToastId = toast.loading("Deleting video...");

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Video deleted successfully!", { id: loadingToastId });
      navigate("/my-videos");
    } catch (error: any) {
      toast.error(`Failed to delete video: ${error.message}`, { id: loadingToastId });
      console.error("Error deleting video:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loadingVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading video details...</p>
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
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/my-videos">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to My Videos</span>
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{video.title}</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{video.title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Created: {new Date(video.created_at).toLocaleDateString()}
              {video.updated_at && ` | Last Updated: ${new Date(video.updated_at).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {video.description || "No description provided."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Target Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {video.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 border-t pt-6 dark:border-gray-700">
              <Link to={`/my-videos/${video.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit Video
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Video
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your video
                      and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteVideo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoDetailsPage;