import { users, type User } from "@/lib/mock-data/users";

const STORAGE_KEY = "tasker-users";

function getStoredUsers(): User[] {
  if (typeof window === "undefined") {
    return users;
  }

  const storedUsers = localStorage.getItem(STORAGE_KEY);

  if (!storedUsers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return [...users];
  }

  try {
    return JSON.parse(storedUsers) as User[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return [...users];
  }
}

function saveUsers(updatedUsers: User[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
}

export async function getUsers(
  organizationId: number
): Promise<User[]> {
  const storedUsers = getStoredUsers();

  return storedUsers.filter(
    (user) => user.organizationId === organizationId
  );
}

export async function getUser(
  userId: number,
  organizationId: number
): Promise<User | null> {
  const storedUsers = getStoredUsers();

  const user = storedUsers.find(
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
  const storedUsers = getStoredUsers();

  return storedUsers.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.teamId === teamId
  );
}

export async function getAvailableTeamMembers(
  organizationId: number,
  teamId: number
): Promise<User[]> {
  const storedUsers = getStoredUsers();

  return storedUsers.filter(
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
  const storedUsers = getStoredUsers();

  const userIndex = storedUsers.findIndex(
    (user) =>
      user.id === userId &&
      user.organizationId === organizationId
  );

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = {
    ...storedUsers[userIndex],
    teamId,
  };

  const updatedUsers = [...storedUsers];

  updatedUsers[userIndex] = updatedUser;

  saveUsers(updatedUsers);

  return updatedUser;
}

export async function removeUserFromTeam(
  userId: number,
  organizationId: number
): Promise<User | null> {
  const storedUsers = getStoredUsers();

  const userIndex = storedUsers.findIndex(
    (user) =>
      user.id === userId &&
      user.organizationId === organizationId
  );

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = {
    ...storedUsers[userIndex],
    teamId: null,
  };

  const updatedUsers = [...storedUsers];

  updatedUsers[userIndex] = updatedUser;

  saveUsers(updatedUsers);

  return updatedUser;
}

export async function getTeamLeads(
  organizationId: number
): Promise<User[]> {
  const storedUsers = getStoredUsers();

  return storedUsers.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.role === "Team Lead"
  );
}

export async function createUser(
  data: Omit<User, "id">
): Promise<User> {
  const storedUsers = getStoredUsers();

  const newUser: User = {
    ...data,
    id: Date.now(),
  };

  const updatedUsers = [...storedUsers, newUser];

  saveUsers(updatedUsers);

  return newUser;
}