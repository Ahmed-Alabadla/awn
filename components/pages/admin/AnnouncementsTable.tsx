"use client";

import { useState } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock announcements
const initialPending = [
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

const initialApproved = [
    {
        id: 3,
        title: "Holiday Schedule",
        date: "2024-01-20",
        category: "Notice",
        organization: "HR Dept",
        link: "https://example.com/holiday",
    },
];

export default function AnnouncementsTable() {
    const [pending, setPending] = useState(initialPending);
    const [approved, setApproved] = useState(initialApproved);

    const handleApprove = (id: number) => {
        const ann = pending.find((a) => a.id === id);
        if (ann) {
            setApproved([...approved, ann]);
            setPending(pending.filter((a) => a.id !== id));
        }
    };

    const handleReject = (id: number) => {
        setPending(pending.filter((a) => a.id !== id));
    };

    const handleDelete = (id: number) => {
        setApproved(approved.filter((a) => a.id !== id));
    };

    const pendingColumns = [
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "organization", label: "Organization" },
        { key: "date", label: "Date" },
        {
            key: "link",
            label: "Link",
            render: (a: typeof pending[0]) => (
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
            render: (a: typeof pending[0]) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(a.id)}
                    >
                        Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(a.id)}>
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const approvedColumns = [
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "organization", label: "Organization" },
        { key: "date", label: "Date" },
        {
            key: "link",
            label: "Link",
            render: (a: typeof approved[0]) => (
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
            render: (a: typeof approved[0]) => (
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(a.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Announcements</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Announcement
                </Button>
            </div>

            {/* Pending Announcements */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Pending Announcements</h3>
                <DataTable columns={pendingColumns} data={pending} />
            </div>

            {/* Approved Announcements */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Approved Announcements</h3>
                <DataTable columns={approvedColumns} data={approved} />
            </div>
        </div>
    );
}
