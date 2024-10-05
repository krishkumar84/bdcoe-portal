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
    try{
    const attendance = await Attendance.findOneAndUpdate(
        { userId, date },
        { flagged: true },
        { new: true }
      );
      if (!attendance) {
        return NextResponse.json({ message: 'Attendance record not found.' }, { status: 404 });
      }

      // Delete attendance records for the previous two days
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      await Attendance.deleteMany({ userId, date: { $lt: twoDaysAgo } });

      return NextResponse.json({ message: 'Attendance flagged and previous records deleted.' }, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
}
