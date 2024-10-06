import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectToDB } from "@/app/lib/database";
import { User } from "@/app/lib/schema";
// import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

export default NextAuth({
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

          const userExists = await User.findOne({ studentNo});

 
          if(!userExists){
            throw new Error("Invalid user");
          }


          if (!userExists.password || !password) {
            throw new Error("Password is missing");
          }
          const compareUser = await bcrypt.compare(password, userExists.password);

          if (!compareUser) {
            throw new Error("Incorrect password");
          }
          return { id: userExists._id, studentNo: userExists.studentNo, name: userExists.name };

      } catch (error) {
          console.log(error);
          return null;
      }
    },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
