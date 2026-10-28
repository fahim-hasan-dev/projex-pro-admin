export type NotificationCategory = "all" | "unread" | "service_request" | "invoice" | "property" | "system";

export interface BackendNotificationItem {
  _id: string;
  title: string;
  message: string;
  receiver: string;
  referenceId?: string;
  screen?: string;
  read: boolean;
  type: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface NotificationApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    notifications: BackendNotificationItem[];
    pagination?: NotificationPagination;
    unreadCount?: number;
  };
}

export interface NotificationItemType {
  id: string;
  title: string;
  message: string;
  category: "service_request" | "invoice" | "property" | "system";
  timestamp: string;
  read: boolean;
  link?: string;
  actionText?: string;
  raw?: BackendNotificationItem;
}
