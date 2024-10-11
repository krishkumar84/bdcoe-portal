"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/option"
import { getServerSession } from "next-auth"
import Attendance from "./models/attendance.model"
import { ConnectToDB } from "./db"
import { User } from "./models/user.model"
import FlagUsers from "./models/flag.model"

export const showAttendence = async () => {

    const session = await getServerSession(authOptions)
    // console.log(session)
    if (!session) {
      return {
        error : "Please Login"
      }
    }

    const userId = session.user.studentNo;

    await ConnectToDB();

    const allData = await Attendance.find({userId}).lean();

    const plainData = JSON.parse(JSON.stringify(allData));

    // console.log(plainData,"sdfsf")

    return plainData;

}

export const showUserDetail = async ({ studentNo }: { studentNo: string }) => {
  try {
    
    const session = await getServerSession(authOptions)
    // console.log(session)
    if (!session) {
      return {
        error : "Please Login"
      }
    }
    
    await ConnectToDB();

    const userDetail = await User.findOne({ studentNo })

    if (!userDetail) {
      return { message: 'User not found', status: 404 };
    }

    return { userDetail, status: 200 }; 
  } catch (error) {
    return { error: 'Internal Server Error', status: 500 };
  }
};


export const saveNewProject = async (name : string , description : string , date : string) => {
  
  try {
    
    const session = await getServerSession(authOptions)
    console.log(session)
    if (!session) {
      return {
        error : "Please Login"
      }
    }

    await ConnectToDB();

    const uniqueName = await User.findOne({projects : {
      title : name
    }}).lean();

    if(uniqueName){
      return {
        error : "Project Name already exists!! try different name",
        status : 404
      }
    }

    const saveProject = await User.create({
      projects : {
        title : name,
        link : description,
        submissionDate : date
      }
    })

     const plain = JSON.parse(JSON.stringify(saveProject));


    console.log(plain);
    return plain;
  } catch (error) {
    console.log(error);
    return error;
  }

}

export const showAllUserDetails = async () => {
  try {
    
    await ConnectToDB();

    const allUser = await User.find({});

    return allUser;

  } catch (error) {
    return error;
  }
}

export const showFlaggedUserDetail = async (userId:string) => {
  try {
    
    await ConnectToDB();

    const user = await FlagUsers.findOne({userId}).lean();

    console.log(user,"sjsjsj")
    return user;

  } catch (error) {
    return error;
  }
}

export const showFlaggedUserDetailStudent = async (userId:string | undefined) => {
  try {
    
    await ConnectToDB();

    
    const user = await User.findOne({studentNo : userId});
    
    if(!user){
      console.log("first")
      return null
    }

    const fetchById = await FlagUsers.findOne({userId : user._id}).lean()

    return fetchById;

  } catch (error) {
    return error;
  }
}
