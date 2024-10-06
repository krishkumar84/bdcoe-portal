import Attendance from '@/lib/models/attendance.model';
import {ConnectToDB} from '@/lib/db';
import { getSession } from "next-auth/react"
import {NextResponse } from "next/server";
import { NextApiRequest,  NextApiResponse } from 'next';
import { authOptions } from "../auth/[...nextauth]/option"
import { getServerSession } from "next-auth/next"

export async function POST(req: NextApiRequest,res: NextApiResponse) {
  await ConnectToDB();
  // console.log(req)
  const session = await getServerSession(authOptions)
  // console.log(session)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.studentNo;

  const now = new Date();

  const attendanceDate = new Date(now); 
  attendanceDate.setHours(17, 40, 0, 0); 


  const timeDiff = Math.abs(now.getTime() - attendanceDate.getTime());

  if (timeDiff > 10 * 60 * 1000) {
    return NextResponse.json({ message: 'You can only mark attendance at 4:40 PM or within 5 minutes of it.' });
  }

  // Check if attendance has already been marked today
  const existingAttendance = await Attendance.findOne({ userId, date: attendanceDate });
  if (existingAttendance) {
    return NextResponse.json({ message: 'Attendance already marked for today.' }, { status: 400 });
  }

  // Mark attendance
  const attendance = new Attendance({ userId, date: attendanceDate, markedAt: now, status: 'present' });
  await attendance.save();

  return NextResponse.json({ message: 'Attendance marked successfully!' }, { status: 201 });
}


