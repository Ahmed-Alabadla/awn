import api from "@/lib/axios";

export const organizationService = {
  // Fetch all organizations
  getAllOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get("/awn/api/organizations/");
    return response.data.data;
  },
};
