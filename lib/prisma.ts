import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function withPoolerCompatibility(connectionString: string) {
  try {
    const parsed = new URL(connectionString);
    if (!parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    return parsed.toString();
  } catch {
    return connectionString;
  }
}

const configuredDatabaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://alt_user:alt_password@localhost:5432/alt_db?sslmode=disable";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: withPoolerCompatibility(configuredDatabaseUrl)
      }
    },
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
