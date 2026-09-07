export type User = {
  id: number;
  name: string;
  email: string;
  role: "Organization Admin" | "Team Lead" | "Member";
  status: "Active" | "Inactive";
  joinedAt: string;
  organization: string;
  organizationId: number;
};

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@acmetech.com",
    role: "Organization Admin",
    status: "Active",
    joinedAt: "Sep 4, 2026",
    organization: "Acme Technologies",
    organizationId: 1,
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@acmetech.com",
    role: "Team Lead",
    status: "Active",
    joinedAt: "Sep 5, 2026",
    organization: "Acme Technologies",
    organizationId: 1,
  },
  {
    id: 3,
    name: "Michael James",
    email: "michael.james@acmetech.com",
    role: "Member",
    status: "Active",
    joinedAt: "Sep 6, 2026",
    organization: "Acme Technologies",
    organizationId: 1,
  },
  {
    id: 4,
    name: "David Okafor",
    email: "david.okafor@acmetech.com",
    role: "Member",
    status: "Inactive",
    joinedAt: "Sep 6, 2026",
    organization: "Acme Technologies",
    organizationId: 1,
  },
  {
    id: 5,
    name: "Grace Johnson",
    email: "grace.johnson@acmetech.com",
    role: "Team Lead",
    status: "Active",
    joinedAt: "Sep 7, 2026",
    organization: "Acme Technologies",
    organizationId: 1,
  },
];