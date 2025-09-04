"use client";

import { Button } from "@/components/ui/button";
import { Announcement } from "@/lib/types";
import AnnouncementCard from "./AnnouncementCard";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Emergency Medical Fund",
    organization_name: "Children's Hope Foundation",
    description:
      "Urgent medical assistance for children in need. Providing life-saving treatments and medications.",
    start_date: new Date(),
    end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    category_name: "Health",
    url: "",
    creator_name: "Admin",
    status: "active",
    admin_notes: "",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: "Educational Scholarships",
    organization_name: "Future Leaders Institute",
    description:
      "Supporting bright students from underprivileged backgrounds to pursue higher education.",
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    category_name: "Education",
    url: "",
    creator_name: "Admin",
    status: "active",
    admin_notes: "",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    title: "Food Security Program",
    organization_name: "Community Care Network",
    description:
      "Providing nutritious meals to families facing food insecurity in rural communities.",
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    category_name: "Food",
    url: "",
    creator_name: "Admin",
    status: "active",
    admin_notes: "",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function FeaturedAnnouncements() {
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

  return (
    <section id="announcements" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Announcements
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover urgent announcements where your support can make an
            immediate impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
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
