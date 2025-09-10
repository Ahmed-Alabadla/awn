"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAnnouncementById } from "@/hooks/useAnnouncement";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProxyIframe from "@/components/shared/ProxyIframe";

export default function AnnouncementApplyPage() {
  const params = useParams();
  const router = useRouter();

  const { announcement, isLoadingAnnouncement, errorAnnouncement } =
    useAnnouncementById(Number(params.id));

  if (isLoadingAnnouncement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (errorAnnouncement || !announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Announcement not found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold truncate max-w-md">
                {announcement.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {announcement.organization_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="container mx-auto flex-1 flex flex-col">
          <ProxyIframe
            url={announcement.url}
            title={`Application form for ${announcement.title}`}
            announcementId={Number(params.id)}
            height="calc(100vh - 140px)"
            className="flex-1"
            allowFullscreen={true}
            showExternalLink={false}
            showRefresh={true}
            onError={(error) => {
              console.error("ProxyIframe error:", error);
            }}
          />
        </div>
      </div>
    </div>
  );
}
