"use client";

import { useState } from "react";
import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";

// Mock reports
const initialReports = [
    {
        id: 1,
        title: "Incorrect Organization Info",
        message: "The organization details seem outdated. The organization details seem outdated.",
        type: "Organization",
    },
    {
        id: 2,
        title: "Platform Bug",
        message: "Unable to submit forms on mobile.",
        type: "Platform",
    },
];

export default function ReportsTable() {
    const [reports, setReports] = useState(initialReports);
    const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

    const handleView = (report: typeof reports[0]) => {
        setSelectedReport(report);
    };

    const handleResolve = (id: number) => {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setSelectedReport(null); // Close modal if open
    };

    const columns = [
        { key: "title", label: "Title" },
        {
            key: "message",
            label: "Message",
            render: (r: typeof reports[0]) => (
                <span title={r.message}>
                    {r.message.length > 50 ? r.message.slice(0, 50) + "..." : r.message}
                </span>
            ),
        },
        { key: "type", label: "Type" },
        {
            key: "actions",
            label: "Actions",
            render: (r: typeof reports[0]) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleView(r)}>
                        View
                    </Button>
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleResolve(r.id)}
                    >
                        Resolve
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable columns={columns} data={reports} />

            {/* Modal for viewing report details */}
            {selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <h3 className="text-lg font-bold mb-2">{selectedReport.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Type: {selectedReport.type}
                        </p>
                        <p className="mb-4">{selectedReport.message}</p>
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setSelectedReport(null)} className="bg-red-600 hover:bg-red-700">Close</Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleResolve(selectedReport.id)}
                            >
                                Resolve
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
