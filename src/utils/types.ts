interface Context {
  userId?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolverFunc<R, A> = (root: R, args: A, context: Context) => any;