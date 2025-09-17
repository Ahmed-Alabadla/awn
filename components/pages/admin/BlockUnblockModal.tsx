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

interface BlockUnblockModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    action: "block" | "unblock";
}

export default function BlockUnblockModal({ open, onClose, onSubmit, action }: BlockUnblockModalProps) {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(reason);
        setReason("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{action === "block" ? "Block Organization" : "Unblock Organization"}</DialogTitle>
                </DialogHeader>

                <Textarea
                    placeholder="Enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-2 w-full"
                />

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>{action === "block" ? "Block" : "Unblock"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
