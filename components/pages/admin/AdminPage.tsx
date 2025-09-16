"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Building2, FileText, AlertTriangle } from "lucide-react";

// Import feature tables
import OrganizationTable from "./OrganizationTable";
import UsersTable from "./UsersTable";
import AnnouncementsTable from "./AnnouncementsTable";
import ReportsTable from "./ReportsTable";

// Import your hooks
import { useApprovedAnnouncementsAdmin, useOrganizationsAdmin, usePendingAnnouncementsAdmin } from "@/hooks/useAdmin";

const NAV_ITEMS = ["Announcements", "Organizations", "Users", "Reports"];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("Announcements");

    // Fetch all organizations and announcements
    const { organizations, isLoadingOrganizations } = useOrganizationsAdmin();
    const { announcementsApproved, isLoadingAnnouncements } = useApprovedAnnouncementsAdmin();
    const { announcementPending, isLoadingPendingAnnouncements } = usePendingAnnouncementsAdmin();


    if (isLoadingOrganizations || isLoadingAnnouncements || isLoadingPendingAnnouncements) {
        return <p>Loading dashboard...</p>;
    }

    // Quick stats
    // Quick stats
    const totalUsers = 1247;
    const approvedCount = announcementsApproved?.length ?? 0;
    const pendingCount = announcementPending?.length ?? 0;
    const totalAnnouncements = approvedCount + pendingCount;

    const TotalOrganizations = organizations?.length ?? 0;
    const pendingAnnouncementsCount = pendingCount;

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-muted-foreground">
                        Monitor and manage the Organization Connect Platform
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                                </div>
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Organizations</p>
                                    <p className="text-2xl font-bold">{TotalOrganizations}</p>
                                </div>
                                <Building2 className="w-8 h-8 text-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Verified Announcements</p>
                                    <p className="text-2xl font-bold">{approvedCount}</p>
                                </div>
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Not Verified Announcements</p>
                                    <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {(pendingAnnouncementsCount > 0 || pendingAnnouncementsCount > 0) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <p className="text-red-700 font-medium">
                                Pending Actions Required: 
                                {" ("}{pendingAnnouncementsCount}{") "}announcements pending approval
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full bg-[#F4F9FF] h-auto p-2 gap-1.5 flex-wrap">
                            {NAV_ITEMS.map(item => (
                                <TabsTrigger
                                    key={item}
                                    value={item}
                                    className="px-4 py-2 data-[state=active]:bg-[#009285] data-[state=active]:text-white data-[state=active]:border-2 data-[state=active]:border-primary hover:bg-[#009285]/20 flex-shrink-0"
                                >
                                    {item}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {/* Announcements */}
                        <TabsContent value="Announcements" className="mt-8">
                            <AnnouncementsTable
                                approvedAnnouncements={announcementsApproved}
                                pendingAnnouncements={announcementPending}
                            />
                        </TabsContent>
                        {/* Organizations */}
                        <TabsContent value="Organizations" className="mt-8">
                            <OrganizationTable organizations={organizations ?? []} />
                        </TabsContent>

                      

                        {/* Users */}
                        <TabsContent value="Users" className="mt-8">
                            <UsersTable />
                        </TabsContent>

                        {/* Reports */}
                        <TabsContent value="Reports" className="mt-8">
                            <ReportsTable />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}
