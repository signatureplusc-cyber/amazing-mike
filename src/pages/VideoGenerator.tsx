"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // Import supabase
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const VideoGenerator = () => {
  const { user } = useAuth(); // Get the current user from AuthContext
  const [videoIdea, setVideoIdea] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const socialMediaPlatforms = [
    { id: "youtube", name: "YouTube" },
    { id: "tiktok", name: "TikTok" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "twitter", name: "X (formerly Twitter)" },
  ];

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setSelectedPlatforms((prev) =>
      checked ? [...prev, platformId] : prev.filter((id) => id !== platformId)
    );
  };

  const handleGenerateVideo = async () => {
    if (!user) {
      toast.error("You must be logged in to generate videos.");
      return;
    }
    if (!videoIdea.trim()) {
      toast.error("Please enter a video idea.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one social media platform.");
      return;
    }

    setIsGenerating(true);
    const loadingToastId = toast.loading("Generating video and preparing for posting...");

    try {
      // Simulate video generation (replace with actual logic later)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save video metadata to Supabase
      const { data, error } = await supabase
        .from("videos")
        .insert([
          {
            user_id: user.id,
            title: videoIdea,
            description: videoDescription,
            platforms: selectedPlatforms,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Video generated and saved successfully!", { id: loadingToastId });
      console.log("Video saved:", data);

      // Reset form after generation
      setVideoIdea("");
      setVideoDescription("");
      setSelectedPlatforms([]);
    } catch (error: any) {
      toast.error(`Failed to generate video: ${error.message}`, { id: loadingToastId });
      console.error("Error generating video:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Immaculate Videos</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Enter your video idea, add a description, and select platforms to post to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="videoIdea">Video Idea</Label>
            <Input
              id="videoIdea"
              placeholder="e.g., 'A day in the life of a developer'"
              value={videoIdea}
              onChange={(e) => setVideoIdea(e.target.value)}
              disabled={isGenerating}
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
              disabled={isGenerating}
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
                    disabled={isGenerating}
                  />
                  <Label htmlFor={platform.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={handleGenerateVideo}
            className="w-full py-3 text-lg"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Video & Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoGenerator;