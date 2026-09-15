import type { Notification } from "@/lib/mock-data/notifications";
import { notifications as initialNotifications } from "@/lib/mock-data/notifications";

const STORAGE_KEY = "tasker-notifications";

function getStoredNotifications(): Notification[] {
  if (typeof window === "undefined") {
    return initialNotifications;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialNotifications)
    );

    return [...initialNotifications];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid notification data");
    }

    return parsed as Notification[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialNotifications)
    );

    return [...initialNotifications];
  }
}

function saveNotifications(
  updatedNotifications: Notification[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedNotifications)
  );
}

export async function getNotifications(
  userId: number
): Promise<Notification[]> {
  const storedNotifications =
    getStoredNotifications();

  return storedNotifications
    .filter(
      (notification) =>
        notification.userId === userId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export async function getUnreadNotifications(
  userId: number
): Promise<Notification[]> {
  const userNotifications =
    await getNotifications(userId);

  return userNotifications.filter(
    (notification) => !notification.read
  );
}

export async function createNotification(
  data: Omit<Notification, "id" | "createdAt">
): Promise<Notification> {
  const storedNotifications =
    getStoredNotifications();

  const newNotification: Notification = {
    ...data,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  saveNotifications([
    ...storedNotifications,
    newNotification,
  ]);

  return newNotification;
}

export async function markNotificationAsRead(
  notificationId: number,
  userId: number
): Promise<boolean> {
  const storedNotifications =
    getStoredNotifications();

  const notificationIndex =
    storedNotifications.findIndex(
      (notification) =>
        notification.id === notificationId &&
        notification.userId === userId
    );

  if (notificationIndex === -1) {
    return false;
  }

  storedNotifications[notificationIndex] = {
    ...storedNotifications[notificationIndex],
    read: true,
  };

  saveNotifications(storedNotifications);

  return true;
}

export async function markAllNotificationsAsRead(
  userId: number
): Promise<void> {
  const storedNotifications =
    getStoredNotifications();

  const updatedNotifications =
    storedNotifications.map(
      (notification) =>
        notification.userId === userId
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

  saveNotifications(updatedNotifications);
}