declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: import("@prisma/client").Role;
  }
}
