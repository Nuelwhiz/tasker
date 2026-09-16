"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronDown,
  Menu,
} from "lucide-react";

import AdminSidebar, {
  UserRole,
} from "@/components/layout/admin-sidebar";

import { ThemeToggle } from "@/components/theme-toggle";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/services/notification-service";

import { checkMeetingNotifications } from "@/lib/services/meeting-notification-service";

import type { Notification } from "@/lib/mock-data/notifications";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  role?: UserRole;
};

const CURRENT_USER_ID = 1;

const roleDetails = {
  super_admin: {
    name: "Super Admin",
    description: "Platform Owner",
    initials: "SA",
  },

  organization_admin: {
    name: "Organization Admin",
    description: "Organization Management",
    initials: "OA",
  },

  team_lead: {
    name: "Team Lead",
    description: "Team Management",
    initials: "TL",
  },

  member: {
    name: "Member",
    description: "Task Workspace",
    initials: "ME",
  },
};

function formatNotificationTime(
  createdAt: string
): string {
  const created = new Date(createdAt);
  const now = new Date();

  const difference =
    now.getTime() - created.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return created.toLocaleDateString();
}

export default function AdminLayout({
  children,
  title = "Super Admin Dashboard",
  subtitle = "Tasker Administration",
  role = "super_admin",
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notificationsList, setNotificationsList] =
    useState<Notification[]>([]);

  const currentRole = roleDetails[role];

  /*
   * Check for meeting notifications.
   *
   * For now we use a mock user ID.
   * This will later come from authentication.
   */
  useEffect(() => {
    if (role !== "organization_admin") {
      return;
    }

    const checkNotifications = async () => {
      await checkMeetingNotifications(
        CURRENT_USER_ID
      );

      const updatedNotifications =
        await getNotifications(
          CURRENT_USER_ID
        );

      setNotificationsList(
        updatedNotifications
      );
    };

    // Check immediately.
    checkNotifications();

    // Check every 30 seconds.
    const interval = setInterval(
      checkNotifications,
      30_000
    );

    return () => {
      clearInterval(interval);
    };
  }, [role]);

  /*
   * Load notifications for other roles.
   */
  useEffect(() => {
    if (role === "organization_admin") {
      return;
    }

    const loadNotifications = async () => {
      const userNotifications =
        await getNotifications(
          CURRENT_USER_ID
        );

      setNotificationsList(
        userNotifications
      );
    };

    loadNotifications();
  }, [role]);

  const unreadCount = useMemo(
    () =>
      notificationsList.filter(
        (notification) =>
          !notification.read
      ).length,
    [notificationsList]
  );

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead(
      CURRENT_USER_ID
    );

    setNotificationsList((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = async (
    id: number
  ) => {
    await markNotificationAsRead(
      id,
      CURRENT_USER_ID
    );

    setNotificationsList((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {subtitle}
              </p>

              <h1 className="text-lg font-bold sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          {/* Header right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    (current) => !current
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
              >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() =>
                      setNotificationsOpen(false)
                    }
                    className="fixed inset-0 z-40 cursor-default lg:hidden"
                  />

                  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                    {/* Notification header */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-4">
                      <div>
                        <h2 className="font-semibold">
                          Notifications
                        </h2>

                        <p className="text-xs text-muted-foreground">
                          {unreadCount} unread{" "}
                          {unreadCount === 1
                            ? "notification"
                            : "notifications"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={
                            markAllAsRead
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="max-h-90 overflow-y-auto">
                      {notificationsList.length >
                      0 ? (
                        notificationsList.map(
                          (notification) => (
                            <div
                              key={
                                notification.id
                              }
                              className={`flex gap-3 border-b border-border px-4 py-4 transition last:border-0 hover:bg-muted/50 ${
                                !notification.read
                                  ? "bg-primary/3"
                                  : ""
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }
                                className="mt-1.5 shrink-0"
                                aria-label="Mark notification as read"
                              >
                                <span
                                  className={`block h-2.5 w-2.5 rounded-full ${
                                    !notification.read
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              </button>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                  {
                                    notification.title
                                  }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {
                                    notification.message
                                  }
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-3">
                                  <p className="text-[11px] text-muted-foreground">
                                    {formatNotificationTime(
                                      notification.createdAt
                                    )}
                                  </p>

                                  {notification.link && (
                                    <Link
                                      href={
                                        notification.link
                                      }
                                      onClick={() =>
                                        setNotificationsOpen(
                                          false
                                        )
                                      }
                                      className="text-xs font-semibold text-primary hover:underline"
                                    >
                                      {notification.type ===
                                      "meeting"
                                        ? "Join Meeting"
                                        : "View"}
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="px-4 py-10 text-center">
                          <Bell className="mx-auto h-8 w-8 text-muted-foreground/50" />

                          <p className="mt-3 text-sm font-semibold">
                            No notifications
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            You're all caught up.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border p-3">
                      <button
                        type="button"
                        className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="hidden h-10 items-center gap-3 rounded-xl border border-border bg-card px-3 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {currentRole.initials}
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-semibold">
                  {currentRole.name}
                </p>

                <p className="text-[11px] text-muted-foreground">
                  {currentRole.description}
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}