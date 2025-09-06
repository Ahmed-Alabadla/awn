"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FavoritesSection from "./FavoritesSection";
import NotificationSection from "./NotificationSection";
import OrganizationSection from "./OrganizationSection";
import ReportsSection from "./ReportsSection";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncements } from "@/hooks/useAnnouncement";
import { useFavorite } from "@/hooks/useFavorite";
import AnnouncementsList from "@/components/shared/AnnouncementsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 6;
const NAV_ITEMS = ["Search Aid", "Favorites", "Organizations", "Notifications", "Reports"];

function calculateDaysLeft(endDate: string | Date): number {
  const today = new Date();
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AnnouncementPage() {
  const { user } = useAuth();
  const { announcements = [], isLoadingAnnouncements } = useAnnouncements();

  const searchParams = useSearchParams();

  // Tabs
  const [activeTab, setActiveTab] = useState("Search Aid");
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && NAV_ITEMS.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [days, setDays] = useState("");
  const [page, setPage] = useState(1);

  // Favorites
   const { favorites, addFavorite, removeFavorite } = useFavorite();

  const toggleFavorite = async (announcement: Announcement) => {
    const isFav = favorites.some((f) => f.id === announcement.id);

    if (isFav) {
      await removeFavorite(announcement.id);
    } else {
      await addFavorite(announcement.id);
    }
  };



  // Unique categories
  const categories = useMemo(
    () => Array.from(new Set(announcements.map((a) => a.category_name))),
    [announcements]
  );

  // Filtering
  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesName =
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.organization_name?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category && category !== "all" ? a.category_name === category : true;

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
  }, [announcements, search, category, days]);



  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  if (isLoadingAnnouncements) {
    return <p className="text-center py-6">Loading announcements...</p>;
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, <span className="text-primary">{user?.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your aid requests and explore new opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow p-6">
          <nav className="mb-8">
            <ul className="grid grid-cols-2 gap-3 md:flex md:justify-center md:gap-8 bg-[#F4F9FF] rounded-lg py-3 px-2 sm:px-4">
              {NAV_ITEMS.map((item) => (
                <li key={item} className="flex justify-center">
                  <button
                    onClick={() => setActiveTab(item)}
                    className={`w-full md:w-auto px-4 sm:px-6 py-2 rounded-lg transition cursor-pointer ${activeTab === item
                        ? "border-2 border-primary bg-[#009285] font-semibold text-white"
                        : "text-gray-500 hover:text-black hover:bg-accent/20"
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
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-2 mb-6">
                <Input
                  type="text"
                  placeholder="Search by name or organization..."
                  value={search}
                  onChange={(e) =>
                    handleFilterChange(() => setSearch(e.target.value))
                  }
                />
                <Select
                  value={category}
                  onValueChange={(val) => handleFilterChange(() => setCategory(val))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>


                <Select
                  value={days}
                  onValueChange={(val) => handleFilterChange(() => setDays(val))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Deadlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deadlines</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7">Next 7 Days</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>


              </div>

              {/* Announcements List */}
              <AnnouncementsList
                announcements={paginated}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />

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

          {activeTab === "Organizations" && <OrganizationSection />}

          {activeTab === "Notifications" && (
            <NotificationSection
              notifications={[
                {
                  id: 1,
                  title: "Request Approved",
                  description: "Your request has been approved.",
                  timeAgo: "2 hours ago",
                  color: "bg-sky-500",
                },
              ]}
            />
          )}

          {activeTab === "Reports" && <ReportsSection />}
        </div>
      </div>
    </section>
  );
}
