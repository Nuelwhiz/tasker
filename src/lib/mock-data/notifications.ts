export type NotificationType =
  | "meeting"
  | "task"
  | "system";

export type Notification = {
  id: number;
  userId: number;
  organizationId: number;

  type: NotificationType;
  title: string;
  message: string;

  link?: string;

  read: boolean;
  createdAt: string;
};

export const notifications: Notification[] = [];