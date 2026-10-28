"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  NotificationCategory,
  NotificationItemType,
  BackendNotificationItem,
} from "@/types/notification";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationList from "@/components/notifications/NotificationList";
import { useGetNotificationsQuery } from "@/features/notification/notificationApi";

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return "Just now";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

const mapBackendToUI = (item: BackendNotificationItem): NotificationItemType => {
  let category: "service_request" | "invoice" | "property" | "system" = "system";
  let link = "/request";
  let actionText = "View Details";

  const lowerTitle = (item.title || "").toLowerCase();
  const lowerMessage = (item.message || "").toLowerCase();
  const screen = (item.screen || "").toUpperCase();

  if (
    screen.includes("SERVICE_REQUEST") ||
    lowerTitle.includes("request") ||
    lowerTitle.includes("service") ||
    lowerMessage.includes("service request")
  ) {
    category = "service_request";
    link = "/request";
    actionText = "View Request";
  } else if (
    screen.includes("INVOICE") ||
    screen.includes("PAYMENT") ||
    lowerTitle.includes("invoice") ||
    lowerTitle.includes("paid") ||
    lowerTitle.includes("payment")
  ) {
    category = "invoice";
    link = "/invoices";
    actionText = "View Invoice";
  } else if (
    screen.includes("PROPERTY") ||
    screen.includes("PARTNER") ||
    lowerTitle.includes("property") ||
    lowerTitle.includes("manager") ||
    lowerTitle.includes("partner")
  ) {
    category = "property";
    link = "/property-managers";
    actionText = "View Partner";
  } else if (
    screen.includes("PROVIDER") ||
    lowerTitle.includes("provider") ||
    lowerMessage.includes("provider")
  ) {
    category = "service_request";
    link = "/provider";
    actionText = "View Provider";
  }

  return {
    id: item._id,
    title: item.title,
    message: item.message,
    category,
    timestamp: formatTimeAgo(item.createdAt),
    read: item.read ?? false,
    link,
    actionText,
    raw: item,
  };
};

export default function NotificationsPage() {
  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery({
    limit: 50,
  });

  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sync notifications from API response
  useEffect(() => {
    const backendItems: BackendNotificationItem[] = data?.data?.notifications || [];
    if (backendItems.length > 0) {
      setNotifications(backendItems.map(mapBackendToUI));
    }
  }, [data]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    toast.success("Notification deleted");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("Cleared all notifications");
  };

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeTab === "unread") {
        matchesTab = !item.read;
      } else if (activeTab !== "all") {
        matchesTab = item.category === activeTab;
      }

      return matchesSearch && matchesTab;
    });
  }, [notifications, activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filter Tabs & Search Bar */}
      <NotificationFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        unreadCount={unreadCount}
      />

      {/* Notifications List */}
      <NotificationList
        notifications={filteredNotifications}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}
