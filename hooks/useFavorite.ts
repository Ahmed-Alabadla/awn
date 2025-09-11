import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite.service";
import { Announcement } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export const useFavorite = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery<
    Announcement[]
  >({
    queryKey: ["favorites"],
    queryFn: favoriteService.getFavorites,
    refetchOnWindowFocus: false,
    enabled: !!isAuthenticated,
  });

  // useFavorite.ts
  const addFavoriteMutation = useMutation({
    mutationFn: (id: number) => favoriteService.addFavorite(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const prevFavorites =
        queryClient.getQueryData<Announcement[]>(["favorites"]) || [];

      // Find the announcement from announcements cache (optional but safer)
      const allAnnouncements =
        queryClient.getQueryData<Announcement[]>(["announcements"]) || [];
      const newFav = allAnnouncements.find((a) => a.id === id);

      if (newFav) {
        queryClient.setQueryData<Announcement[]>(
          ["favorites"],
          [...prevFavorites, newFav]
        );
      }

      return { prevFavorites };
    },
    onSuccess: () => {
      toast.success("Added to favorites successfully!");
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["favorites"], ctx?.prevFavorites);
      toast.error("Failed to add to favorites. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (id: number) => favoriteService.removeFavorite(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const prevFavorites =
        queryClient.getQueryData<Announcement[]>(["favorites"]) || [];
      queryClient.setQueryData<Announcement[]>(
        ["favorites"],
        prevFavorites.filter((f) => f.id !== id)
      );
      return { prevFavorites };
    },
    onSuccess: () => {
      toast.success("Removed from favorites successfully!");
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["favorites"], ctx?.prevFavorites);
      toast.error("Failed to remove from favorites. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites,
    isLoadingFavorites,
    addFavorite: addFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutateAsync,
  };
};
