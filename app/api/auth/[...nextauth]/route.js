import User from "@models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@utils/database'


connectToDB();

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
    async session({ session }) {
        const sessionUser = await User.findOne({ email: session.user.email})
        session.user.id = sessionUser._id.toString();
        return session;
    },
    async signIn({ profile }) {
            // serverless but that means it has to spin up connection to db each time
            // you hit it
            // check if user already exits
            const userExists = await User.findOne({ email: profile.email })
            // if not, create a new user
            if (!userExists) {
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture,
                })
            }
            return true;
        }
    }
})

export { handler as GET, handler as POST }
