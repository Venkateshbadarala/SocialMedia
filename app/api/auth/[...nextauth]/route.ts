import { NextAuthOptions, User as IUser } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/Adaptor/MongoAdaptor";
import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import bcrypt from "bcrypt";

interface ICustomUser extends IUser {
  roles: number[];
  active: boolean;
  is_admin: boolean;
  provider: string;
  userPosts: {
    _id: any;
    id: string;
    caption: string;
    photos: string[];
    likes: any[];
    comments: any[];
  }[];
  friendRequests: {
    senderId: string;
    senderName: string;
    senderImage?: string;
  }[];
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          uid: profile.sub,
          roles: [2001],
          is_admin: false,
          provider: "google",
          active: true,
          userPosts: [],
          friendRequests: [],
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name || "Anonymous",
          email: user.email,
          image: user.image,
          roles: user.roles,
          is_admin: user.is_admin,
          provider: user.provider,
          active: user.active,
          userPosts: user.userPosts.map((post:any )=> ({ ...post, id: post._id.toString() })),
          friendRequests: user.friendRequests,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        const userData = user as ICustomUser;
        const existingUser = userData.provider === "google"
          ? await User.findOne({ email: user.email })
          : null;

        const customData = existingUser
          ? {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
              roles: existingUser.roles,
              is_admin: existingUser.is_admin,
              active: existingUser.active,
              userPosts: existingUser.userPosts.map((post:any) => ({ ...post, id: post._id.toString() })),
              friendRequests: existingUser.friendRequests,
            }
          : {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              image: userData.image,
              roles: userData.roles,
              is_admin: userData.is_admin,
              active: userData.active,
              userPosts: userData.userPosts.map(post => ({ ...post, id: post._id.toString() })),
              friendRequests: userData.friendRequests,
            };

        return { ...token, ...customData };
      }

      await dbConnect();
      const currentUser = await User.findOne({ email: token.email });
      if (currentUser) {
        token = {
          ...token,
          id: currentUser._id.toString(),
          name: currentUser.name,
          email: currentUser.email,
          image: currentUser.image,
          roles: currentUser.roles,
          is_admin: currentUser.is_admin,
          active: currentUser.active,
          userPosts: currentUser.userPosts.map((post:any) => ({ ...post, id: post._id.toString() })),
          friendRequests: currentUser.friendRequests,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
