import { ApiError } from "@/lib/types";
import { ReportFormValues } from "@/lib/validation";
import { reportService } from "@/services/report.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReport = () => {
  const generateReport = useMutation({
    mutationKey: ["generateReport"],
    mutationFn: async (data: ReportFormValues) =>
      reportService.generateReport(data),
    onSuccess: () => {
      toast.success("Report generated successfully");
    },

    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Report generation failed. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  return {
    generateReport: generateReport.mutate,
    isGeneratingReport: generateReport.isPending,
  };
};
