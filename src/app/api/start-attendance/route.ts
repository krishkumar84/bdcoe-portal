import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import FreezeAttendance from "@/lib/models/freeze.attendance";
import { ConnectToDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminRole = session.user.role;

    const userId = session.user.studentNo;

    console.log(userId);

    if (adminRole == "user") {
      return NextResponse.json({
        error: "Invalid Authorization",
      });
    }

    const body = await req.json();

    const { number } = body;

    console.log(number)

    await ConnectToDB();

    const saveStartAttendance = await FreezeAttendance.findOne({ userId });

    if (saveStartAttendance.windowOpen == true) {
      return NextResponse.json({
        error: "Attendance is already started",
      });
    }

    if (saveStartAttendance) {
      const updateAttendance = await FreezeAttendance.findOneAndUpdate(
        { userId },
        { $set: { windowOpen: true, time: number } },
        { new: true, upsert: true }
      );

      console.log(updateAttendance);

      return NextResponse.json({
        updateAttendance,
      });

    } else {
      const createAttendance = await FreezeAttendance.create({
        userId,
        windowOpen: true,
        time: number,
      });

      console.log(createAttendance);

      return NextResponse.json({
        createAttendance,
      });
    }
  } catch (error) {
    return NextResponse.json({
      error: "failed to start attendance",
    });
  }
}
