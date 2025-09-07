"use client";

import { Button } from "@/components/ui/button";
import { Announcement } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import { useAnnouncements } from "@/hooks/useAnnouncement";

export default function FeaturedAnnouncements() {
  const { announcements = [], isLoadingAnnouncements } = useAnnouncements();
  const [favorites, setFavorites] = useState<Announcement[]>([]);

  function toggleFavorite(announcement: Announcement) {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((a) => a.id === announcement.id);
      if (isAlreadyFavorite) {
        return prev.filter((a) => a.id !== announcement.id);
      } else {
        return [...prev, announcement];
      }
    });
  }

  // 📌 Get the last 3 announcements
  const lastAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  if (isLoadingAnnouncements) {
    return (
      <section className="py-16 bg-background text-center">
        <p>Loading featured announcements...</p>
      </section>
    );
  }

  return (
    <section id="announcements" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Announcements
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover urgent announcements where your support can make an immediate impact
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lastAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isFavorite={favorites.some((a) => a.id === announcement.id)}
              onToggleFavorite={() => toggleFavorite(announcement)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">
              View All Announcements
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
