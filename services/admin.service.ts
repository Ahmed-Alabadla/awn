
import api from "@/lib/axios";
import { Organization, Announcement } from "@/lib/types";

export const adminService = {
    
    getAllOrganizationsAdmin: async (): Promise<Organization[]> => {
        const response = await api.get("/awn/api/organizations");
        return response.data;
    },

    getAnnouncementsApproved: async (): Promise<Announcement[]> => { 
        const response = await api.get("/awn/api/announcements");
        return response.data.data;
    },
    getAnnouncementsPending: async (): Promise<Announcement[]> => { 
        const response = await api.get("/awn/api/announcements/pending/");
        return response.data.data;
    },

 
    
}