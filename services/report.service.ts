import api from "@/lib/axios";
import { ReportFormValues } from "@/lib/validation";

export const reportService = {
  generateReport: async (data: ReportFormValues) => {
    const response = await api.post("/awn/api/support/create/", data);
    return response.data.data;
  },
};
