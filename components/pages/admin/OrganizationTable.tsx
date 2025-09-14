"use client";

import { useState } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data
const initialPending = [
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

const initialVerified = [
    {
        id: 3,
        name: "Helping Hands Org",
        type: "NGO",
        location: "Los Angeles, CA",
        submitted: "2023-12-05",
        link: "https://helpinghands.org",
    },
];

export default function OrganizationTable() {
    const [pending, setPending] = useState(initialPending);
    const [verified, setVerified] = useState(initialVerified);

    // Handlers
    const handleApprove = (id: number) => {
        const org = pending.find((o) => o.id === id);
        if (org) {
            setVerified([...verified, org]);
            setPending(pending.filter((o) => o.id !== id));
        }
    };

    const handleReject = (id: number) => {
        setPending(pending.filter((o) => o.id !== id));
    };

    const handleDelete = (id: number) => {
        setVerified(verified.filter((o) => o.id !== id));
    };

    const pendingColumns = [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "location", label: "Location" },
        { key: "submitted", label: "Submitted" },
        {
            key: "link",
            label: "Link",
            render: (org: typeof pending[0]) => (
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
            render: (org: typeof pending[0]) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(org.id)}
                    >
                        Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(org.id)}>
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const verifiedColumns = [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "location", label: "Location" },
        {
            key: "link",
            label: "Link",
            render: (org: typeof verified[0]) => (
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
            render: (org: typeof verified[0]) => (
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(org.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-10">
            {/* Pending Organizations */}
            <div>
                <h2 className="text-xl font-bold mb-4">Pending Organization Verifications</h2>
                <DataTable columns={pendingColumns} data={pending} />
            </div>

            {/* Verified Organizations */}
            <div>
                <h2 className="text-xl font-bold mb-4">Verified Organizations</h2>
                <DataTable columns={verifiedColumns} data={verified} />
            </div>
        </div>
    );
}
