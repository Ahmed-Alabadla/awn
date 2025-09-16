"use client";

import { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { useDeleteAnnouncement, useApproveOrRejectAnnouncement } from "@/hooks/useAdmin";
import AdminNoteModal from "./AdminNoteModal";

interface AnnouncementsTableProps {
    approvedAnnouncements: Announcement[];
    pendingAnnouncements: Announcement[];
}

export default function AnnouncementsTable({
    approvedAnnouncements,
    pendingAnnouncements,
}: AnnouncementsTableProps) {
    const [pending, setPending] = useState(pendingAnnouncements);
    const [approved, setApproved] = useState(approvedAnnouncements);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"approved" | "rejected">("approved");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const deleteMutation = useDeleteAnnouncement();
    const approveRejectMutation = useApproveOrRejectAnnouncement();

    useEffect(() => {
        setPending(pendingAnnouncements);
        setApproved(approvedAnnouncements);
    }, [pendingAnnouncements, approvedAnnouncements]);

    // Open modal
    const handleOpenModal = (id: number, action: "approved" | "rejected") => {
        setSelectedId(id);
        setSelectedAction(action);
        setModalOpen(true);
    };

    // Submit admin note
    const handleSubmitNote = (note: string) => {
        if (!selectedId) return;

        approveRejectMutation.mutate(
            { id: selectedId, status: selectedAction, admin_notes: note },
            {
                onSuccess: () => {
                    const announcement = pending.find((a) => a.id === selectedId);
                    if (!announcement) return;

                    if (selectedAction === "approved") {
                        // Move from pending -> approved
                        setApproved((prev) => [...prev, { ...announcement, status: "approved" }]);
                    }

                    // Remove from pending for both approve and reject
                    setPending((prev) => prev.filter((a) => a.id !== selectedId));
                },
            }
        );

        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                setApproved((prev) => prev.filter((a) => a.id !== id));
                setPending((prev) => prev.filter((a) => a.id !== id));
            },
        });
    };

    const pendingColumns = [
        { key: "title", label: "Title" },
        { key: "category_name", label: "Category" },
        { key: "organization_name", label: "Organization" },
        {
            key: "created_at",
            label: "Date",
            render: (a: Announcement) => new Date(a.created_at).toISOString().split("T")[0],
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
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleOpenModal(a.id, "approved")}
                    >
                        Approve
                    </Button>

                    <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={() => handleOpenModal(a.id, "rejected")}
                    >
                        Reject
                    </Button>
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
            render: (a: Announcement) => new Date(a.created_at).toISOString().split("T")[0],
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
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(a.id)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </div>
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

            {modalOpen && (
                <AdminNoteModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmitNote}
                    action={selectedAction}
                />
            )}
        </div>
    );
}
