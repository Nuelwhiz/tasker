import {
  getMeetings,
} from "@/lib/services/meeting-service";

import {
  getNotifications,
  createNotification,
} from "@/lib/services/notification-service";

const ORGANIZATION_ID = 1;

export async function checkMeetingNotifications(
  userId: number
): Promise<void> {
  const meetings =
    await getMeetings(ORGANIZATION_ID);

  const existingNotifications =
    await getNotifications(userId);

  const now = new Date();

  for (const meeting of meetings) {
    // Only check upcoming meetings.
    if (meeting.status !== "Upcoming") {
      continue;
    }

    const meetingStart = new Date(
      `${meeting.date}T${meeting.startTime}`
    );

    // Meeting hasn't started yet.
    if (now < meetingStart) {
      continue;
    }

    // Prevent duplicate notifications.
    const alreadyNotified =
      existingNotifications.some(
        (notification) =>
          notification.type === "meeting" &&
          notification.link ===
            `/organization/meetings/${meeting.id}`
      );

    if (alreadyNotified) {
      continue;
    }

    await createNotification({
      userId,
      organizationId:
        meeting.organizationId,
      type: "meeting",
      title: "Meeting starting now",
      message: `${meeting.title} is starting now.`,
      link:
        `/organization/meetings/${meeting.id}`,
      read: false,
    });
  }
}