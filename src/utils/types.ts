import { PrismaClient } from '.prisma/client';

interface Context {
  userId?: string
  prisma: PrismaClient
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolverFunc<R, A> = (root: R, args: A, context: Context) => any;