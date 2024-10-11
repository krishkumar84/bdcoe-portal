import { ConnectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth/next";
import FlagUser from "@/lib/models/flag.model";
import { User } from "@/lib/models/user.model";

export async function POST(req: Request) {
  const body = await req.json()

  const {userId} = body;
  // console.log(userId);
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role
  const Id = session?.user.studentNo
  // console.log(session);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if(userRole != "admin"){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectToDB();

    const user = await User.findById({_id : userId})

    console.log(user,"ma");

    let flagUser = await FlagUser.findOne({ userId });

    // console.log(flagUser,"mamam")

    if (!flagUser) {
      flagUser = new FlagUser({ userId, Name: user.Name ,  flagCount: 1 });
    } else {
      if(flagUser.flagCount < 3){
        flagUser.flagCount += 1;
      }
    }

    await flagUser.save();
    
    if (flagUser.flagCount >= 3) {
      return NextResponse.json(
        { message: "You have been flagged. All Records has been deleted you are out from the Probation Period!!!!" },
        { status: 200 }
      );
    }
    

    return NextResponse.json(
      { message: "User flag.", flagCount: flagUser.flagCount },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
