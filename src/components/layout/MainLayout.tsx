"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 ${!isMobile ? "ml-64" : "pt-16"} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;