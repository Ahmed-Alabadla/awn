import api from "@/lib/axios";
import { Announcement, Category } from "@/lib/types";

type AnnouncementService = {
  getAllAnnouncements: () => Promise<Announcement[]>;
  getAnnouncementById: (id: number) => Promise<Announcement>;
  getCategories: () => Promise<Category[]>;
};

export const announcementService: AnnouncementService = {
  getAllAnnouncements: async (): Promise<Announcement[]> => {
    const response = await api.get("/awn/api/announcements/");
    return response.data.data;
  },
  getAnnouncementById: async (id: number): Promise<Announcement> => {
    const response = await api.get(`/awn/api/announcements/${id}`);
    return response.data.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/awn/api/announcement-categories/");
    return response.data;
  },
};
