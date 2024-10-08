import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/option';
import { ConnectToDB } from '@/lib/db';
import FreezeAttendances from '@/lib/models/freeze.attendance';

export async function GET(req: NextRequest) {
  try {
    await ConnectToDB();

    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.studentNo;

    // Find the freeze attendance status for the user
    const freezeAttendance = await FreezeAttendances.findOne({ userId });

    if (freezeAttendance.windowOpen == false) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    // Return the windowOpen status
    return NextResponse.json({ status : 200});
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
