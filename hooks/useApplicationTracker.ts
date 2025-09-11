import { ApiError } from "@/lib/types";
import { ApplicationTrackingValues } from "@/lib/validation";
import { applicationTrackerService } from "@/services/application-tracker.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useApplicationTracker = (announcementId?: number) => {
  const queryClient = useQueryClient();

  // Get all trackers
  const {
    data: trackers,
    isLoading: isLoadingTrackers,
    error: trackersError,
  } = useQuery({
    queryKey: ["ApplicationTrackers"],
    queryFn: applicationTrackerService.getTrackers,
  });

  // Get tracker by announcement ID
  const getTrackerByAnnouncementId = (id: number) => {
    return trackers?.find((tracker) => tracker.announcement.id === id);
  };

  // Get current tracker for the provided announcement ID
  const currentTracker = announcementId
    ? getTrackerByAnnouncementId(announcementId)
    : undefined;

  // Create or update tracker
  const createOrUpdateTracker = useMutation({
    mutationKey: ["createOrUpdateTracker"],
    mutationFn: async ({
      announcementId,
      data,
    }: {
      announcementId: number;
      data: ApplicationTrackingValues;
    }) => applicationTrackerService.createOrUpdateTracker(announcementId, data),
    onSuccess: () => {
      toast.success("Application tracker updated successfully");
      // Invalidate queries to refresh data

      queryClient.invalidateQueries({
        queryKey: ["ApplicationTrackers"],
      });
    },
    onError: (error: ApiError) => {
      console.log("Error updating application tracker:", error);

      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0]
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Failed to update application tracker. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // Delete tracker
  const deleteTracker = useMutation({
    mutationKey: ["deleteTracker"],
    mutationFn: async (trackerId: number) =>
      applicationTrackerService.deleteTracker(trackerId),
    onSuccess: () => {
      toast.success("Application tracker deleted successfully");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["ApplicationTrackers"],
      });
    },
    onError: (error: ApiError) => {
      console.log("Error deleting application tracker:", error);
      const errorStatusText = error?.response?.statusText || "Unknown error";
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to delete application tracker. Please try again.";
      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  return {
    trackers,
    isLoadingTrackers,
    trackersError,

    currentTracker,
    createOrUpdateTracker: createOrUpdateTracker.mutate,
    isUpdatingTracker: createOrUpdateTracker.isPending,

    deleteTracker: deleteTracker.mutate,
    isDeletingTracker: deleteTracker.isPending,
  };
};
