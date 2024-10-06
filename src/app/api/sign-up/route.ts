import User from '@/lib/models/user.model';
import {ConnectToDB} from '@/lib/db';
import bcrypt from 'bcrypt';
import {NextResponse } from "next/server";
import { NextApiRequest } from 'next';

export async function POST(req:NextApiRequest) {
    await ConnectToDB();
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ message: 'User created successfully!' });
  }
