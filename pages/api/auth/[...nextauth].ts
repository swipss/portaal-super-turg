import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook"
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  })
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}