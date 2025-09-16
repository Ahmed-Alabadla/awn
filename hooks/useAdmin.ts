import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@/lib/types";


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

