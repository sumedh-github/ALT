import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ??
          "postgresql://alt_user:alt_password@localhost:5432/alt_db?sslmode=disable"
      }
    },
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
