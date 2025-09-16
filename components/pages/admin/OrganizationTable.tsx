"use client";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Organization } from "@/lib/types";
import Link from "next/link";

interface OrganizationTableProps {
    organizations: Organization[];
}

export default function OrganizationTable({ organizations }: OrganizationTableProps) {
    // Handlers (replace with API calls later)
    const handleDelete = (id: number) => console.log("Delete org:", id);
    const handleToggleActive = (id: number, active: boolean) =>
        console.log(`${active ? "Deactivate" : "Activate"} org:`, id);

    const columns = [
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
                        variant={org.is_active ? "secondary" : "default"}
                        onClick={() => handleToggleActive(org.id, org.is_active)}
                    >
                        {org.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(org.id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Organizations</h2>
            <DataTable columns={columns} data={organizations} />
        </div>
    );
}
