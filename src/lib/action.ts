"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/option"
import { getServerSession } from "next-auth"
import Attendance from "./models/attendance.model"
import { ConnectToDB } from "./db"

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