"use client";

import { useState, useMemo } from "react";
import { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FavoritesSection from "./FavoritesSection";
import OrganizationSection from "./OrganizationSection";
import ReportsSection from "./ReportsSection";
import { useAuth } from "@/hooks/useAuth";
import {
  useAnnouncements,
  useAnnouncementCategories,
} from "@/hooks/useAnnouncement";
import { useFavorite } from "@/hooks/useFavorite";
import AnnouncementsList from "@/components/shared/AnnouncementsList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTabsStore } from "@/hooks/useTabsStore";
import ApplicationsSection from "./ApplicationsSection";
import NotificationSection from "./NotificationSection";

const PAGE_SIZE = 6;
const NAV_ITEMS = [
  "Search Aid",
  "Favorites",
  "Applications",
  "Organizations",
  "Notifications",
  "Reports",
];

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
  const { categories = [] } = useAnnouncementCategories();

  // Tabs state from Zustand store
  const { activeTab, setActiveTab } = useTabsStore();

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

  // Filtering
  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesName =
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.organization_name?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category && category !== "all" ? a.category_name === category : true;

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
            Welcome back,{" "}
            <span className=" bg-hero-gradient bg-clip-text text-transparent">
              {user?.name}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your aid requests and explore new opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-[#F4F9FF] h-auto p-2 gap-1.5 flex-wrap">
              {NAV_ITEMS.map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="px-4 py-2 data-[state=active]:bg-[#009285] data-[state=active]:text-white data-[state=active]:border-2 data-[state=active]:border-primary hover:bg-[#009285]/20 flex-shrink-0"
                >
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="Search Aid" className="mt-8">
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
                  onValueChange={(val) =>
                    handleFilterChange(() => setCategory(val))
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={days}
                  onValueChange={(val) =>
                    handleFilterChange(() => setDays(val))
                  }
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
                  variant="outline"
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="Favorites" className="mt-8">
              <FavoritesSection
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </TabsContent>

            <TabsContent value="Applications" className="mt-8">
              <ApplicationsSection />
            </TabsContent>

            <TabsContent value="Organizations" className="mt-8">
              <OrganizationSection />
            </TabsContent>

            <TabsContent value="Notifications" className="mt-8">
              <NotificationSection />
            </TabsContent>

            <TabsContent value="Reports" className="mt-8">
              <ReportsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
