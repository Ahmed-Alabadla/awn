"use client";

import { useParams } from "next/navigation";
import { useAnnouncementById } from "@/hooks/useAnnouncement";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AnnouncementDetailPage() {
  const { id } = useParams(); // from route /announcements/[id]
  const announcementId = Number(id);

  const { announcement, isLoadingAnnouncement, errorAnnouncement } =
    useAnnouncementById(announcementId);

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

  const isExpired = new Date(announcement.end_date) < new Date();

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back button outside card */}
      <Button variant="outline" asChild>
        <Link href="/">← Back to Announcements</Link>
      </Button>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden relative">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          {announcement.category_name}
        </div>

        {/* Image */}
        {announcement.image && (
          <div className="relative w-full h-64">
            <Image
              src={announcement.image}
              alt={announcement.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{announcement.title}</h1>
          <p className="text-muted-foreground mb-4">
            {announcement.organization_name} • by {announcement.creator_name}
          </p>

          <div className="prose max-w-none mb-6">
            <p>{announcement.description}</p>
          </div>

          {/* Duration & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-semibold">Duration</p>
              <p>
                {new Date(announcement.start_date).toLocaleDateString()} -{" "}
                {new Date(announcement.end_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="capitalize">{announcement.status}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {!isExpired && announcement.url ? (
              <Button asChild>
                <a
                  href={announcement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
              </Button>
            ) : (
              <>
                <Button disabled>Application Closed</Button>
                <Button variant="secondary">Contact Organization</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
