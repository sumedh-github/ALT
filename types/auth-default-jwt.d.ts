declare module "@auth/core/jwt" {
  interface DefaultJWT {
    id?: string;
    role?: import("@prisma/client").Role;
  }
}
