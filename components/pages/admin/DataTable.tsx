"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Column<T> = {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export default function DataTable<T>({ columns, data }: DataTableProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col) => (
                        <TableHead key={col.key.toString()}>{col.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, idx) => (
                    <TableRow key={idx}>
                        {columns.map((col) => (
                            <TableCell key={col.key.toString()}>
                                {col.render ? col.render(row) : (row as any)[col.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
