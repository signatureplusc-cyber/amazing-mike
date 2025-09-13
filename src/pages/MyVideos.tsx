"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyVideos = () => {
  // In a real application, this would fetch videos from a backend
  const videos: any[] = []; // Placeholder for video data

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
              {/* Placeholder for actual video cards */}
              {videos.map((video) => (
                <Card key={video.id} className="p-4">
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                  {/* Add more video details here */}
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