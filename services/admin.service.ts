
import api from "@/lib/axios";
import { Organization } from "@/lib/types";

export const adminService = {
    
    getAllOrganizationsPending: async (): Promise<Organization[]> => {
        const response = await api.get("/awn/api/organizations");
        return response.data;
    },
    getAllOrganizationsVerified: async (): Promise<Organization[]> => {
        const response = await api.get("/awn/api/organizations/verified");
        return response.data;
    }
    
}