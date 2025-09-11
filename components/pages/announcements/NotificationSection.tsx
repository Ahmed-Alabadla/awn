"use client";

import React from "react";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCheck } from "lucide-react";

// Helper function to calculate time ago
function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInMinutes = Math.floor(
    (now.getTime() - notificationDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return notificationDate.toLocaleDateString();
}

// Helper function to get notification color based on content or type
function getNotificationColor(title: string, message: string) {
  const lowerTitle = title.toLowerCase();
  const lowerMessage = message.toLowerCase();

  if (
    lowerTitle.includes("approved") ||
    lowerMessage.includes("approved") ||
    lowerTitle.includes("system") ||
    lowerMessage.includes("system") ||
    lowerTitle.includes("accept") ||
    lowerMessage.includes("accept")
  ) {
    return {
      dot: "bg-green-500",
      border: "border-green-200",
      background: "bg-green-50/50",
    };
  }

  if (
    lowerTitle.includes("rejected") ||
    lowerMessage.includes("rejected") ||
    lowerTitle.includes("error") ||
    lowerMessage.includes("error")
  ) {
    return {
      dot: "bg-red-500",
      border: "border-red-200",
      background: "bg-red-50/50",
    };
  }

  // Default notification color
  return {
    dot: "bg-blue-500",
    border: "border-blue-200",
    background: "bg-blue-50/50",
  };
}

export default function NotificationSection() {
  const {
    notifications,
    isLoadingNotifications,
    deleteAllNotifications,
    deleteNotification,
    isDeletingAllNotifications,
    isDeletingNotification,
  } = useNotification();

  if (isLoadingNotifications) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between flex-wrap gap-2 items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {notifications && notifications.length > 0 && (
            <Badge variant="secondary">{notifications.length}</Badge>
          )}
        </div>
        {notifications && notifications.length > 0 && (
          <div className="flex justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteAllNotifications()}
              disabled={isDeletingAllNotifications}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 disabled:opacity-50"
            >
              {isDeletingAllNotifications ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const colors = getNotificationColor(
              notification.title,
              notification.message
            );
            return (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 hover:shadow-sm transition ${colors.border} ${colors.background}`}
              >
                <div className="flex items-start gap-3">
                  {/* Colored dot */}
                  <div
                    className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${colors.dot}`}
                  ></div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold text-gray-900 `}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 break-words">
                          {notification.message}
                        </p>
                        <span className="text-sm text-gray-400">
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      {/* Action buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteNotification(notification.id.toString())
                          }
                          disabled={isDeletingNotification}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <CheckCheck className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No notifications yet</p>
          <p className="text-gray-400 text-sm">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
