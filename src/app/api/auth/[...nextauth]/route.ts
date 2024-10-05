import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/lib/models/user.model';
import bcrypt from 'bcrypt';


declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    }
  }
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with the given email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { id: user._id, email: user.email }; // Return user object
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Save user ID to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Include user ID in session
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you set this in your .env
});
