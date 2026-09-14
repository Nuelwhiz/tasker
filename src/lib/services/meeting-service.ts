import type { Meeting } from "@/lib/mock-data/meetings";
import { meetings } from "@/lib/mock-data/meetings";

const STORAGE_KEY = "tasker-meetings";

function getStoredMeetings(): Meeting[] {
  if (typeof window === "undefined") {
    return meetings;
  }

  const storedMeetings = localStorage.getItem(STORAGE_KEY);

  if (!storedMeetings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    return [...meetings];
  }

  try {
    return JSON.parse(storedMeetings) as Meeting[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(meetings)
    );

    return [...meetings];
  }
}

function saveMeetings(updatedMeetings: Meeting[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedMeetings)
  );
}

export async function getMeetings(
  organizationId: number
): Promise<Meeting[]> {
  const storedMeetings = getStoredMeetings();

  return storedMeetings.filter(
    (meeting) => meeting.organizationId === organizationId
  );
}

export async function getMeeting(
  meetingId: number,
  organizationId: number
): Promise<Meeting | null> {
  const storedMeetings = getStoredMeetings();

  const meeting = storedMeetings.find(
    (meeting) =>
      meeting.id === meetingId &&
      meeting.organizationId === organizationId
  );

  return meeting ?? null;
}

export async function getTeamMeetings(
  organizationId: number,
  teamId: number
): Promise<Meeting[]> {
  const storedMeetings = getStoredMeetings();

  return storedMeetings.filter(
    (meeting) =>
      meeting.organizationId === organizationId &&
      meeting.teamId === teamId
  );
}

export async function createMeeting(
  data: Omit<Meeting, "id">
): Promise<Meeting> {
  const storedMeetings = getStoredMeetings();

  const newMeeting: Meeting = {
    ...data,
    id: Date.now(),
  };

  const updatedMeetings = [
    ...storedMeetings,
    newMeeting,
  ];

  saveMeetings(updatedMeetings);

  return newMeeting;
}

export async function updateMeeting(
  meetingId: number,
  organizationId: number,
  data: Partial<Omit<Meeting, "id" | "organizationId">>
): Promise<Meeting | null> {
  const storedMeetings = getStoredMeetings();

  const meetingIndex = storedMeetings.findIndex(
    (meeting) =>
      meeting.id === meetingId &&
      meeting.organizationId === organizationId
  );

  if (meetingIndex === -1) {
    return null;
  }

  const updatedMeeting: Meeting = {
    ...storedMeetings[meetingIndex],
    ...data,
  };

  const updatedMeetings = [...storedMeetings];

  updatedMeetings[meetingIndex] = updatedMeeting;

  saveMeetings(updatedMeetings);

  return updatedMeeting;
}

export async function deleteMeeting(
  meetingId: number,
  organizationId: number
): Promise<boolean> {
  const storedMeetings = getStoredMeetings();

  const updatedMeetings = storedMeetings.filter(
    (meeting) =>
      !(
        meeting.id === meetingId &&
        meeting.organizationId === organizationId
      )
  );

  if (updatedMeetings.length === storedMeetings.length) {
    return false;
  }

  saveMeetings(updatedMeetings);

  return true;
}