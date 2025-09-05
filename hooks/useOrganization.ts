import { organizationService } from "@/services/organization.service";
import { useQuery } from "@tanstack/react-query";

export const useOrganizations = () => {
  // Get all organizations
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getAllOrganizations(),
    refetchOnWindowFocus: false,
  });

  return {
    organizations,
    isLoadingOrganizations,
  };
};

export const useOrganizationById = (id: number) => {
  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ["organizations", id],
    queryFn: () => organizationService.getOrganizationById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return {
    organization,
    isLoadingOrganization,
  };
};

export const useOrganizationAnnouncements = (organizationId: number) => {
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ["organization-announcements", organizationId],
    queryFn: () =>
      organizationService.getOrganizationAnnouncements(organizationId),
    enabled: !!organizationId,
    refetchOnWindowFocus: false,
  });

  return {
    announcements,
    isLoadingAnnouncements,
  };
};
