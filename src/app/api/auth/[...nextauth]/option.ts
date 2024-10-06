import {NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectToDB } from "@/app/lib/database";
// import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import {User} from "@/lib/models/user.model";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
        name: "credentials",
        credentials : {
            studentNo: {
                label : "studentNo",
                type : "text"
            },
             password: {
                label : "password",
                type : "password"
             } 
        },
      async authorize(credentials) {
        const { studentNo, password } = credentials as { studentNo: string; password: string };

        if(!studentNo || !password ){
          throw new Error("Please fill in both fields");
        }


      try {

          await ConnectToDB();

          const user = await User.findOne({ studentNo});

 
          if(!user){
            throw new Error("Invalid user");
          }


          if (!user.password || !password) {
            throw new Error("Password is missing");
          }
          // const compareUser = await bcrypt.compare(password, user.password);

          if(password != user.password){
            throw new Error("Incorrect password");
          }

          return user;

      } catch (error) {
          console.log(error);
          return null;
      }
    },
    }),
  ],
  callbacks : {
    async jwt({token , user}){
      if(user){
         token.id = user._id?.toString();
         token.isVerified = user.isVerified;
         token.studentNo = user.studentNo;
      }
      return token
    },
    async session({session , token}){
      if(token){
        session.user._id = token._id as string;
        session.user.studentNo = token.studentNo as string;
        session.user.isVerified = token.isVerified as boolean
      }
      return session;
    }
    
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

