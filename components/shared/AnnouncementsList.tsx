"use client";

import { Announcement } from "@/lib/types";
import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementsList({
    announcements,
    favorites,
    toggleFavorite,
}: {
    announcements: Announcement[];
    favorites: Announcement[];
    toggleFavorite: (announcement: Announcement) => void;
}) {
    if (!announcements || announcements.length === 0) {
        return <p className="text-center py-6">No announcements available.</p>;
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
                <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    isFavorite={favorites.some((a) => a.id === announcement.id)}
                    onToggleFavorite={() => toggleFavorite(announcement)}
                />
            ))}
        </div>
    );
}
