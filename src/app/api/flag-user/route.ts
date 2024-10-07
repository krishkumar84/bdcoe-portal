import Attendance from '@/lib/models/attendance.model';
import {ConnectToDB} from '@/lib/db';
import {NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option"
import { getServerSession } from "next-auth/next"

export async function POST(req:Request) {
  await ConnectToDB();
  const { userId } = await req.json();
  console.log(userId)
  const session = await getServerSession(authOptions)
   console.log(session)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const now = new Date();

  const attendanceDate = new Date(now); 

  console.log(attendanceDate)
    try{
      console.log("here")

    const attendance = await Attendance.findOne({ userId });
      console.log(attendance)
      if (!attendance) {
        return NextResponse.json({ message: 'Attendance record not found.' }, { status: 404 });
      }

      // Delete attendance records for the previous two days
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate()-2);
      await Attendance.deleteMany({ userId, date: { $lt: twoDaysAgo } });

      return NextResponse.json({ message: 'Attendance flagged and previous records deleted.' }, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
}