declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: import("@prisma/client").Role;
  }
}
