"use client";

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
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react";
import {
  useOrganizationAnnouncements,
  useOrganizationById,
} from "@/hooks/useOrganization";
import { useTabsStore } from "@/hooks/useTabsStore";
import { useFavorite } from "@/hooks/useFavorite";

export default function OrganizationDetailPage() {
  const params = useParams();
  const { setActiveTab } = useTabsStore();

  const organizationId = Number(params.id);

  const { organization, isLoadingOrganization } =
    useOrganizationById(organizationId);
  const { announcements, isLoadingAnnouncements } =
    useOrganizationAnnouncements(organizationId);

  // Favorites
  const { favorites, addFavorite, removeFavorite } = useFavorite();

  const toggleFavorite = async (announcement: Announcement) => {
    const isFav = favorites.some((f) => f.id === announcement.id);

    if (isFav) {
      await removeFavorite(announcement.id);
    } else {
      await addFavorite(announcement.id);
    }
  };

  if (isLoadingOrganization || isLoadingAnnouncements) {
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
          <Link href="/" onClick={() => setActiveTab("Organizations")}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </Link>
        </div>

        {/* Organization Hero Section */}
        <div className="relative mb-8">
          {/* Background Image */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden rounded-lg">
            {organization.profile_image ? (
              <Image
                src={organization.profile_image}
                alt={organization.organization_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0086cb] to-[#009550]" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-lg" />

            {/* Verification Badge */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-2">
              <Badge
                variant={organization.verified ? "default" : "secondary"}
                className={`${
                  organization.verified
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white text-xs sm:text-sm`}
              >
                {organization.verified
                  ? "Verified Organization"
                  : "Pending Verification"}
              </Badge>
            </div>

            {/* Organization Name - Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-white drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
                  {organization.organization_name}
                </h1>
                <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    Member since{" "}
                    {new Date(organization.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">
            About this organization
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {organization.description}
          </p>
        </div>

        {/* Organization Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.email}
                  </p>
                </div>
              </div>

              {organization.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
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
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {organization.location}
                    </p>
                  </div>
                </div>
              )}
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
            {announcements && announcements.length > 0 ? (
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
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">No active programs</p>
                  <p>
                    This organization doesn&apos;t have any active aid programs
                    at the moment.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
