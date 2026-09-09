export type Team = {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  teamLeadId: number | null;
  status: "Active" | "Inactive";
  createdAt: string;
};

export const teams: Team[] = [
  {
    id: 1,
    organizationId: 1,
    name: "Frontend",
    description:
      "Builds and maintains the frontend applications, interfaces, and user experiences.",
    teamLeadId: 2,
    status: "Active",
    createdAt: "Jan 15, 2026",
  },
  {
    id: 2,
    organizationId: 1,
    name: "Backend",
    description:
      "Develops APIs, server-side applications, databases, and backend services.",
    teamLeadId: 5,
    status: "Active",
    createdAt: "Jan 15, 2026",
  },
  {
    id: 3,
    organizationId: 1,
    name: "Design",
    description:
      "Creates user interfaces, visual designs, prototypes, and design systems.",
    teamLeadId: null,
    status: "Active",
    createdAt: "Jan 20, 2026",
  },
  {
    id: 4,
    organizationId: 1,
    name: "Product",
    description:
      "Handles product planning, requirements, priorities, and coordination across teams.",
    teamLeadId: null,
    status: "Active",
    createdAt: "Jan 22, 2026",
  },
  {
    id: 5,
    organizationId: 1,
    name: "Marketing",
    description:
      "Manages content, campaigns, communications, and the organization's marketing activities.",
    teamLeadId: null,
    status: "Active",
    createdAt: "Feb 2, 2026",
  },
  {
    id: 6,
    organizationId: 1,
    name: "Quality Assurance",
    description:
      "Tests applications, identifies issues, and helps maintain product quality.",
    teamLeadId: null,
    status: "Active",
    createdAt: "Feb 5, 2026",
  },
];