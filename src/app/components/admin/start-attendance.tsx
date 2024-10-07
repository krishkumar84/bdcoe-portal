'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardHeader, CardTitle } from '@/components/ui/card'

export default function StartAttendance() {
  const [number, setNumber] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch('/api/start-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: parseInt(number, 10) }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setResult(data.message || 'Submission successful!')
      console.log(data)
    } catch (error) {
      setResult('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [number])

  return (
    <div className="w-full max-w-full mx-auto p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl shadow-xl  ">
      <CardHeader className='-mt-10'>
        <CardTitle className="text-3xl font-bold text-center">
          Start Attendance
        </CardTitle>
      </CardHeader>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center gap-6 items-center space-x-4 mb-4 w-full"
      >
        <Input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
          className="flex-grow w-96 p-5"
          required
        />
        <Button type="submit" disabled={isLoading} className="w-24 sm:w-32">
          {isLoading ? "Processing..." : "Start"}
        </Button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
          {result}
        </div>
      )}
    </div>
  );
}