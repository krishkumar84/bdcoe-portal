"use client"
// import SignupFormDemo from "./signin/page";

import { useSession } from "next-auth/react";

export default function Home() {

  const {data : session} = useSession();

  console.log(session,"wwedwedd")

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      {/* <SignupFormDemo /> */}
    </div>
  );
}
