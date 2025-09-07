// favorite.service.ts
import api from "@/lib/axios";
import { Announcement } from "@/lib/types";

export const favoriteService = {
    // Get all favorite announcements
    getFavorites: async (): Promise<Announcement[]> => {
        const response = await api.get("/awn/api/favorites/");
        // unwrap so we only return announcements
        return response.data.data.map((fav: { announcement: Announcement }) => fav.announcement);
    },

    // Add announcement to favorites
    addFavorite: async (id: number): Promise<void> => {
        await api.post(`/awn/api/favorites/add/${id}/`);
    },

    // Remove announcement from favorites
    removeFavorite: async (id: number): Promise<void> => {
        await api.delete(`/awn/api/favorites/remove/${id}/`);
    },
};
