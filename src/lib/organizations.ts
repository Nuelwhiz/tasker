import {
  organizations as initialOrganizations,
  type Organization,
  type OrganizationStatus,
} from "@/lib/mock-data/organizations";

const STORAGE_KEY = "tasker-organizations";

export function getOrganizations(): Organization[] {
  if (typeof window === "undefined") {
    return initialOrganizations;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialOrganizations)
    );

    return initialOrganizations;
  }

  try {
    return JSON.parse(stored) as Organization[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialOrganizations)
    );

    return initialOrganizations;
  }
}

export function saveOrganizations(
  organizations: Organization[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(organizations)
  );
}

export function createOrganization(
  data: Omit<Organization, "id" | "users" | "status" | "created">
): Organization {
  const currentOrganizations = getOrganizations();

  const newOrganization: Organization = {
    ...data,
    id:
      currentOrganizations.length > 0
        ? Math.max(
            ...currentOrganizations.map(
              (organization) => organization.id
            )
          ) + 1
        : 1,
    users: 1,
    status: "Pending",
    created: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  saveOrganizations([
    ...currentOrganizations,
    newOrganization,
  ]);

  return newOrganization;
}

export function updateOrganizationStatus(
  id: number,
  status: OrganizationStatus
) {
  const currentOrganizations = getOrganizations();

  const updatedOrganizations = currentOrganizations.map(
    (organization) =>
      organization.id === id
        ? {
            ...organization,
            status,
          }
        : organization
  );

  saveOrganizations(updatedOrganizations);
}

export function deleteOrganization(id: number) {
  const currentOrganizations = getOrganizations();

  const updatedOrganizations = currentOrganizations.filter(
    (organization) => organization.id !== id
  );

  saveOrganizations(updatedOrganizations);
}