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


export const useDeleteOrganization = () => {
    const queryClient = useQueryClient();   
    return useMutation({
        mutationFn: (id: number) => adminService.deleteOrganization(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations-admin-delete"] });
            queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });

            toast.success("Organization deleted successfully!");
        }
        ,
        onError: () => {
            toast.error("Failed to delete organization. Please try again.");
        },
    });
}

export const useBlockUnblockOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, block_reason }: { id: number; block_reason: string }) =>
            adminService.blockAndUnblockOrganization(id, block_reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizations-admin-delete"] });
            toast.success("Organization status updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update organization status. Please try again.");
        },
    });
};




export const useAllAnnouncementsAdmin = () => {
    const { data: Announcement, isLoading } = useQuery<Announcement[] | null>({
        queryKey: ["announcements-admin"],
        queryFn: () => adminService.getAllAnnouncements(),
        refetchOnWindowFocus: false,
    });

   
    return {
        Announcement,
        isLoadingAnnouncements: isLoading,
    };
};




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

