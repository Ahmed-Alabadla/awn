import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useOrganizationsAdmin = () => {
  // Get all organizations
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryKey: ["organizations-admin"],
      queryFn: () => adminService.getAllOrganizationsAdmin(),
    refetchOnWindowFocus: false,
  });

  return {
    organizations,
    isLoadingOrganizations,
  };
};


export const useApprovedAnnouncementsAdmin = () => {
    const { data, isLoading } = useQuery<Announcement[] | null>({
        queryKey: ["announcements-admin"],
        queryFn: () => adminService.getAnnouncementsApproved(),
        refetchOnWindowFocus: false,
    });

    // Ensure data is always an array before filtering
    const announcementsArray: Announcement[] = Array.isArray(data) ? data : [];

    const announcementsApproved = announcementsArray.filter(
        (ann) => ann.status === "approved"
    );

    return {
        announcementsApproved,
        isLoadingAnnouncements: isLoading,
    };
};


export const usePendingAnnouncementsAdmin = () => {
    const { data:Announcement, isLoading } = useQuery({
        queryKey: ["pending-announcements-admin"],
        queryFn: () => adminService.getAnnouncementsPending(),
        refetchOnWindowFocus: false,
    });

    return {
        announcementPending: Announcement ?? [],
        isLoadingPendingAnnouncements: isLoading,
    };
}


export const useDeleteAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminService.deleteAnnouncement(id),

        onSuccess: () => {
            // Refresh announcements after deletion
            queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
            queryClient.invalidateQueries({ queryKey: ["pending-announcements-admin"] });

            toast.success("Announcement deleted successfully!");
        },

        onError: () => {
            toast.error("Failed to delete announcement. Please try again.");
        },
    });
};




export const useApproveOrRejectAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
            admin_notes,
        }: {
            id: number;
                status: "approved" | "rejected";
            admin_notes: string;
        }) =>
            adminService.approveAndDisApproveAnnouncement(
                id,
                status,
                admin_notes
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
            queryClient.invalidateQueries({
                queryKey: ["pending-announcements-admin"],
            });
            toast.success("Announcement updated successfully!");
        },

        onError: () => {
            toast.error("Failed to update announcement. Please try again.");
        },
    });
};

