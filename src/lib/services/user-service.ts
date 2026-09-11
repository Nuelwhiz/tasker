import { users, type User } from "@/lib/mock-data/users";

export async function getUsers(organizationId: number): Promise<User[]> {
  return users.filter(
    (user) => user.organizationId === organizationId
  );
}

export async function getUser(
  userId: number,
  organizationId: number
): Promise<User | null> {
  const user = users.find(
    (user) =>
      user.id === userId &&
      user.organizationId === organizationId
  );

  return user ?? null;
}

export async function getTeamMembers(
  organizationId: number,
  teamId: number
): Promise<User[]> {
  return users.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.teamId === teamId
  );
}

export async function getAvailableTeamMembers(
  organizationId: number,
  teamId: number
): Promise<User[]> {
  return users.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.teamId !== teamId &&
      user.role !== "Organization Admin"
  );
}

export async function assignUserToTeam(
  userId: number,
  organizationId: number,
  teamId: number
): Promise<User | null> {
  const user = users.find(
    (user) =>
      user.id === userId &&
      user.organizationId === organizationId
  );

  if (!user) {
    return null;
  }

  user.teamId = teamId;

  return user;
}

export async function removeUserFromTeam(
  userId: number,
  organizationId: number
): Promise<User | null> {
  const user = users.find(
    (user) =>
      user.id === userId &&
      user.organizationId === organizationId
  );

  if (!user) {
    return null;
  }

  user.teamId = null;

  return user;
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