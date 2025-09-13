"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg text-center p-8">
          <CardTitle className="text-3xl font-bold mb-4">Access Denied</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mb-6">
            You must be logged in to view your profile.
          </CardDescription>
          <Link to="/auth">
            <Button>Sign In / Sign Up</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Email:</p>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">{user.email}</p>
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;