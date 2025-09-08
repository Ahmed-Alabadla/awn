"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, ArrowRight } from "lucide-react";
import { Announcement } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AnnouncementCard({
  announcement,
  isFavorite,
  onToggleFavorite,
}: {
  announcement: Announcement;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const calculateDaysLeft = (endDate: string): string => {
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const daysLeft = announcement.end_date
    ? calculateDaysLeft(String(announcement.end_date))
    : "Expired";

  const isExpired = daysLeft === "Expired";
  const isUrgent =
    !isExpired &&
    (daysLeft === "Today" ||
      daysLeft === "1 day left" ||
      (parseInt(daysLeft) <= 3 && parseInt(daysLeft) > 0));

  const { isAuthenticated } = useAuth();

  return (
    <Card className="group hover:shadow-hero transition-all duration-300 hover:-translate-y-0.5 pt-0 flex flex-col h-full">
      {/* Wrap clickable area */}

      {announcement.image && (
        <Image
          src={announcement.image}
          alt={announcement.title}
          width={800}
          height={192}
          className="w-full h-48 object-cover rounded-t-2xl"
          priority
        />
      )}

      <Link
        href={`/announcements/${announcement.id}`}
        className="flex flex-col flex-1"
      >
        <CardHeader>
          <div className="flex items-start justify-between ">
            <Badge variant="outline">{announcement.category_name}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault(); // stop link click
                onToggleFavorite();
              }}
              className={`shrink-0 transition-colors hover:bg-background ${
                isFavorite
                  ? "text-white bg-red-500 hover:bg-red-600"
                  : "text-gray-400 hover:text-red-500 hover:border-red-500"
              }`}
              disabled={!isAuthenticated}
            >
              <Heart
                className="w-5 h-5"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </Button>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {announcement.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground font-medium">
            {announcement.organization_name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          <p className="text-foreground leading-relaxed line-clamp-1 overflow-hidden">
            {announcement.description}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span
              className={`font-medium ${
                isExpired
                  ? "text-red-600"
                  : isUrgent
                  ? "text-orange-600"
                  : "text-muted-foreground"
              }`}
            >
              {daysLeft}
            </span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex gap-2 mt-auto">
        <Button asChild variant="hero" className="flex-1 group">
          <a href={announcement.url} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
        {/* Arrow button also links to detail */}
        <Button asChild variant="outline" size="icon">
          <Link href={`/announcements/${announcement.id}`}>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
