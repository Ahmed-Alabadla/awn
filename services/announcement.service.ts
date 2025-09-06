import api from "@/lib/axios";
import { Announcement } from "@/lib/types";


export const announcementService = {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
        const response = await api.get("/awn/api/announcements/");
        return response.data.data; 
    },

    

}