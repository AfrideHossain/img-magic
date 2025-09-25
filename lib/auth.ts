import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //   check if email and passwords are provided
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          // connect to database
          await connectToDatabase();

          //   get user from database by email
          const user = await User.findOne({ email: credentials.email });

          // check if user is found or not
          if (!user) {
            throw new Error("No user found with this credentials");
          }

          // check password
          const isValidPassword = bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // return user
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize error: ", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // jwt callbacks
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // session callbacks
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};
