import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { config } from '@/lib/config';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(config.googleClientId && config.googleClientSecret
      ? [
          GoogleProvider({
            clientId: config.googleClientId,
            clientSecret: config.googleClientSecret,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        let dbUser = await db.getUserByEmail(user.email);
        
        if (!dbUser) {
          dbUser = await db.createUser(user.email, user.name || undefined, user.image || undefined);
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: config.nextAuthSecret,
};
