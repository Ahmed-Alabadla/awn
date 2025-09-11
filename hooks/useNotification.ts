import { ApiError } from "@/lib/types";
import { notificationService } from "@/services/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export const useNotification = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    refetchOnWindowFocus: false,
    enabled: !!isAuthenticated,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Failed to delete notification. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: notificationService.deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications deleted");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Failed to delete all notifications. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  return {
    notifications,
    isLoadingNotifications,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeletingNotification: deleteNotificationMutation.isPending,
    deleteAllNotifications: deleteAllNotificationsMutation.mutate,
    isDeletingAllNotifications: deleteAllNotificationsMutation.isPending,
  };
};
