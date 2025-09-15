import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationsPending = () => {
    const {
        data,
        isLoading: isLoadingOrganizationsPending,
    } = useQuery({
        queryKey: ["organizations-pending"],
        queryFn: () => adminService.getAllOrganizationsPending(),
        refetchOnWindowFocus: false,
    });

    // Only keep unverified
    const organizationsPending = data?.filter((org) => !org.verified) ?? [];

    return {
        organizationsPending,
        isLoadingOrganizationsPending,
    };
};

export const useOrganizationsVerified = () => { 
    const {
        data,
        isLoading: isLoadingOrganizationsVerified } = useQuery({
            queryKey: ["organizations-verified"],
            queryFn: () => adminService.getAllOrganizationsVerified(),
            refetchOnWindowFocus: false,
        });
    
    return {
        organizationsVerified: data,
        isLoadingOrganizationsVerified,
    }
}