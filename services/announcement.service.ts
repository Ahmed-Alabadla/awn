import api from "@/lib/axios";
import { Announcement } from "@/lib/types";


type AnnouncementService = {
    getAllAnnouncements: () => Promise<Announcement[]>;
    getAnnouncementById: (id: number) => Promise<Announcement[]>;
};

export const announcementService: AnnouncementService = {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
        const response = await api.get("/awn/api/announcements/");
        return response.data.data; 
    },
    getAnnouncementById: async (id: number): Promise<Announcement[]> => { 
        const response = await api.get(`/awn/api/announcements/${id}/`);
        return response.data.data;
    }
}