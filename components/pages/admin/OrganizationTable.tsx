"use client";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock organizations
const organizations = [
    {
        id: 1,
        name: "Community Care Network",
        type: "Non-Profit",
        location: "Chicago, IL",
        submitted: "2024-01-15",
        link: "https://communitycare.org",
    },
    {
        id: 2,
        name: "Bright Future Foundation",
        type: "Charity",
        location: "New York, NY",
        submitted: "2024-01-20",
        link: "https://brightfuture.org",
    },
];

export default function OrganizationTable() {
    const columns = [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "location", label: "Location" },
        { key: "submitted", label: "Submitted" },
        {
            key: "link",
            label: "Link",
            render: (org: typeof organizations[0]) => (
                <Link
                    href={org.link}
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
            render: (org: typeof organizations[0]) => (
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
            <h2 className="text-xl font-bold mb-4">Pending Organization Verifications</h2>
            <DataTable columns={columns} data={organizations} />
        </div>
    );
}
