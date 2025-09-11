"use client";

import { useParams } from "next/navigation";
import { useAnnouncementById } from "@/hooks/useAnnouncement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorite } from "@/hooks/useFavorite";
import { useState } from "react";
import { toast } from "sonner";
import ProxyIframe from "@/components/shared/ProxyIframe";
import ApplicationTrackingDialog from "@/components/shared/ApplicationTrackingDialog";

export default function AnnouncementDetailPage() {
  const { id } = useParams(); // from route /announcements/[id]
  const announcementId = Number(id);

  const { announcement, isLoadingAnnouncement, errorAnnouncement } =
    useAnnouncementById(announcementId);

  const { favorites, addFavorite, removeFavorite } = useFavorite();
  const [isFav, setIsFav] = useState(
    favorites.some((f) => f.id === announcementId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  if (isLoadingAnnouncement) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading announcement...</span>
      </div>
    );
  }

  if (errorAnnouncement) {
    return (
      <p className="text-center text-red-500">
        Failed to load announcement details.
      </p>
    );
  }

  if (!announcement) {
    return (
      <p className="text-center text-muted-foreground">
        Announcement not found.
      </p>
    );
  }
  // Favorites
  const toggleFavorite = async () => {
    const isFav = favorites.some((f) => f.id === announcement.id);
    setIsFav(!isFav);

    if (isFav) {
      await removeFavorite(announcement.id);
    } else {
      await addFavorite(announcement.id);
    }
  };

  // Share functionality
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success("URL copied successfully!");
    } catch {
      toast.error("Failed to copy URL. Please try again.");
    }
  };

  const isExpired = new Date(announcement.end_date) < new Date();

  // Format date function
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-t-lg border-b">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2  hover:bg-red-500 ${
              isFav ? "bg-red-500 text-white" : ""
            }`}
            onClick={toggleFavorite}
          >
            <Heart className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-blue-500"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="relative">
          {/* Background Image */}
          <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
            {announcement.image ? (
              <Image
                src={announcement.image}
                alt={announcement.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-lg" />

            {/* Badges and Heart */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {announcement?.category?.name}
              </Badge>
              {isExpired && <Badge variant="destructive">Expired</Badge>}
            </div>
          </div>

          {/* Title Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
              {announcement.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90 drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
              <User className="h-4 w-4" />
              <span>{announcement.organization_name}</span>
              <span>•</span>
              <span>Posted by {announcement.creator_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* About Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">About this opportunity</h2>
          <p className="text-gray-700 leading-relaxed">
            {announcement.description}
          </p>
        </div>

        {/* Duration and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Duration</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <p className="font-medium">Start Date:</p>
                <p>{formatDate(announcement.start_date)}</p>
              </div>
              <div>
                <p className="font-medium">End Date:</p>
                <p>{formatDate(announcement.end_date)}</p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Status</h3>
            </div>
            <div className="space-y-2">
              <Badge
                variant={
                  announcement.status === "approved" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {announcement.status}
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Created: {formatDate(announcement.created_at)}</p>
                <p>Updated: {formatDate(announcement.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {!isExpired && announcement.url ? (
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
                  <Button className="flex-1" variant="hero">
                    Apply Now
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
            ) : (
              <Button disabled className="flex-1" variant="hero">
                Application Closed
              </Button>
            )}
            {/* <Button variant="outline" className="flex-1">
              Contact Organization
            </Button> */}
          </div>
        </div>
      </div>

      <ApplicationTrackingDialog
        open={isTrackingDialogOpen}
        onOpenChange={setIsTrackingDialogOpen}
        announcementId={announcement.id}
        announcementTitle={announcement.title}
      />
    </div>
  );
}
