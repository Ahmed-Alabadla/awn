"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Column<T> = {
    key: keyof T | string; // allow extra keys
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowsPerPage?: number;
}

export default function DataTable<T extends object>({
    columns,
    data = [],
    rowsPerPage = 10,
}: DataTableProps<T>) {
    const [page, setPage] = useState(0);

    const safeData = Array.isArray(data) ? data : [];
    const totalPages = Math.ceil(safeData.length / rowsPerPage);
    const startIndex = page * rowsPerPage;
    const paginatedData = safeData.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key as string}>{col.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row, idx) => (
                        <TableRow key={idx}>
                            {columns.map((col) => (
                                <TableCell key={col.key.toString()}>
                                    {col.render ? col.render(row) : col.key in row ? String(row[col.key as keyof T]) : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page === totalPages - 1}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
