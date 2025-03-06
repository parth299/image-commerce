import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import User from "@/models/User";

import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "email"},
                password: {label: "Password", type: "password", placeholder: "password"}
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide credentials correctly");
                }

                try {
                    const db = await connectToDb();
                    const user = await User.findOne({email: credentials.email});

                    if(!user) {
                        throw new Error("User not found!");
                    }

                    const isPasswordValid = bcrypt.compare(credentials.password, user.pasword);

                    if(!isPasswordValid) {
                        throw new Error("Invalid password! Please enter correct password");
                    }

                    return {        
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role
                    }

                } catch (error) {
                    console.error("Auth error: ", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async session({session, token}) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
             
            return session;
        },
        async jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}