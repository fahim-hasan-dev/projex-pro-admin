"use client";

import React from "react";
import { BellOff } from "lucide-react";
import { NotificationItemType } from "@/types/notification";
import NotificationItem from "./NotificationItem";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationListProps {
  notifications: NotificationItemType[];
  isLoading?: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationList({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[#E5E7EB] bg-white flex items-start gap-4 shadow-2xs"
          >
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
            <Skeleton className="w-20 h-8 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
          <BellOff className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          No notifications found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-sm">
          You don&apos;t have any notifications matching your current filter or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
