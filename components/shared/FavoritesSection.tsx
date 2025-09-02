"use client";

import React from "react";
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import { Announcement } from "@/lib/types";

interface FavoritesSectionProps {
    favorites: Announcement[];
    toggleFavorite: (announcement: Announcement) => void;
}

export default function FavoritesSection({ favorites, toggleFavorite }: FavoritesSectionProps) {
    return (
        <div>
            {/* Title and description */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Your Favorite Aid Opportunities</h2>
                <p className="text-muted-foreground">
                    These are the aid programs you’ve saved. Click the heart to remove any item from your favorites.
                </p>
            </div>

            {/* Favorites grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                    favorites.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            isFavorite={true}
                            onToggleFavorite={() => toggleFavorite(announcement)}
                        />
                    ))
                ) : (
                    <div className="col-span-3 text-center text-muted-foreground py-12">
                        No favorites yet.
                    </div>
                )}
            </div>
        </div>
    );
}
