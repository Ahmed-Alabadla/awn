"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react";
import { useOrganizationById } from "@/hooks/useOrganization";

export default function OrganizationDetailPage() {
  const params = useParams();
  const [favorites, setFavorites] = useState<Announcement[]>([]);

  const organizationId = Number(params.id);

  const { organization, isLoadingOrganization } =
    useOrganizationById(organizationId);
  // const { announcements = [], isLoadingAnnouncements } =
  //   useOrganizationAnnouncements(organizationId);

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

  // if (isLoadingOrganization || isLoadingAnnouncements) {
  if (isLoadingOrganization) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-muted-foreground">
              Loading organization details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Organization Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The organization you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/pages/announcements">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Announcements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/?tab=Organizations">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </Link>
        </div>

        {/* Organization Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex gap-6">
                {organization.profile_image ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar className="w-24 h-24 border-2 border-border cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage
                          src={organization.profile_image}
                          alt={`${organization.organization_name} profile`}
                        />
                        <AvatarFallback className="text-2xl font-bold">
                          {organization.organization_name
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {organization.organization_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <Image
                          src={organization.profile_image}
                          alt={`${organization.organization_name} profile`}
                          width={400}
                          height={400}
                          className="max-w-full max-h-96 object-contain rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Avatar className="w-24 h-24 border-2 border-border">
                    <AvatarImage
                      src={organization.profile_image || undefined}
                      alt={`${organization.organization_name} profile`}
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {organization.organization_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold">
                      {organization.organization_name}
                    </h1>
                    <Badge
                      variant={organization.verified ? "default" : "secondary"}
                    >
                      {organization.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {organization.description}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.email}
                  </p>
                </div>
              </div>

              {organization.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {organization.phone}
                    </p>
                  </div>
                </div>
              )}

              {organization.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <Link
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit Website
                    </Link>
                  </div>
                </div>
              )}

              {organization.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {organization.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(organization.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Aid Programs & Announcements
            </CardTitle>
            <CardDescription>
              Current aid programs and opportunities provided by{" "}
              {organization.organization_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* {announcements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    isFavorite={favorites.some((a) => a.id === announcement.id)}
                    onToggleFavorite={() => toggleFavorite(announcement)}
                  />
                ))}
              </div>
            ) : (
            )} */}
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">No active programs</p>
                <p>
                  This organization doesn&apos;t have any active aid programs at
                  the moment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
