"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AdminNoteModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (note: string) => void;
    action: "approved" | "rejected";
}

export default function AdminNoteModal({ open, onClose, onSubmit, action }: AdminNoteModalProps) {
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        if (!note.trim()) return;
        onSubmit(note);
        setNote("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{action === "approved" ? "Approve Announcement" : "Reject Announcement"}</DialogTitle>
                </DialogHeader>

                <Textarea
                    placeholder="Enter admin note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-2 w-full"
                />

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>{action === "approved" ? "Approve" : "Reject"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
