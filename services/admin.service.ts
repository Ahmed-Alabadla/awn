
import api from "@/lib/axios";
import { Organization, Announcement } from "@/lib/types";

export const adminService = {
    
    getAllOrganizationsAdmin: async (): Promise<Organization[]> => {
        const response = await api.get("/awn/api/organizations");
        return response.data;
    },

    getAllAnnouncements: async (): Promise<Announcement[]> => { 
        const response = await api.get("/awn/api/announcements");
        return response.data.data;
    },
    getAnnouncementsPending: async (): Promise<Announcement[]> => { 
        const response = await api.get("/awn/api/announcements/pending/");
        return response.data.data;
    },
    deleteAnnouncement: async (id: number): Promise<void> => {
        await api.delete(`/awn/api/announcements/${id}/`);
    },
    
    approveAndDisApproveAnnouncement: async (
        id: number,
        status: "approved" | "rejected",
        admin_notes: string
    ): Promise<void> => {
        const response = await api.patch(`/awn/api/announcements/${id}/approve/`, {
            status,
            admin_notes,
        });
        return response.data;
    },
};
