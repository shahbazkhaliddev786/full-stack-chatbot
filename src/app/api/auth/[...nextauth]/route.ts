// 'use client'
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth/next";
import { login } from "../../../../lib/Login";
import { middleware } from "@/middleware";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req): Promise<any> {
                const { email, password } = credentials as { email: string; password: string };
                try {
                  const user = await login(email, password);
                  const token = jwt.sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET!, { expiresIn: '1h' });
                 
                  // return { ...user, token };
                  return user;
                } catch (error: any) {
                  console.error("Authorize error:", error);
                  throw new Error(error.message);
                }
              },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {

         async jwt({ token, user }) {
             if (user) {
                 token.id = user.id;
                 token.email = user.email;
                //  token.accessToken = user.token;
             }
             return token;
         },
         async session({ session, token, }) {
             if (token) {
                 session.user = {
                     id: token.id as string,
                     email: token.email as string,
                    //  accessToken: token.accessToken as string,
                 };
             }
             return session;
         },
    },
    session: {
        strategy: 'jwt',
    },
    // pages: {
    //     signIn: '/auth/signin',
    // },
};

const handler = NextAuth(authOptions);
middleware(handler);
export { handler as GET, handler as POST };

