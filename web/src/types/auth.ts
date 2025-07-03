import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isParent: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    isParent: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isParent: boolean
  }
}