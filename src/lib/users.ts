import {
  users as initialUsers,
  type User,
} from "@/lib/mock-data/users";

const STORAGE_KEY = "tasker-users";

export function getUsers(): User[] {
  if (typeof window === "undefined") {
    return initialUsers;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialUsers)
    );

    return initialUsers;
  }

  try {
    return JSON.parse(stored) as User[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialUsers)
    );

    return initialUsers;
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
  );
}

export function inviteUser(data: {
  name: string;
  email: string;
  role: User["role"];
  organization: string;
  organizationId: number;
}): User {
  const currentUsers = getUsers();

  const newUser: User = {
    id:
      currentUsers.length > 0
        ? Math.max(
            ...currentUsers.map((user) => user.id)
          ) + 1
        : 1,

    name: data.name,
    email: data.email,
    role: data.role,
    status: "Pending",
    joinedAt: "Pending",
    organization: data.organization,
    organizationId: data.organizationId,
  };

  saveUsers([...currentUsers, newUser]);

  return newUser;
}

export function updateUserStatus(
  id: number,
  status: User["status"]
) {
  const currentUsers = getUsers();

  const updatedUsers = currentUsers.map((user) =>
    user.id === id
      ? {
          ...user,
          status,
        }
      : user
  );

  saveUsers(updatedUsers);
}

export function deleteUser(id: number) {
  const currentUsers = getUsers();

  const updatedUsers = currentUsers.filter(
    (user) => user.id !== id
  );

  saveUsers(updatedUsers);
}