import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import bcryptjs from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

type CredentialsInput = {
  email: string;
  password: string;
};

const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      console.log("Login attempt:", credentials?.email);
      if (
        typeof credentials?.email !== "string" ||
        typeof credentials?.password !== "string"
      ) {
        return null;
      }

      const typedCredentials: CredentialsInput = {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password
      };

      const user = await prisma.user.findUnique({
        where: { email: typedCredentials.email }
      });
      console.log("User found:", user ? "yes" : "no");

      if (user?.password) {
        const match = await bcryptjs.compare(
          typedCredentials.password,
          user.password
        );
        console.log("Password match:", match);
      }

      if (!user?.password) {
        return null;
      }

      const passwordMatches = await bcryptjs.compare(
        typedCredentials.password,
        user.password
      );
      if (!passwordMatches) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    }
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      ]
    : [])
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? Role.CUSTOMER;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role === Role.ADMIN ? Role.ADMIN : Role.CUSTOMER;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        if (url.startsWith("/api/auth/signout")) {
          return `${baseUrl}/login`;
        }

        if (url === "/" || url.startsWith("/api/auth/signin")) {
          return `${baseUrl}/account`;
        }

        return `${baseUrl}${url}`;
      }

      try {
        const parsedUrl = new URL(url);

        if (parsedUrl.origin !== baseUrl) {
          return `${baseUrl}/account`;
        }

        if (parsedUrl.pathname.startsWith("/api/auth/signout")) {
          return `${baseUrl}/login`;
        }

        if (parsedUrl.pathname === "/" || parsedUrl.pathname.startsWith("/api/auth/signin")) {
          return `${baseUrl}/account`;
        }

        return parsedUrl.toString();
      } catch {
        return `${baseUrl}/account`;
      }
    }
  }
});
