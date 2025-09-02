"use client";

import { useState } from "react";
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FavoritesSection from "@/components/shared/FavoritesSection";
import NotificationSection from "@/components/shared/NotificationSection";

const PAGE_SIZE = 6;
const NAV_ITEMS = ["Search Aid", "Favorites", "Notifications", "Reports"];

function calculateDaysLeft(endDate: Date): number {
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function AnnouncementPage() {

    const [favorites, setFavorites] = useState<Announcement[]>([]);
    function toggleFavorite(announcement: Announcement) {
        setFavorites((prev) => {
            const isAlreadyFavorite = prev.some((a) => a.id === announcement.id);
            if (isAlreadyFavorite) {
                return prev.filter((a) => a.id !== announcement.id);
            } else {
                return [...prev, announcement];
            }
        });
    }

    const announcements: Announcement[] = [
        {
            id: 1,
            title: "Emergency Medical Fund",
            organization_name: "Children's Hope Foundation",
            description:
                "Urgent medical assistance for children in need. Providing life-saving treatments and medications.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            category_name: "Health",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    // Tabs
    const [activeTab, setActiveTab] = useState("Search Aid");

    // Filter states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [days, setDays] = useState("");
    const [page, setPage] = useState(1);

    // Unique categories
    const categories = Array.from(new Set(announcements.map((a) => a.category_name)));

    // Filtering
    const filtered = announcements.filter((a) => {
        const matchesName =
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.organization_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? a.category_name === category : true;
        const daysLeft = calculateDaysLeft(a.end_date);
        const matchesDays = days
            ? days === "expired"
                ? daysLeft < 0
                : days === "today"
                    ? daysLeft === 0
                    : days === "7"
                        ? daysLeft <= 7 && daysLeft >= 0
                        : true
            : true;
        return matchesName && matchesCategory && matchesDays;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleFilterChange(fn: () => void) {
        fn();
        setPage(1);
    }

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                        Welcome back, John Doe
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Manage your aid requests and explore new opportunities
                    </p>
                </div>

                {/* Tabs */}
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <nav className="mb-8">
                        <ul
                            className="
        grid grid-cols-2 gap-3
        md:flex md:justify-center md:gap-8
        bg-[#F4F9FF] rounded-lg py-3 px-2 sm:px-4"
                        >
                            {NAV_ITEMS.map((item) => (
                                <li key={item} className="flex justify-center">
                                    <button
                                        onClick={() => setActiveTab(item)}
                                        className={`w-full md:w-auto px-4 sm:px-6 py-2 rounded-lg transition ${activeTab === item
                                                ? "border-2 border-sky-400 bg-[#009285] font-semibold text-white"
                                                : "text-gray-500 hover:text-black"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Tab Content */}
                    {activeTab === "Search Aid" && (
                        <>
                            <h2 className="text-2xl font-bold mb-1">Search Aid Opportunities</h2>
                            <p className="text-muted-foreground mb-4">
                                Find aid that matches your needs using our advanced filters
                            </p>
                            <div className="flex flex-col md:flex-row gap-2 mb-6">
                                <Input
                                    type="text"
                                    placeholder="Search by name or organization..."
                                    value={search}
                                    onChange={(e) =>
                                        handleFilterChange(() => setSearch(e.target.value))
                                    }
                                />
                                <select
                                    className="border rounded px-3 py-2"
                                    value={category}
                                    onChange={(e) =>
                                        handleFilterChange(() => setCategory(e.target.value))
                                    }
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="border rounded px-3 py-2"
                                    value={days}
                                    onChange={(e) => handleFilterChange(() => setDays(e.target.value))}
                                >
                                    <option value="">All Deadlines</option>
                                    <option value="today">Today</option>
                                    <option value="7">Next 7 Days</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginated.length > 0 ? (
                                    paginated.map((announcement) => (
                                        <AnnouncementCard key={announcement.id}
                                            announcement={announcement}
                                            isFavorite={favorites.some((a) => a.id === announcement.id)}
                                            onToggleFavorite={() => toggleFavorite(announcement)} />
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center text-muted-foreground py-12">
                                        No announcements found.
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === "Favorites" && (
                        <FavoritesSection favorites={favorites} toggleFavorite={toggleFavorite} />
                    )}

                    {activeTab === "Notifications" && (
                        <NotificationSection
                            notifications={[
                                {
                                    id: 1,
                                    title: "Request Approved",
                                    description:
                                        "Your educational support request has been approved by Future Leaders Institute.",
                                    timeAgo: "2 hours ago",
                                    color: "bg-sky-500",
                                },
                                {
                                    id: 2,
                                    title: "New Opportunity Available",
                                    description:
                                        "A new medical aid program matching your profile has been posted.",
                                    timeAgo: "1 day ago",
                                    color: "bg-green-500",
                                },
                            ]}
                        />
                    )}

                    {activeTab === "Reports" && (
                        <div className="text-center py-12">📊 Reports dashboard coming soon</div>
                    )}
                </div>
            </div>
        </section>
    );
}
