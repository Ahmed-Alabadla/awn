import api from "@/lib/axios";
import { Organization, Announcement } from "@/lib/types";

export const organizationService = {
  // Fetch all organizations
  getAllOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get("/awn/api/organizations/verified");
    return response.data;
  },

  // Fetch single organization by ID
  getOrganizationById: async (id: number): Promise<Organization> => {
    const response = await api.get(`/awn/api/organizations/${id}/`);
    return response.data;
  },

  // Fetch announcements for a specific organization
  getOrganizationAnnouncements: async (
    organizationId: number
  ): Promise<Announcement[]> => {
    const response = await api.get(
      `/awn/api/announcements?organization=${organizationId}`
    );
    return response.data.data;
  },
 
};
