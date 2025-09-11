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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Heart, ArrowRight } from "lucide-react";
import { Announcement } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import ProxyIframe from "./ProxyIframe";
import ApplicationTrackingDialog from "./ApplicationTrackingDialog";

export default function AnnouncementCard({
  announcement,
  isFavorite,
  onToggleFavorite,
}: {
  announcement: Announcement;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

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
    <Card className="group hover:shadow-hero transition-all duration-300 hover:-translate-y-0.5 pt-0 flex flex-col h-full overflow-hidden">
      {/* Wrap clickable area */}

      {announcement.image && (
        <Image
          src={announcement.image}
          alt={announcement.title}
          width={800}
          height={192}
          className="w-full h-32 md:h-48 object-cover rounded-t-2xl"
          priority
        />
      )}

      {isAuthenticated ? (
        <Link
          href={`/announcements/${announcement.id}`}
          className="flex flex-col flex-1"
        >
          <CardHeader className="!pt-0 p-3 md:p-6">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="text-xs">
                {announcement.category_name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault(); // stop link click
                  onToggleFavorite();
                }}
                className={`shrink-0 transition-colors hover:bg-background h-8 w-8 p-0 ${
                  isFavorite
                    ? "text-white bg-red-500 hover:bg-red-600"
                    : "text-gray-400 hover:text-red-500 hover:border-red-500"
                }`}
                disabled={!isAuthenticated}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </Button>
            </div>
            <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors line-clamp-2">
              {announcement.title}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-muted-foreground font-medium">
              {announcement.organization_name}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 md:space-y-4 flex-1 p-3 md:p-6 !py-0">
            <p className="text-foreground leading-relaxed line-clamp-2 md:line-clamp-1 overflow-hidden text-sm md:text-base">
              {announcement.description}
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm">
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
      ) : (
        <div className="flex flex-col flex-1">
          <CardHeader className="!pt-0 p-3 md:p-6 ">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="text-xs">
                {announcement.category_name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault(); // stop link click
                  onToggleFavorite();
                }}
                className={`shrink-0 transition-colors hover:bg-background h-8 w-8 p-0 ${
                  isFavorite
                    ? "text-white bg-red-500 hover:bg-red-600"
                    : "text-gray-400 hover:text-red-500 hover:border-red-500"
                }`}
                disabled={!isAuthenticated}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </Button>
            </div>
            <CardTitle className="text-lg md:text-xl line-clamp-2">
              {announcement.title}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-muted-foreground font-medium">
              {announcement.organization_name}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 md:space-y-4 flex-1 p-3 md:p-6 !py-0">
            <p className="text-foreground leading-relaxed line-clamp-2 md:line-clamp-1 overflow-hidden text-sm md:text-base">
              {announcement.description}
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm">
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
        </div>
      )}

      <CardFooter className="flex flex-row gap-2 mt-auto !py-0 p-3 md:p-6">
        {isAuthenticated ? (
          <>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                // When apply dialog closes, open tracking dialog
                if (!open) {
                  setTimeout(() => setIsTrackingDialogOpen(true), 300);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="hero"
                  className="group text-sm md:text-base flex-1"
                  disabled={isExpired}
                >
                  {isExpired ? "Application Closed" : "Apply Now"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] md:max-w-5xl p-2 md:p-6">
                <DialogHeader className="pb-2 md:pb-4">
                  <DialogTitle className="text-base md:text-lg line-clamp-2">
                    Apply for: {announcement.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                    Complete your application for this announcement from{" "}
                    {announcement.organization_name}
                  </DialogDescription>
                </DialogHeader>

                <ProxyIframe
                  url={announcement.url}
                  title={`Application form for ${announcement.title}`}
                  announcementId={announcement.id}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                  className="flex-1 min-h-[50vh] md:min-h-[60vh]"
                />
              </DialogContent>
            </Dialog>

            <ApplicationTrackingDialog
              open={isTrackingDialogOpen}
              onOpenChange={setIsTrackingDialogOpen}
              announcementId={announcement.id}
              announcementTitle={announcement.title}
            />
          </>
        ) : (
          <Button
            asChild
            variant="hero"
            className="w-full sm:flex-1 group text-sm md:text-base"
          >
            <Link href="/login">Read More</Link>
          </Button>
        )}
        {/* Arrow button also links to detail */}
        <Button asChild variant="outline" size="icon">
          {isAuthenticated && (
            <Link href={`/announcements/${announcement.id}`}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
