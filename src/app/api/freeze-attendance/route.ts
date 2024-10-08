import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/option';
import { ConnectToDB } from '@/lib/db';
import FreezeAttendances from '@/lib/models/freeze.attendance';

export async function POST(req: NextRequest) {
  try {
    // Establish database connection
    await ConnectToDB();

    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role;

    // Check if user is an admin
    if (userRole === 'user') {
      return NextResponse.json({ error: 'Invalid Authorization' }, { status: 403 });
    }

    // Assuming you're freezing attendance for a specific user (or globally, adjust accordingly)
    const userId = session.user.studentNo // Get userId from the request body

    // Find and update the attendance window for the user to freeze it
    const freezeAttendance = await FreezeAttendances.findOneAndUpdate(
      { userId },  // Find based on userId
      { windowOpen: false },  // Set windowOpen to false to freeze
      { new: true, upsert: true } // If not found, create new document
    );

    if (!freezeAttendance) {
      return NextResponse.json({ error: 'Failed to freeze attendance' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Attendance window frozen successfully', freezeAttendance });

  } catch (error) {
    console.error('Error freezing attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
