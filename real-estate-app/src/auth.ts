import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().trim().toLowerCase();
        const password = (creds?.password || "").toString();

        const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || "";

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          return { id: "admin-1", email, role: "admin" as const };
        }

        // Demo user login: accept any non-empty email/password as a regular user
        if (email && password) {
          return { id: `user-${email}`, email, role: "user" as const };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as { role?: string }).role = (token as { role?: string }).role || "user";
      return session;
    },
  },
});