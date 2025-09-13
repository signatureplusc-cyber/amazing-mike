"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
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
  user_id: string;
}

const MyVideos = () => {
  const { user, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        setLoadingVideos(false);
        return;
      }

      setLoadingVideos(true);
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
      setLoadingVideos(false);
    };

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
        .eq("user_id", user?.id);

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

  if (authLoading || loadingVideos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading your videos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg text-center p-8">
          <CardTitle className="text-3xl font-bold mb-4">Access Denied</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your videos.
          </CardDescription>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Videos</h1>
          <Link to="/generate-video">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Generate New Video
            </Button>
          </Link>
        </div>

        {videos.length === 0 ? (
          <Card className="text-center p-8">
            <CardTitle className="text-2xl mb-4">No Videos Yet!</CardTitle>
            <CardDescription className="mb-6">
              It looks like you haven't generated any videos. Start by creating your first one!
            </CardDescription>
            <Link to="/generate-video">
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> Generate Video
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl truncate">{video.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(video.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {video.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                  <Link to={`/my-videos/${video.id}`}>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </Link>
                  <Link to={`/my-videos/${video.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" disabled={deletingVideoId === video.id}>
                        {deletingVideoId === video.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
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
                        <AlertDialogAction onClick={() => handleDeleteVideo(video.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVideos;