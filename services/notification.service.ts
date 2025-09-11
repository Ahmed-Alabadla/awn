import api from "@/lib/axios";
import { Notifications } from "@/lib/types";

export const notificationService = {
  getNotifications: async (): Promise<Notifications[]> => {
    const response = await api.get("/awn/api/my/notifications/");
    return response.data;
  },
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/awn/api/notification/${id}/delete/`);
  },
  deleteAllNotifications: async (): Promise<void> => {
    await api.delete(`/awn/api/notifications/delete-all/`);
  },
};
