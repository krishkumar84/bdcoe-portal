"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/option"
import { getServerSession } from "next-auth"
import Attendance from "./models/attendance.model"
import { ConnectToDB } from "./db"
import { User } from "./models/user.model"

export const showAttendence = async () => {

    const session = await getServerSession(authOptions)
    console.log(session)
    if (!session) {
      return {
        error : "Please Login"
      }
    }

    const userId = session.user.studentNo;

    await ConnectToDB();

    const allData = await Attendance.find({userId}).lean();

    const plainData = JSON.parse(JSON.stringify(allData));

    console.log(plainData,"sdfsf")

    return plainData;

}

export const showUserDetail = async ({ studentNo }: { studentNo: string }) => {
  try {
    await ConnectToDB();

    const userDetail = await User.findOne({ studentNo })

    if (!userDetail) {
      return { message: 'User not found', status: 404 };
    }

    return { userDetail, status: 200 }; 
  } catch (error) {
    return { error: 'Internal Server Error', status: 500 };
  }
};