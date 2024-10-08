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

    if (adminRole === "user") {
      console.log("Invalid Authorization");
      return NextResponse.json({
        error: "Invalid Authorization",
      });
    }

    await ConnectToDB();

    const saveStartAttendance = await FreezeAttendance.findOne({ userId });

    if (saveStartAttendance) {
      if (saveStartAttendance.windowOpen === true) {
        return NextResponse.json({
          error: "Attendance is already started",
        });
      }

      const updateAttendance = await FreezeAttendance.findOneAndUpdate(
        { userId },
        { $set: { windowOpen: true } },
        { new: true }
      );

      console.log(updateAttendance, "update");

      return NextResponse.json({
        updateAttendance,
      });
    } else {
      const createAttendance = await FreezeAttendance.create({
        userId,
        windowOpen: true,
      });

      console.log(createAttendance, "create");

      return NextResponse.json({
        createAttendance,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Failed to start attendance",
    });
  }
}
