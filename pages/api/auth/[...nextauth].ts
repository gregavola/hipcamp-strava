import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
  },
  pages: {
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (
        user.email.indexOf("@hipcamp") == -1 &&
        user.email !== "gregory.avola@gmail.com"
      ) {
        return `${process.env.NEXTAUTH_URL}?hipcamp=false`;
      } else {
        return true;
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.uid = account.id;
      }
      return Promise.resolve(token);
    },
    async session({ session, token, user }) {
      if (token.sub) {
        session.userId = token.sub;
      }

      return Promise.resolve(session);
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
});
