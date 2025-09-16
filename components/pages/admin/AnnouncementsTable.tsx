"use client";

import { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/types";

interface AnnouncementsTableProps {
    approvedAnnouncements: Announcement[];
    pendingAnnouncements: Announcement[];
}

export default function AnnouncementsTable({ approvedAnnouncements, pendingAnnouncements }: AnnouncementsTableProps) {
    const [pending, setPending] = useState(pendingAnnouncements);
    const [approved, setApproved] = useState(approvedAnnouncements);

    useEffect(() => {
        setPending(pendingAnnouncements);
        setApproved(approvedAnnouncements);
    }, [pendingAnnouncements, approvedAnnouncements]);

    const handleApprove = (id: number) => {
        const ann = pending.find(a => a.id === id);
        if (ann) {
            setApproved([...approved, ann]);
            setPending(pending.filter(a => a.id !== id));
            // TODO: Call API to approve
        }
    };

    const handleReject = (id: number) => {
        setPending(pending.filter(a => a.id !== id));
        // TODO: Call API to reject
    };

    const handleDelete = (id: number) => {
        setApproved(approved.filter(a => a.id !== id));
        // TODO: Call API to delete
    };

    const pendingColumns = [
        { key: "title", label: "Title" },
        { key: "category_name", label: "Category" },
        { key: "organization_name", label: "Organization" },
        {
            key: "created_at",
            label: "Date",
            render: (a: Announcement) => a.created_at.split("T")[0], // format date
        },
        {
            key: "link",
            label: "Link",
            render: (a: Announcement) => (
                <Link href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit
                </Link>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (a: Announcement) => (
                <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(a.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(a.id)}>Reject</Button>
                </div>
            ),
        },
    ];

    const approvedColumns = [
        { key: "title", label: "Title" },
        { key: "category_name", label: "Category" },
        { key: "organization_name", label: "Organization" },
        {
            key: "created_at",
            label: "Date",
            render: (a: Announcement) => a.created_at.split("T")[0], // format date
        },
        {
            key: "link",
            label: "Link",
            render: (a: Announcement) => (
                <Link href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit
                </Link>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (a: Announcement) => (
                <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>Delete</Button>
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

            <div>
                <h3 className="text-lg font-semibold mb-2">Pending Announcements ({pending.length})</h3>
                <DataTable columns={pendingColumns} data={pending} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Approved Announcements ({approved.length})</h3>
                <DataTable columns={approvedColumns} data={approved} />
            </div>
        </div>
    );
}
