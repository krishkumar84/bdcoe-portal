import Attendance from '@/lib/models/attendance.model';
import {ConnectToDB} from '@/lib/db';
import {NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option"
import { getServerSession } from "next-auth/next"

export async function GET() {
  await ConnectToDB();
  // console.log(req)
  const session = await getServerSession(authOptions)
   console.log(session)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.studentNo;
  try {
    // Retrieve attendance records for the user
    const attendances = await Attendance.find({ userId }).sort({ date: -1 }); 
   console.log(attendances)
    return NextResponse.json(attendances, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching attendance records.', error }, { status: 500 });
  }
}


