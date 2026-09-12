import { teams, type Team } from "@/lib/mock-data/teams";
import { users, type User } from "@/lib/mock-data/users";

const STORAGE_KEY = "tasker-teams";

function getStoredTeams(): Team[] {
  if (typeof window === "undefined") {
    return teams;
  }

  const storedTeams = localStorage.getItem(STORAGE_KEY);

  if (!storedTeams) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    return [...teams];
  }

  try {
    return JSON.parse(storedTeams) as Team[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    return [...teams];
  }
}

function saveTeams(updatedTeams: Team[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedTeams)
  );
}

export async function getTeams(
  organizationId: number
): Promise<Team[]> {
  const storedTeams = getStoredTeams();

  return storedTeams.filter(
    (team) => team.organizationId === organizationId
  );
}

export async function getTeam(
  teamId: number,
  organizationId: number
): Promise<Team | null> {
  const storedTeams = getStoredTeams();

  const team = storedTeams.find(
    (team) =>
      team.id === teamId &&
      team.organizationId === organizationId
  );

  return team ?? null;
}

export async function getTeamLeads(
  organizationId: number
): Promise<User[]> {
  return users.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.role === "Team Lead"
  );
}

export async function createTeam(
  data: Omit<Team, "id" | "createdAt">
): Promise<Team> {
  const storedTeams = getStoredTeams();

  const newTeam: Team = {
    ...data,
    id: Date.now(),
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  const updatedTeams = [...storedTeams, newTeam];

  saveTeams(updatedTeams);

  return newTeam;
}

export async function updateTeam(
  teamId: number,
  organizationId: number,
  data: Partial<
    Omit<Team, "id" | "organizationId" | "createdAt">
  >
): Promise<Team | null> {
  const storedTeams = getStoredTeams();

  const teamIndex = storedTeams.findIndex(
    (team) =>
      team.id === teamId &&
      team.organizationId === organizationId
  );

  if (teamIndex === -1) {
    return null;
  }

  const updatedTeam = {
    ...storedTeams[teamIndex],
    ...data,
  };

  const updatedTeams = [...storedTeams];

  updatedTeams[teamIndex] = updatedTeam;

  saveTeams(updatedTeams);

  return updatedTeam;
}

export async function deleteTeam(
  teamId: number,
  organizationId: number
): Promise<boolean> {
  const storedTeams = getStoredTeams();

  const updatedTeams = storedTeams.filter(
    (team) =>
      !(
        team.id === teamId &&
        team.organizationId === organizationId
      )
  );

  if (updatedTeams.length === storedTeams.length) {
    return false;
  }

  saveTeams(updatedTeams);

  return true;
}