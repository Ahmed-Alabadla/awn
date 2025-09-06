import { announcementService } from "@/services/announcement.service";
import { useQuery } from "@tanstack/react-query";

// 🔹 Get all announcements
export const useAnnouncements = () => {
    const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
        queryKey: ["announcements"],
        queryFn: () => announcementService.getAllAnnouncements(),
        refetchOnWindowFocus: false,
    });

    return {
        announcements,
        isLoadingAnnouncements,
    };
};