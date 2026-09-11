import {
  organizations,
  type Organization,
} from "@/lib/mock-data/organizations";

export async function getOrganizations(): Promise<Organization[]> {
  return organizations;
}

export async function getOrganization(
  organizationId: number
): Promise<Organization | null> {
  const organization = organizations.find(
    (organization) => organization.id === organizationId
  );

  return organization ?? null;
}

export async function createOrganization(
  data: Omit<Organization, "id">
): Promise<Organization> {
  const newOrganization: Organization = {
    ...data,
    id: Date.now(),
  };

  organizations.push(newOrganization);

  return newOrganization;
}

export async function updateOrganization(
  organizationId: number,
  data: Partial<Omit<Organization, "id">>
): Promise<Organization | null> {
  const organization = organizations.find(
    (organization) => organization.id === organizationId
  );

  if (!organization) {
    return null;
  }

  Object.assign(organization, data);

  return organization;
}

export async function deleteOrganization(
  organizationId: number
): Promise<boolean> {
  const organizationIndex = organizations.findIndex(
    (organization) => organization.id === organizationId
  );

  if (organizationIndex === -1) {
    return false;
  }

  organizations.splice(organizationIndex, 1);

  return true;
}