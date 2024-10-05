import Attendance from '@/lib/models/attendance.model';
import {ConnectToDB} from '@/lib/db';
import { getSession } from "next-auth/react"
import {NextResponse } from "next/server";
import { NextApiRequest } from 'next';

export async function POST(req:NextApiRequest) {
  await ConnectToDB();

    const session = await getSession({ req });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { date } = req.body;
    const userId = session.user.id;

    const now = new Date();
    const attendanceDate = new Date(date);
    /// yha constant time define kra pdega 
    const timeDiff = now.getTime() - attendanceDate.getTime();

    // Check if the attendance can be marked (within 10 minutes)
    if (timeDiff < 0 || timeDiff > 10 * 60 * 1000) {
      return NextResponse.json({ message: 'You can only mark attendance for the current time or within 10 minutes.' });
    }

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({ userId, date: attendanceDate });
    if (existingAttendance) {
      return NextResponse.json({ message: 'Attendance already marked for today.' }, { status: 400 });
    }

    // Create a new attendance record
    const attendance = new Attendance({ userId, date: attendanceDate, markedAt: now, status: 'present' });
    await attendance.save();

    return NextResponse.json({ message: 'Attendance marked successfully!' }, { status: 201 });
}
