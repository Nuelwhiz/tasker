export type OrganizationStatus =
  | "Active"
  | "Inactive"
  | "Pending";

export type Organization = {
  id: number;
  name: string;
  admin: string;
  email: string;
  adminEmail: string;
  phone: string;
  address: string;
  users: number;
  status: OrganizationStatus;
  created: string;
};

export const organizations: Organization[] = [
  {
    id: 1,
    name: "Acme Technologies",
    admin: "John Doe",
    email: "admin@acmetech.com",
    adminEmail: "john.doe@acmetech.com",
    phone: "+234 801 234 5678",
    address: "12 Admiralty Way, Lekki, Lagos",
    users: 24,
    status: "Active",
    created: "September 4, 2026",
  },
  {
    id: 2,
    name: "Bright Solutions",
    admin: "Sarah Williams",
    email: "admin@bright.com",
    adminEmail: "sarah.williams@bright.com",
    phone: "+234 802 345 6789",
    address: "24 Allen Avenue, Ikeja, Lagos",
    users: 16,
    status: "Active",
    created: "September 2, 2026",
  },
  {
    id: 3,
    name: "Nova Labs",
    admin: "Michael James",
    email: "admin@novalabs.com",
    adminEmail: "michael.james@novalabs.com",
    phone: "+234 803 456 7890",
    address: "18 Herbert Macaulay Way, Yaba, Lagos",
    users: 8,
    status: "Pending",
    created: "August 30, 2026",
  },
  {
    id: 4,
    name: "Vertex Digital",
    admin: "David Okafor",
    email: "admin@vertex.com",
    adminEmail: "david.okafor@vertex.com",
    phone: "+234 804 567 8901",
    address: "15 Adeola Odeku Street, Victoria Island, Lagos",
    users: 31,
    status: "Active",
    created: "August 27, 2026",
  },
];