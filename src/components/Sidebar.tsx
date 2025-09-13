"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Video, PlusCircle, LogIn, LogOut, UserCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive, onClick }) => (
  <Link to={to} onClick={onClick}>
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start text-lg h-12 px-4"
    >
      {icon}
      <span className="ml-3">{label}</span>
    </Button>
  </Link>
);

const Sidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signOut, signInWithGoogle } = useAuth();

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    closeSidebar();
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
    closeSidebar();
  };

  const navigationItems = [
    { to: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { to: "/generate-video", label: "Generate Video", icon: <PlusCircle className="h-5 w-5" />, authRequired: true },
    { to: "/my-videos", label: "My Videos", icon: <Video className="h-5 w-5" />, authRequired: true },
  ];

  const renderNavLinks = () => (
    <nav className="flex flex-col gap-2 p-4">
      {navigationItems.map((item) =>
        !item.authRequired || user ? (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
            onClick={closeSidebar}
          />
        ) : null
      )}
    </nav>
  );

  const userProfileSection = (
    <div className="p-4 border-t dark:border-gray-700">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-12 px-4">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                <AvatarFallback>
                  <UserCircle2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="text-lg truncate">{user.user_metadata.full_name || user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={handleSignIn} className="w-full justify-start text-lg h-12 px-4">
          <LogIn className="h-5 w-5 mr-3" />
          Sign In
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 text-2xl font-bold border-b dark:border-gray-700">Dyad App</div>
            {renderNavLinks()}
          </div>
          {userProfileSection}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 border-r dark:border-gray-700 bg-sidebar-background text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 text-2xl font-bold border-b dark:border-gray-700">Dyad App</div>
      <div className="flex-1 overflow-y-auto">
        {renderNavLinks()}
      </div>
      {userProfileSection}
    </div>
  );
};

export default Sidebar;