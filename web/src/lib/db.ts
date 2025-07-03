import { PrismaClient } from '@/generated/prisma'

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

// Export as prisma for Auth.js compatibility
export const prisma = db

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

// Connection helper function
export async function connectDb() {
  try {
    await db.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

// Disconnect helper function
export async function disconnectDb() {
  try {
    await db.$disconnect()
    console.log('Database disconnected successfully')
  } catch (error) {
    console.error('Database disconnection error:', error)
    throw error
  }
}

// Health check function
export async function healthCheck() {
  try {
    await db.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('Database health check failed:', error)
    return { status: 'unhealthy', error: error, timestamp: new Date().toISOString() }
  }
}