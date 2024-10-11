import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import FreezeAttendance from "@/lib/models/freeze.attendance";
import { ConnectToDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
   
      return NextResponse.json({
        msg : "skmski"
      });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Failed",
    });
  }
}
