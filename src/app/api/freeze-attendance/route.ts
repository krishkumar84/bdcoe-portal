import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";


export async function POST (req:NextRequest){
    try {
        const session = await getServerSession(authOptions)
        console.log(session)
        if (!session) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      
        const adminRole = session.user.role;

        if(adminRole === 'user'){
            return NextResponse.json ( {
                error : "Invalid Authorization"
            })
        }

        


    } catch (error) {
        
    }
}