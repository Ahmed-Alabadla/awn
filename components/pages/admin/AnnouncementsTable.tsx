"use client";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock announcements
const announcements = [
    {
        id: 1,
        title: "System Maintenance",
        date: "2024-02-01",
        category: "Maintenance",
        organization: "Tech Dept",
        link: "https://example.com/maintenance",
    },
    {
        id: 2,
        title: "New Feature Release",
        date: "2024-02-05",
        category: "Release",
        organization: "Product Team",
        link: "https://example.com/new-feature",
    },
];

export default function AnnouncementsTable() {
    const columns = [
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "organization", label: "Organization" },
        { key: "date", label: "Date" },
        {
            key: "link",
            label: "Link",
            render: (a: typeof announcements[0]) => (
                <Link
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Visit
                </Link>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (a: typeof announcements[0]) => (
                <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Announcements</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Announcement
                </Button>
            </div>
            <DataTable columns={columns} data={announcements} />
        </div>
    );
}
