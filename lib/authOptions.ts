import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from 'bcryptjs';
import { SessionStrategy } from "next-auth";

interface Credentials {
  email: string;
  password: string;
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as Credentials;
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

export default authOptions;
