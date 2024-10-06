import {User} from '@/lib/models/user.model';
import {ConnectToDB} from '@/lib/db';
import {NextResponse } from "next/server";

export async function POST(req:Request) {
    await ConnectToDB();
    const body = await req.json();
    const {studentNo, password ,name} = body;

    // console.log(studentNo, password);
    // console.log(body);
    // console.log("here")

    if (!studentNo || !password || !name) {
      return NextResponse.json({ message: 'studentNo and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ studentNo });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const user = new User({ studentNo, password , Name : name});
    await user.save();

    return NextResponse.json({ message: 'User created successfully!' });
  }
