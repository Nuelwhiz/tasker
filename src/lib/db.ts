import * as PrismaContract from "@/prisma/contract";

// Handle named export or default export from generated contract types
const PrismaClientConstructor =
  (PrismaContract as any).PrismaClient || PrismaContract;

type PrismaClientType = InstanceType<typeof PrismaClientConstructor>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

export const db: PrismaClientType =
  globalForPrisma.prisma ??
  new PrismaClientConstructor({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}