import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// TODO: remove hardcoded URL once env vars are wired up for production.
const DATABASE_URL =
	process.env.DATABASE_URL ??
	"postgresql://neondb_owner:npg_7KvIQpb2dSEW@ep-cold-sea-ayaq1m8m.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
