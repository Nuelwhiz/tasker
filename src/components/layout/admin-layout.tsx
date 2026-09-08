"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Menu,
} from "lucide-react";

import AdminSidebar from "@/components/layout/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

type Notification = {
  id: number;
  role:
    | "super_admin"
    | "organization_admin"
    | "team_lead"
    | "member";
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    role: "super_admin",
    title: "New organization created",
    message: "A new organization has been added to Tasker.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    role: "super_admin",
    title: "New user registered",
    message: "A new user has joined the Tasker platform.",
    time: "25 min ago",
    unread: true,
  },
  {
    id: 3,
    role: "super_admin",
    title: "Organization admin assigned",
    message: "An organization admin has been assigned.",
    time: "1 hour ago",
    unread: false,
  },

  // Organization Admin notifications
  {
    id: 4,
    role: "organization_admin",
    title: "New member joined",
    message: "A new member has joined your organization.",
    time: "10 min ago",
    unread: true,
  },

  // Team Lead notifications
  {
    id: 5,
    role: "team_lead",
    title: "New task assigned",
    message: "A new task has been assigned to your team.",
    time: "15 min ago",
    unread: true,
  },

  // Member notifications
  {
    id: 6,
    role: "member",
    title: "Task assigned to you",
    message: "You have been assigned a new task.",
    time: "20 min ago",
    unread: true,
  },
];

export default function AdminLayout({
  children,
  title = "Super Admin Dashboard",
  subtitle = "Tasker Administration",
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [notificationsList, setNotificationsList] =
    useState(notifications);

  /*
   * Temporary role.
   *
   * Later this will come from the authenticated
   * Laravel user/session.
   */
  const currentUserRole = "super_admin";

  const userNotifications = useMemo(
    () =>
      notificationsList.filter(
        (notification) =>
          notification.role === currentUserRole,
      ),
    [notificationsList, currentUserRole],
  );

  const unreadCount = userNotifications.filter(
    (notification) => notification.unread,
  ).length;

  const markAllAsRead = () => {
    setNotificationsList((current) =>
      current.map((notification) =>
        notification.role === currentUserRole
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  const markAsRead = (id: number) => {
    setNotificationsList((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
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

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    (current) => !current,
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
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
                  {/* Mobile backdrop */}
                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() =>
                      setNotificationsOpen(false)
                    }
                    className="fixed inset-0 z-40 cursor-default lg:hidden"
                  />

                  {/* Notification dropdown */}
                  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
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
                          onClick={markAllAsRead}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {userNotifications.length > 0 ? (
                        userNotifications.map(
                          (notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification.id,
                                )
                              }
                              className={`flex w-full gap-3 border-b border-border px-4 py-4 text-left transition last:border-0 hover:bg-muted/50 ${
                                notification.unread
                                  ? "bg-primary/[0.03]"
                                  : ""
                              }`}
                            >
                              <div className="mt-1.5 shrink-0">
                                <span
                                  className={`block h-2.5 w-2.5 rounded-full ${
                                    notification.unread
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {notification.message}
                                </p>

                                <p className="mt-1.5 text-[11px] text-muted-foreground">
                                  {notification.time}
                                </p>
                              </div>
                            </button>
                          ),
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

            {/* Admin profile */}
            <div className="hidden h-10 items-center gap-3 rounded-xl border border-border bg-card px-3 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                SA
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-semibold">
                  Super Admin
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Platform Owner
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