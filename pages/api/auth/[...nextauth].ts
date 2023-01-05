import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

import { dbUsers } from "../../../database";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'correo@google.com'  },
        password: { label: 'Password:', type: 'password', placeholder: 'Password'  },
      },
      async authorize(credentials) {
        console.log({credentials});
        // return { name: 'Daniel', email: 'daniel@google.com', role: 'admin' } as any;

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password ) as any;

      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400 // every day
  },

  callbacks: {

    async jwt({ token, account, user }) {
    // console.log({ token, account, user });

      if ( account ) {
        token.accessToken = account.access_token;

        switch ( account.type ) {

          case 'oauth':
              token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
            break;

          case 'credentials':
              token.user = user;
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      // console.log({ session, token, user });

      session.accessToken = token.accessToken as any;
      session.user = token.user as any;

      return session;
    }

  }
}

export default NextAuth(authOptions)