"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";

const socialMediaPlatforms = [
  { id: "youtube", name: "YouTube" },
  { id: "tiktok", name: "TikTok" },
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "X (formerly Twitter)" },
] as const;

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must not exceed 100 characters." }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters." }).optional(),
  platforms: z.array(z.string()).min(1, { message: "Please select at least one platform." }),
});

interface Video {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  created_at: string;
  user_id: string;
}

const EditVideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      platforms: [],
    },
  });

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
        form.reset({
          title: data.title,
          description: data.description || "",
          platforms: data.platforms,
        });
      }
      setLoadingVideo(false);
    };

    if (!authLoading && id) {
      fetchVideoDetails();
    }
  }, [id, user, authLoading]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !id) {
      toast.error("Authentication error or video ID missing.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Updating video...");

    try {
      const { error } = await supabase
        .from("videos")
        .update({
          title: values.title,
          description: values.description,
          platforms: values.platforms,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Video updated successfully!", { id: loadingToastId });
      navigate(`/my-videos/${id}`);
    } catch (error: any) {
      toast.error(`Failed to update video: ${error.message}`, { id: loadingToastId });
      console.error("Error updating video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loadingVideo) {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Edit Video: {video.title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Modify the details of your video.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Video" {...field} />
                    </FormControl>
                    <FormDescription>
                      A catchy title for your video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about your video"
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your video content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platforms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Target Platforms</FormLabel>
                      <FormDescription>
                        Select the social media platforms you want to target.
                      </FormDescription>
                    </div>
                    {socialMediaPlatforms.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="platforms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-4 mt-6">
                <Link to={`/my-videos/${id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </Link>
                <Button type="submit" className="w-full flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVideoPage;