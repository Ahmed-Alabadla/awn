"use client";

import { useState } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { useBlockUnblockOrganization, useDeleteOrganization } from "@/hooks/useAdmin";
import { Organization } from "@/lib/types";
import Link from "next/link";
import BlockUnblockModal from "./BlockUnblockModal";

interface OrganizationTableProps {
    organizations: Organization[];
}

export default function OrganizationTable({ organizations }: OrganizationTableProps) {
    const [orgs, setOrgs] = useState(organizations);

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<"block" | "unblock">("block");

    const { mutate: deleteOrganization, isPending } = useDeleteOrganization();
    const { mutate: blockUnblockOrganization, isPending: isBlocking } = useBlockUnblockOrganization();

    const openModal = (id: number, active: boolean) => {
        setSelectedOrgId(id);
        setActionType(active ? "block" : "unblock");
        setModalOpen(true);
    };

    const handleModalSubmit = (reason: string) => {
        if (!selectedOrgId) return;

        blockUnblockOrganization({ id: selectedOrgId, block_reason: reason }, {
            onSuccess: () => {
                setOrgs(prev =>
                    prev.map(org =>
                        org.id === selectedOrgId ? { ...org, is_active: !org.is_active } : org
                    )
                );
            }
        });
    };

    const handleDelete = (id: number) => {
        deleteOrganization(id, {
            onSuccess: () => setOrgs(prev => prev.filter(org => org.id !== id))
        });
    };

    const columns = [
        { key: "organization_name", label: "Name" },
        { key: "location", label: "Location" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
            key: "website",
            label: "Website",
            render: (org: Organization) => (
                <Link href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                        onClick={() => openModal(org.id, org.is_active)}
                        disabled={isBlocking}
                    >
                        {isBlocking ? "Updating..." : org.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(org.id)}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Organizations</h2>
            <DataTable columns={columns} data={orgs} />
            <BlockUnblockModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                action={actionType}
            />
        </div>
    );
}
