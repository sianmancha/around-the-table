import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { SessionStrategy } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

interface Credentials {
    email: string;
    password: string;
  }

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const {email, password} = credentials as Credentials
                try {
                  await connectMongoDB();
                  const user = await User.findOne({ email });
              
                  if (!user) {
                    return null;
                  }
              
                  const passwordsMatch = await bcrypt.compare(password, user.password);
              
                  if (!passwordsMatch) {
                    return null;
                  }
              
                  return user;
                } catch (error) {
                  console.log("Error: ", error);
                  return null;
                }
              },
              
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
    baseUrl: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};