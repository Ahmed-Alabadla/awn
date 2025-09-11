"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApplicationTracker } from "@/hooks/useApplicationTracker";
import { ApplicationTracker } from "@/lib/types";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Search,
  StickyNote,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import ApplicationTrackingDialog from "@/components/shared/ApplicationTrackingDialog";

interface ApplicationCardProps {
  tracker: ApplicationTracker;
  onEdit: () => void;
  onDelete: () => void;
}

function ApplicationCard({ tracker, onEdit, onDelete }: ApplicationCardProps) {
  const { announcement } = tracker;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateDaysLeft = (endDate: string): string => {
    if (!mounted) return "Loading...";

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

  const isExpired = mounted && daysLeft === "Expired";
  const isUrgent =
    mounted &&
    !isExpired &&
    (daysLeft === "Today" ||
      daysLeft === "1 day left" ||
      (parseInt(daysLeft) <= 3 && parseInt(daysLeft) > 0));

  const formatDate = (date: Date | string) => {
    if (!mounted) return "Loading...";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full pt-0">
      {announcement.image && (
        <div className="relative">
          <Image
            src={announcement.image}
            alt={announcement.title}
            width={400}
            height={160}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant={tracker.status === "applied" ? "default" : "secondary"}
              className={`${
                tracker.status === "applied"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              {tracker.status === "applied" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 mr-1" />
              )}
              {tracker.status === "applied" ? "Applied" : "Not Applied"}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-xs mb-2">
            {announcement.category?.name}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Tracker
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/announcements/${announcement.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {announcement.url && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/announcements/${announcement.id}/apply`}
                    // target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Application
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Tracker
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {announcement.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {announcement.organization_name}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
          {announcement.description}
        </p>

        {tracker.notes && (
          <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
            <StickyNote className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
              {tracker.notes}
            </p>
          </div>
        )}

        <div className="space-y-2">
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

          {tracker.reminder_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Reminder: {formatDate(tracker.reminder_date)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-shrink-0 pt-0">
        <div className="w-full space-y-2">
          <Separator />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tracked: {formatDate(tracker.created_at)}</span>
            <span>Updated: {formatDate(tracker.updated_at)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ApplicationsSection() {
  const { trackers, isLoadingTrackers, deleteTracker } =
    useApplicationTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [editingTracker, setEditingTracker] =
    useState<ApplicationTracker | null>(null);
  const [deletingTracker, setDeletingTracker] =
    useState<ApplicationTracker | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only showing date calculations on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle delete confirmation
  const handleDeleteTracker = (tracker: ApplicationTracker) => {
    setDeletingTracker(tracker);
  };

  const confirmDeleteTracker = () => {
    if (deletingTracker) {
      deleteTracker(deletingTracker.announcement.id);
      setDeletingTracker(null);
    }
  };

  // Filter and sort trackers
  const filteredAndSortedTrackers = useMemo(() => {
    if (!trackers) return [];
    if (!isClient) return trackers; // Return unsorted data during SSR

    const filtered = trackers.filter((tracker) => {
      // Search filter
      const matchesSearch =
        tracker.announcement.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tracker.announcement.organization_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tracker.announcement.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (tracker.notes &&
          tracker.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus =
        statusFilter === "all" || tracker.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "deadline":
          const aDeadline = new Date(a.announcement.end_date || "");
          const bDeadline = new Date(b.announcement.end_date || "");
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if deadlines are expired
          const aExpired = aDeadline.getTime() < today.getTime();
          const bExpired = bDeadline.getTime() < today.getTime();

          // If one is expired and the other is not, non-expired comes first
          if (aExpired && !bExpired) return 1;
          if (!aExpired && bExpired) return -1;

          // If both are expired or both are not expired, sort by deadline
          return aDeadline.getTime() - bDeadline.getTime();
        case "alphabetical":
          return a.announcement.title.localeCompare(b.announcement.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trackers, searchQuery, statusFilter, sortBy, isClient]);

  // Get counts for tabs
  const appliedCount =
    trackers?.filter((t) => t.status === "applied").length || 0;
  const notAppliedCount =
    trackers?.filter((t) => t.status === "not applied").length || 0;

  if (isLoadingTrackers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!trackers || trackers.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="space-y-2">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">No Applications Tracked</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven&apos;t tracked any applications yet. Start tracking your
            applications to keep organized and never miss a deadline.
          </p>
        </div>
        <Button asChild>
          <Link href="/announcements">
            <Plus className="w-4 h-4 mr-2" />
            Browse Announcements
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-muted-foreground">
          Track and manage all your application submissions in one place.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="not applied">Not Applied</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="deadline">By Deadline</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="hidden sm:block"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({trackers?.length || 0})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedCount})</TabsTrigger>
            <TabsTrigger value="not applied">
              Not Applied ({notAppliedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      {filteredAndSortedTrackers.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Search className="w-12 h-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedTrackers.length} of {trackers.length}{" "}
            applications
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTrackers.map((tracker) => (
              <ApplicationCard
                key={tracker.id}
                tracker={tracker}
                onEdit={() => setEditingTracker(tracker)}
                onDelete={() => handleDeleteTracker(tracker)}
              />
            ))}
          </div>
        </>
      )}

      {/* Edit Dialog */}
      {editingTracker && (
        <ApplicationTrackingDialog
          open={!!editingTracker}
          onOpenChange={(open) => !open && setEditingTracker(null)}
          announcementId={editingTracker.announcement.id}
          announcementTitle={editingTracker.announcement.title}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingTracker}
        onOpenChange={(open) => !open && setDeletingTracker(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application Tracker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application tracker for{" "}
              <span className="text-primary">
                &quot;{deletingTracker?.announcement.title}&quot;
              </span>{" "}
              ? This action cannot be undone and will permanently remove all
              tracking data for this application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTracker}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Tracker
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
