import { Announcement } from "@/lib/types";
import { announcementService } from "@/services/announcement.service";
import { useQuery } from "@tanstack/react-query";

// 🔹 Get all announcements
export const useAnnouncements = () => {
    const { data, isLoading, error } = useQuery<Announcement[]>({
        queryKey: ["announcements"],
        queryFn: () => announcementService.getAllAnnouncements(),
        refetchOnWindowFocus: false,
    });

    return {
        announcements: data || [],
        isLoadingAnnouncements: isLoading,
        errorAnnouncements: error,
    };
};

// 🔹 Get single announcement by ID
export const useAnnouncementById = (id: number) => {
    const { data, isLoading, error } = useQuery<Announcement>({
        queryKey: ["announcement", id],
        queryFn: async () => {
            const result = await announcementService.getAnnouncementById(id);
            // Return first item if API returns an array
            return Array.isArray(result) ? result[0] : result;
        },
        enabled: !!id, // only fetch if id exists
        refetchOnWindowFocus: false,
    });

    return {
        announcement: data || null,
        isLoadingAnnouncement: isLoading,
        errorAnnouncement: error,
    };
};
