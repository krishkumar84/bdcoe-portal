import Attendance from '@/lib/models/attendance.model';
import { ConnectToDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request:Request) {
  await ConnectToDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // Get the userId from query parameters

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch attendance records for the user
    const attendanceRecords = await Attendance.find({ userId }).lean();

    if (!attendanceRecords.length) {
      return NextResponse.json({ message: "No attendance records found" }, { status: 404 });
    }
    
    // Calculate attendance stats
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const totalClasses = attendanceRecords.length;
    const absentCount = totalClasses - presentCount;
    const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

    // Structure response
    const attendanceData = {
      present: presentCount,
      absent: absentCount,
      total: totalClasses,
      attendanceRate: `${attendanceRate}%`
    };

    return NextResponse.json(attendanceData);
  } catch (error: any) {
    console.error("Error fetching attendance details:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
