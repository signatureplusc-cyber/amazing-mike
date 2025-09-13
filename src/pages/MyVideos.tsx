"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { Trash2, Edit } from "lucide-react"; // Import Edit icon

interface Video {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  created_at: string;
}

const MyVideos = () => {
  const { user, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const fetchVideos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(`Failed to fetch videos: ${error.message}`);
      console.error("Error fetching videos:", error);
      setVideos([]);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchVideos();
    }
  }, [user, authLoading]);

  const handleDeleteVideo = async (videoId: string) => {
    setDeletingVideoId(videoId);
    const loadingToastId = toast.loading("Deleting video...");

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId)
        .eq("user_id", user?.id); // Ensure only the owner can delete

      if (error) throw error;

      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
      toast.success("Video deleted successfully!", { id: loadingToastId });
    } catch (error: any) {
      toast.error(`Failed to delete video: ${error.message}`, { id: loadingToastId });
      console.error("Error deleting video:", error);
    } finally {
      setDeletingVideoId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">My Videos</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            View and manage your generated videos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {videos.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                You haven't generated any videos yet.
              </p>
              <Link to="/generate-video">
                <Button size="lg">
                  Generate Your First Video
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="p-4 flex flex-col justify-between">
                  <Link to={`/my-videos/${video.id}`} className="block cursor-pointer">
                    <div>
                      <CardTitle className="text-xl mb-2">{video.title}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                        {video.description || "No description provided."}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {video.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generated: {new Date(video.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/my-videos/${video.id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit video</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" disabled={deletingVideoId === video.id}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete video</span>
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
                            <AlertDialogAction onClick={() => handleDeleteVideo(video.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyVideos;