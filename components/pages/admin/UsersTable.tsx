"use client";

import DataTable from "./DataTable";
import { Button } from "@/components/ui/button";

// Mock users data
const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
];

export default function UsersTable() {
    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        {
            key: "actions",
            label: "Actions",
            render: (user: typeof users[0]) => (
                <div className="flex gap-2">
                    
                    <Button size="sm" variant="destructive">
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <DataTable columns={columns} data={users} />
        </div>
    );
}
