"use client";

import React from "react";

interface Notification {
    id: number;
    title: string;
    description: string;
    timeAgo: string;
    color: string; // e.g., "bg-sky-500" or "bg-green-500"
}

interface NotificationSectionProps {
    notifications: Notification[];
}

export default function NotificationSection({ notifications }: NotificationSectionProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>

            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="border rounded-lg p-4 hover:shadow-sm transition"
                        >
                            <div className="flex items-start gap-3">
                                {/* Colored dot */}
                                <div className={`h-2 w-2 rounded-full ${notification.color} mt-2`}></div>
                                {/* Content */}
                                <div>
                                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                                    <p className="text-gray-600">{notification.description}</p>
                                    <span className="text-sm text-gray-400">{notification.timeAgo}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No notifications yet.</p>
            )}
        </div>
    );
}
