"use client";
import { Heart, Menu, X, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // check if we are on announcements page
  const isAnnouncementsPage = true;

  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-hero-gradient bg-clip-text text-transparent">
                Awn
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {!isAnnouncementsPage && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Button variant={pathname === "/" ? "default" : "ghost"}>
                  <Link href="/">Home</Link>
                </Button>
                <Button
                  variant={pathname === "/announcements" ? "default" : "ghost"}
                >
                  <Link href="/announcements">Announcements</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/about">About</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right side: Auth + Icons */}
          <div className="flex items-center space-x-4">
            {/* Show icons only on announcements page */}
            {isAnnouncementsPage && (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </div>

                {/* Favorites */}
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    12
                  </span>
                </div>
              </div>
            )}

            {/* Auth */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="hero" size="sm" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button (only if not announcements) */}
            {!isAnnouncementsPage && (
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu (only if not on announcements page) */}
        {!isAnnouncementsPage && mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                Home
              </Button>
              <Button
                variant={pathname === "/about" ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                About
              </Button>
              <Button
                variant={pathname === "/announcements" ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                Announcements
              </Button>

              <div className="pt-4 border-t border-border mt-4">
                {isLoggedIn ? (
                  <UserMenu />
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="hero" className="w-full" asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
