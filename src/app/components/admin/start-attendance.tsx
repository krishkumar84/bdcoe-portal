'use client'

import { useState,useEffect, useCallback, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from '@/components/ui/card'
import { getSocket } from "@/config/socket";



export default function StartAttendance() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false);
  const socket = getSocket();
  const [isHelloVisible, setIsHelloVisible] = useState(false);

  // Ensure handleSubmit only triggers on button click
  // const handleSubmit = useCallback(async () => {
  //   setIsLoading(true)
  //   setResult(null)

  //   try {
  //     const response = await fetch('/api/start-attendance', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error('API request failed')
  //     }

  //     const data = await response.json()
  //     setResult(data.message || 'Attendance Started')
  //     console.log(data)
  //   } catch (error) {
  //     setResult('An error occurred. Please try again.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  const handleToggle = () => {
    const newHelloState = !isHelloVisible;
    setIsHelloVisible(newHelloState);
    socket.emit("toggleHello", newHelloState); // Emit the new state
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }socket.on("toggleHello", (showHello: boolean) => {
      setIsVisible(showHello);
    });

    return () => {
      socket.off("toggleHello");
    };
  }, [socket]);

  return (
    <div className="w-full max-w-full mx-auto p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl shadow-xl">
      <CardHeader className='-mt-10'>
        <CardTitle className="text-3xl font-bold text-center">
          Start Attendance
        </CardTitle>
      </CardHeader>

      {/* Use a button click to invoke handleSubmit */}
      <div className='w-full text-center'>
      <Button onClick={handleToggle} type="button" disabled={isLoading} className="w-24 sm:w-32">
      {isHelloVisible ? "Stop Attendance" : "Start Attendance"}
      </Button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
          {result}
        </div>
      )}
    </div>
  );
}
function AttendanceProvider() {
  throw new Error('Function not implemented.')
}

