"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  created_at: string;
  user_id: string;
}

const EditVideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const socialMediaPlatforms = [
    { id: "youtube", name: "YouTube" },
    { id: "tiktok", name: "TikTok" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "twitter", name: "X (formerly Twitter)" },
  ];

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
        .single();

      if (error) {
        toast.error(`Failed to fetch video details: ${error.message}`);
        console.error("Error fetching video details:", error);
        setVideo(null);
      } else {
        setVideo(data);
        setVideoTitle(data.title);
        setVideoDescription(data.description || "");
        setSelectedPlatforms(data.platforms || []);
      }
      setLoading(false);
    };

    if (!authLoading && id) {
      fetchVideoDetails();
    }
  }, [id, user, authLoading]);

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setSelectedPlatforms((prev) =>
      checked ? [...prev, platformId] : prev.filter((pId) => pId !== platformId)
    );
  };

  const handleSaveVideo = async () => {
    if (!user || !video) {
      toast.error("You must be logged in to edit videos.");
      return;
    }
    if (!videoTitle.trim()) {
      toast.error("Video title cannot be empty.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one social media platform.");
      return;
    }

    setIsSaving(true);
    const loadingToastId = toast.loading("Saving video changes...");

    try {
      const { error } = await supabase
        .from("videos")
        .update({
          title: videoTitle,
          description: videoDescription,
          platforms: selectedPlatforms,
        })
        .eq("id", video.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Video updated successfully!", { id: loadingToastId });
      navigate(`/my-videos/${video.id}`); // Navigate back to video details page
    } catch (error: any) {
      toast.error(`Failed to update video: ${error.message}`, { id: loadingToastId });
      console.error("Error updating video:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading video for editing...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-2xl shadow-lg text-center p-8">
          <CardTitle className="text-3xl font-bold mb-4">Video Not Found</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mb-6">
            The video you are looking for does not exist or you do not have permission to edit it.
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Edit Video</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Modify the details of your video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title</Label>
            <Input
              id="videoTitle"
              placeholder="e.g., 'A day in the life of a developer'"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoDescription">Video Description (Optional)</Label>
            <Textarea
              id="videoDescription"
              placeholder="Provide more details about your video content."
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              rows={4}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Social Media Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialMediaPlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) =>
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                    disabled={isSaving}
                  />
                  <Label htmlFor={platform.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/my-videos/${video.id}`)}
              disabled={isSaving}
              className="w-full py-3 text-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleSaveVideo}
              className="w-full py-3 text-lg"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVideoPage;