import Attendance from '@/lib/models/attendance.model';
import { ConnectToDB } from '@/lib/db';
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth/next";
import { User } from "@/lib/models/user.model";

export async function GET() {
  await ConnectToDB();

  // Check if the session belongs to an admin user
  const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== 'admin') {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // 1. Total number of students
    const totalStudents = await User.countDocuments();

    // 2. Today's date and the beginning of today (midnight)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    // Set end of the day to 23:59:59.999
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);
    
    // Query for present attendance within today's date range
    const presentToday = await Attendance.countDocuments({
      date: {
        $gte: todayStart,  // Greater than or equal to the start of the day
        $lte: todayEnd,    // Less than or equal to the end of the day
      },
      status: 'present'
    });

    // 4. Calculate the average attendance rate (for all students)
    const totalAttendanceRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({ status: 'present' });
    const averageAttendanceRate = totalAttendanceRecords === 0 ? 0 : (presentRecords / totalAttendanceRecords) * 100;

    // 5. Retrieve individual user attendance records
    const userAttendance = await User.aggregate([
      {
        $lookup: {
          from: 'attendances', // Join with the 'attendances' collection
          localField: 'studentNo', // Match 'studentNo' in User
          foreignField: 'userId',  // With 'userId' in Attendance
          as: 'attendanceRecords',
        },
      },
      {
        $project: {
          Name: 1,
          attendanceRecords: 1,
          totalPresent: {
            $size: {
              $filter: {
                input: '$attendanceRecords',
                as: 'record',
                cond: { $eq: ['$$record.status', 'present'] },
              },
            },
          },
          totalAbsent: {
            $size: {
              $filter: {
                input: '$attendanceRecords',
                as: 'record',
                cond: { $eq: ['$$record.status', 'absent'] },
              },
            },
          },
          attendanceRate: {
            $cond: {
              if: { $gt: [{ $size: '$attendanceRecords' }, 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: '$attendanceRecords',
                            as: 'record',
                            cond: { $eq: ['$$record.status', 'present'] },
                          },
                        },
                      },
                      { $size: '$attendanceRecords' },
                    ],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
        },
      },
    ]);
    

    // Respond with the necessary data
    return NextResponse.json(
      {
        totalStudents,
        presentToday,
        averageAttendanceRate,
        userAttendance,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json({ message: 'Error fetching attendance records.', error }, { status: 500 });
  }
}
