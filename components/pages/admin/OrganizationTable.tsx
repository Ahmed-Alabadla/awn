"use client";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Organization } from "@/lib/types";
import Link from "next/link";


interface OrganizationTableProps {
    organizations: Organization[];
    organizationsPending: Organization[];
}

export default function OrganizationTable({
    organizations,
    organizationsPending,
}: OrganizationTableProps) {
    // Handlers (local only — replace with API later)
    const handleApprove = (id: number) => console.log("Approve org:", id);
    const handleReject = (id: number) => console.log("Reject org:", id);
    const handleDelete = (id: number) => console.log("Delete org:", id);

    const pendingColumns = [
        { key: "organization_name", label: "Name" },
        { key: "location", label: "Location" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
            key: "website",
            label: "Website",
            render: (org: Organization) => (
                <Link
                    href={org.website}
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
            render: (org: Organization) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(org.id)}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(org.id)}
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const verifiedColumns = [
        { key: "organization_name", label: "Name" },
        { key: "location", label: "Location" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
            key: "website",
            label: "Website",
            render: (org: Organization) => (
                <Link
                    href={org.website}
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
            render: (org: Organization) => (
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
                <h2 className="text-xl font-bold mb-4">
                    Pending Organization Verifications
                </h2>
                <DataTable columns={pendingColumns} data={organizationsPending} />
            </div>

            {/* Verified Organizations */}
            <div>
                <h2 className="text-xl font-bold mb-4">Verified Organizations</h2>
                <DataTable columns={verifiedColumns} data={organizations} />
            </div>
        </div>
    );
}
