export type MeetingStatus =
  | "Upcoming"
  | "Completed"
  | "Cancelled";

export type MeetingType =
  | "Organization"
  | "Team";

export interface Meeting {
  id: number;
  organizationId: number;
  teamId: number | null;

  title: string;
  description: string;

  type: MeetingType;
  status: MeetingStatus;

  date: string;
  startTime: string;
  endTime: string;

  meetingLink: string;

  organizerId: number;

  createdAt: string;
}

export const meetings: Meeting[] = [
  {
    id: 1,
    organizationId: 1,
    teamId: null,

    title: "Monthly Organization Review",
    description:
      "Review organizational progress, challenges, and upcoming priorities.",

    type: "Organization",
    status: "Upcoming",

    date: "2026-09-18",
    startTime: "10:00",
    endTime: "11:00",

    meetingLink: "https://meet.google.com/example-review",

    organizerId: 1,

    createdAt: "2026-09-01",
  },

  {
    id: 2,
    organizationId: 1,
    teamId: 1,

    title: "Frontend Team Standup",
    description:
      "Discuss current frontend tasks, blockers, and progress.",

    type: "Team",
    status: "Upcoming",

    date: "2026-09-15",
    startTime: "09:00",
    endTime: "09:30",

    meetingLink: "https://meet.google.com/example-frontend",

    organizerId: 2,

    createdAt: "2026-09-05",
  },

  {
    id: 3,
    organizationId: 1,
    teamId: 2,

    title: "Backend Sprint Review",
    description:
      "Review backend sprint progress and discuss technical blockers.",

    type: "Team",
    status: "Completed",

    date: "2026-09-10",
    startTime: "14:00",
    endTime: "15:00",

    meetingLink: "https://meet.google.com/example-backend",

    organizerId: 3,

    createdAt: "2026-09-03",
  },
];