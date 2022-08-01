import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import EmailProvider  from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from 'next-auth/providers/google'
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
    providers: [
    EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        
    }),
    FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
        params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
        }
    },
  }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}

