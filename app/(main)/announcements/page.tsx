"use client";

import { useState } from "react";
import AnnouncementCard from "@/components/shared/AnnouncementCard";
import { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



const PAGE_SIZE = 6;
const NAV_ITEMS = [
    { label: "Search Aid", href: "/search-aid" },
    { label: "Favorites", href: "/favorites" },
    { label: "Notifications", href: "/notifications" },
    { label: "Reports", href: "/reports" }
];
function calculateDaysLeft(endDate: Date): number {
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Announcements() {
    const announcements: Announcement[] = [
        // ...your mock data...
        {
            id: 1,
            title: "Emergency Medical Fund",
            organization_name: "Children's Hope Foundation",
            description: "Urgent medical assistance for children in need. Providing life-saving treatments and medications.",
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
        {
            id: 2,
            title: "Educational Scholarships",
            organization_name: "Future Leaders Institute",
            description: "Supporting bright students from underprivileged backgrounds to pursue higher education.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            category_name: "Education",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 3,
            title: "Food Security Program",
            organization_name: "Community Care Network",
            description: "Providing nutritious meals to families facing food insecurity in rural communities.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            category_name: "Food",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 4,
            title: "Clean Water Initiative",
            organization_name: "Water for All",
            description: "Bringing clean water to remote villages.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            category_name: "Water",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 5,
            title: "Disaster Relief Fund",
            organization_name: "Relief Now",
            description: "Immediate support for disaster-affected families.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            category_name: "Relief",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 6,
            title: "Women Empowerment Grants",
            organization_name: "EmpowerHer",
            description: "Grants for women entrepreneurs.",
            start_date: new Date(),
            end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            category_name: "Empowerment",
            url: "",
            creator_name: "Admin",
            status: "active",
            admin_notes: "",
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    // Filter states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [days, setDays] = useState("");
    const [page, setPage] = useState(1);

    // Unique categories for dropdown
    const categories = Array.from(new Set(announcements.map(a => a.category_name)));

    // Filtering logic
    const filtered = announcements.filter(a => {
        const matchesName =
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.organization_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? a.category_name === category : true;
        const daysLeft = calculateDaysLeft(a.end_date);
        const matchesDays = days
            ? (days === "expired"
                ? daysLeft < 0
                : days === "today"
                    ? daysLeft === 0
                    : days === "7"
                        ? daysLeft <= 7 && daysLeft >= 0
                        : true)
            : true;
        return matchesName && matchesCategory && matchesDays;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset to first page on filter change
    function handleFilterChange(fn: () => void) {
        fn();
        setPage(1);
    }
    const activeTab = "Search Aid";


    return (
        <section className="py-16 bg-background">
           
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            Welcome back, John Doe
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Manage your aid requests and explore new opportunities
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto place-content-center">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <span className="text-muted-foreground mb-2">Saved Items</span>
                            <span className="text-2xl font-bold text-blue-500">5</span>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <span className="text-muted-foreground mb-2">Notifications</span>
                            <span className="text-2xl font-bold text-red-500">2</span>
                        </div>
                    </div>
                </div>

                {/* Search & Cards Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <nav className="mb-8">
                        <ul className="flex justify-center gap-8 bg-[#f7fafd] rounded-lg py-3">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className={`px-6 py-2 rounded-lg transition 
                                    ${activeTab === item.label
                                                ? "border-2 border-sky-400 bg-white font-semibold text-black"
                                                : "text-gray-500 hover:text-black"
                                            }`}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                            Search Aid Opportunities
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Find aid that matches your needs using our advanced filters
                        </p>
                        <div className="flex flex-col md:flex-row gap-2">
                            <Input
                                type="text"
                                placeholder="Search by name or organization..."
                                value={search}
                                onChange={e => handleFilterChange(() => setSearch(e.target.value))}
                            />
                            <select
                                className="border rounded px-3 py-2"
                                value={category}
                                onChange={e => handleFilterChange(() => setCategory(e.target.value))}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                className="border rounded px-3 py-2"
                                value={days}
                                onChange={e => handleFilterChange(() => setDays(e.target.value))}
                            >
                                <option value="">All Deadlines</option>
                                <option value="today">Today</option>
                                <option value="7">Next 7 Days</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </div>

                    {/* Announcement Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginated.length > 0 ? (
                            paginated.map((announcement) => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} />
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
                </div>
            </div>
        </section>
    );
}