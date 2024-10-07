import Attendance from '@/lib/models/attendance.model';
import { ConnectToDB } from '@/lib/db';
import { User } from '@/lib/models/user.model';
import { NextResponse } from 'next/server';

export async function POST() {
  await ConnectToDB();

  // 1. Get all users
  const allUsers = await User.find({}, { studentNo: 1, Name: 1 });

  // 2. Today's date range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  try {
    // 3. Fetch all attendance records for today
    const todayAttendance = await Attendance.find({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      }
    }, { userId: 1, status: 1 }).lean();

    // Create sets for present and absent users
    const presentUserIdSet = new Set(todayAttendance.filter(record => record.status === 'present').map(record => record.userId));
    const absentUserIdSet = new Set(todayAttendance.filter(record => record.status === 'absent').map(record => record.userId));

    // 4. Identify users who haven't been marked for attendance today
    const unmarkedUsers = allUsers.filter(user => !presentUserIdSet.has(user.studentNo) && !absentUserIdSet.has(user.studentNo));

    // 5. Mark unmarked users as absent
    let newAbsenteesCount = 0;
    for (const user of unmarkedUsers) {
      const attendanceDate = todayStart;
      const now = new Date();

      const attendance = new Attendance({
        userId: user.studentNo,
        date: attendanceDate,
        markedAt: now,
        status: 'absent',
        verified: false,
        flagged: false
      });

      await attendance.save();
      newAbsenteesCount++;
    }

    return NextResponse.json(`Marked ${newAbsenteesCount} new users as absent.`);
  } catch (error: unknown) {
    console.error("Error marking absentees:", error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}