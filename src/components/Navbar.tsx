"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Navbar = () => {
  const isMobile = useIsMobile();
  const { user, signOut, loading } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Generate Video", href: "/generate-video" },
    { name: "My Videos", href: "/my-videos" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return null;
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                <Button variant="ghost" className="w-full justify-start">
                  {link.name}
                </Button>
              </Link>
            ))}
            {user && (
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  Profile
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}
            {user && (
              <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-full border-b bg-background sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">Immaculate Videos</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <Link to={link.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            {user && (
              <NavigationMenuItem>
                <Link to="/profile">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {!user && (
              <NavigationMenuItem>
                <Link to="/auth">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sign In / Sign Up
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {user && (
              <NavigationMenuItem>
                <Button variant="ghost" onClick={handleSignOut} className="text-red-500 hover:text-red-600">
                  Sign Out
                </Button>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;