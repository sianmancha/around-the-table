import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { SessionStrategy } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import authOptions from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};