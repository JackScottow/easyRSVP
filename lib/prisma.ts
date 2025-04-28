import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the Prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
// Check if we are in production or if the client hasn't been initialized yet
const prisma =
  global.prisma ||
  new PrismaClient({
    // Optionally log queries, useful for debugging
    // log: ['query', 'info', 'warn', 'error'],
  });

// In development, assign the client to the global variable
// This prevents creating multiple instances due to Next.js hot reloading
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
