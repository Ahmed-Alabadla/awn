import api from "@/lib/axios";
import { ApplicationTracker } from "@/lib/types";
import { ApplicationTrackingValues } from "@/lib/validation";

export const applicationTrackerService = {
  createOrUpdateTracker: async (
    announcementId: number,
    data: ApplicationTrackingValues
  ) => {
    const response = await api.post(
      `/awn/api/announcements/${announcementId}/track-application/`,
      data
    );
    return response.data.data;
  },

  getTrackers: async (): Promise<ApplicationTracker[]> => {
    const response = await api.get("/awn/api/announcements/my-applications/");
    return response.data.data;
  },
};
