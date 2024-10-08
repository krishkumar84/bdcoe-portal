import Attendance from '@/lib/models/attendance.model';
import {ConnectToDB} from '@/lib/db';
import { getSession } from "next-auth/react"
import {NextResponse } from "next/server";
import { NextApiRequest,  NextApiResponse } from 'next';
import { authOptions } from "../auth/[...nextauth]/option"
import { getServerSession } from "next-auth/next"

export async function POST() {
  try {
    await ConnectToDB();
  // console.log(req)
  const session = await getServerSession(authOptions)
  // console.log(session)
  //  console.log(session)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.studentNo;

  const now = new Date();

  const attendanceDate = new Date(now); 

  console.log(userId, attendanceDate)

  // Create start of the day and end of the day to query the date range
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  // Query attendance by date range to ensure time is ignored
  const existingAttendance = await Attendance.findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay } // Date falls within the same day
  });
  if (existingAttendance) {
    return NextResponse.json({ message: 'Attendance already marked for today.' }, { status: 400 });
  }

  // Mark attendance
  const attendance = new Attendance({ userId, date: attendanceDate, markedAt: now, status: 'present' });
  await attendance.save();

  console.log(attendance)

  return NextResponse.json({ message: 'Attendance marked successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error
    })
  }
}

