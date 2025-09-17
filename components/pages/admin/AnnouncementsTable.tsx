"use client";

import { useState, useEffect, useMemo } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Announcement } from "@/lib/types";
import { useDeleteAnnouncement, useApproveOrRejectAnnouncement } from "@/hooks/useAdmin";
import AdminNoteModal from "./AdminNoteModal";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    announcements: Announcement[];
}
type Status = "approved" | "rejected" | "pending" | "all";


export default function AnnouncementsTable({ announcements }: Props) {
    const [data, setData] = useState<Announcement[]>(announcements);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"approved" | "rejected">("approved");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("");

    const deleteMutation = useDeleteAnnouncement();
    const approveRejectMutation = useApproveOrRejectAnnouncement();

    useEffect(() => {
        setData(announcements);
    }, [announcements]);

    const handleOpenModal = (id: number, action: "approved" | "rejected") => {
        setSelectedId(id);
        setSelectedAction(action);
        setModalOpen(true);
    };

    const handleSubmitNote = (note: string) => {
        if (!selectedId) return;

        approveRejectMutation.mutate(
            { id: selectedId, status: selectedAction, admin_notes: note },
            {
                onSuccess: () => {
                    setData((prev) =>
                        prev.map((a) => (a.id === selectedId ? { ...a, status: selectedAction } : a))
                    );
                },
            }
        );

        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                setData((prev) => prev.filter((a) => a.id !== id));
            },
        });
    };

    const filteredData = useMemo(() => {
        return data
            .filter((a) =>
                searchQuery
                    ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.organization_name?.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
            )
            .filter((a) => (statusFilter && statusFilter !== "all" ? a.status === statusFilter : true))
            .filter((a) => (categoryFilter && categoryFilter !== "all" ? a.category_name === categoryFilter : true));
    }, [data, searchQuery, statusFilter, categoryFilter]);

    const columns = [
        { key: "title", label: "Title" },
        { key: "category_name", label: "Category" },
        { key: "organization_name", label: "Organization" },
        {
            key: "created_at",
            label: "Date",
            render: (a: Announcement) => new Date(a.created_at).toISOString().split("T")[0],
        },
        {
            key: "status",
            label: "Status",
            render: (a: Announcement) => {
                let color = "";
                if (a.status === "pending") color = "bg-yellow-100 text-yellow-800";
                if (a.status === "approved") color = "bg-green-100 text-green-800";
                if (a.status === "rejected") color = "bg-red-100 text-red-800";
                return (
                    <span className={`px-2 py-1 rounded-md font-semibold ${color}`}>
                        {a.status}
                    </span>
                );
            },
        },
        {
            key: "link",
            label: "Link",
            render: (a: Announcement) => (
                <Link
                    href={a.url}
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
            render: (a: Announcement) => (
                <div className="flex gap-2">
                    {a.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleOpenModal(a.id, "approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleOpenModal(a.id, "rejected")}
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    {(a.status === "approved" || a.status === "rejected") && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(a.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const categories = Array.from(new Set(data.map((a) => a.category_name)));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Announcements</h2>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Announcement
                </Button>
            </div>

            {/* Search and Filters using Shadcn */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <Input
                    placeholder="Search by title or organization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                />

                <Select value={statusFilter}
                    onValueChange={(value: Status) => setStatusFilter(value)}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DataTable columns={columns} data={filteredData} />

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
