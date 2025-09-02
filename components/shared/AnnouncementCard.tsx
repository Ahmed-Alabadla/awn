"use client";

import { useState } from "react";
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

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  // Local state for favorite toggle
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate days left until deadline
  const calculateDaysLeft = (endDate: Date): string => {
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

  const daysLeft = calculateDaysLeft(announcement.end_date);
  const isExpired = daysLeft === "Expired";
  const isUrgent =
    !isExpired &&
    (daysLeft === "Today" ||
      daysLeft === "1 day left" ||
      (parseInt(daysLeft) <= 3 && parseInt(daysLeft) > 0));

  return (
    <Card
      key={announcement.id}
      className="group hover:shadow-hero transition-all duration-300 hover:-translate-y-0.5"
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline">{announcement.category_name}</Badge>

          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`transition ${isFavorite ? "text-red-600" : "text-gray-400 hover:text-red-500"
              }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>

        </div>

        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {announcement.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground font-medium">
          {announcement.organization_name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">
          {announcement.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span
              className={`font-medium ${isExpired
                  ? "text-red-600"
                  : isUrgent
                    ? "text-orange-600"
                    : "text-muted-foreground"
                }`}
            >
              {daysLeft}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="hero" className="flex-1 group">
          Apply Now
        </Button>
        <Button variant="outline" size="icon">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
