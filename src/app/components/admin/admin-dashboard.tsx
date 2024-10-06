"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarDays, Users, BarChart, Search, ChevronLeft, ChevronRight, UserCheck, UserX } from "lucide-react"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from "sonner"
import { StudentDetailsPopup } from "./students-details"

// Mock data for demonstration
const initialStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      present: 15,
      absent: 2,
      total: 17,
      project: {
        name: "Web Development Project",
        status: 75
      },
      comments: [
        { id: 1, date: "2023-05-15", text: "Excellent progress on the frontend tasks." },
        { id: 2, date: "2023-05-20", text: "Needs to improve on backend integration." }
      ]
    },
    {
      id: 2,
      name: "Bob Smith",
      present: 14,
      absent: 3,
      total: 17,
      project: {
        name: "Mobile App Development",
        status: 60
      },
      comments: [
        { id: 1, date: "2023-05-18", text: "Good understanding of React Native concepts." },
        { id: 2, date: "2023-05-22", text: "Struggling with state management. Needs assistance." }
      ]
    },
  ]

export default function AttendanceDashboard() {
  const [students, setStudents] = useState(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string; present: number; absent: number; total: number; project: { name: string; status: number }; comments: { id: number; date: string; text: string }[] } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: false }), {})
  )
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const itemsPerPage = 10
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage))
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalStudents = students.length
  const totalPresent = students.reduce((sum, student) => sum + student.present, 0)
  const totalAbsent = students.reduce((sum, student) => sum + student.absent, 0)
  const averageAttendance = totalStudents > 0 ? (totalPresent / (totalPresent + totalAbsent) * 100).toFixed(2) : 0

  const handleAttendanceChange = (studentId:any) => {
    // setAttendance((prev) => ({ ...acc, [studentId]: !prev[studentId] }))
  }

  const handleSubmitAttendance = () => {
    // Here you would typically send the attendance data to your backend
    console.log("Submitting attendance:", attendance)
    // Update the students' attendance
    // const updatedStudents = students.map(student => ({
    //   ...student,
    //   present: student.present + (attendance[student.id] ? 1 : 0),
    //   absent: student.absent + (attendance[student.id] ? 0 : 1),
    //   total: student.total + 1
    // }))
    // setStudents(updatedStudents)
    // Reset attendance after submission
    setAttendance(students.reduce((acc, student) => ({ ...acc, [student.id]: false }), {}))
    toast(
      "The attendance has been successfully recorded.",
    )
  }

  const handleViewStats = (student:any) => {
    setSelectedStudent(student)
    setIsPopupOpen(true)
  }

  const AttendanceSummary = () => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPresent}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttendance}%</div>
        </CardContent>
      </Card>
    </div>
  )

  const AttendanceTable = () => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Attendance Rate</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.present}</TableCell>
              <TableCell>{student.absent}</TableCell>
              <TableCell>{((student.present / student.total) * 100).toFixed(2)}%</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleViewStats(student)}>View Stats</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const ManualAttendance = () => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Present</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <Checkbox
                //   checked={attendance[student.id] || false}
                  onCheckedChange={() => handleAttendanceChange(student.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleSubmitAttendance} className="w-full">
        Submit Attendance
      </Button>
    </div>
  )

  const StudentStatistics = () => {
    if (!selectedStudent) {
      return <p className="text-center text-gray-500">Select a student to view their statistics.</p>
    }

    const attendanceData = [
      { name: 'Present', value: selectedStudent.present },
      { name: 'Absent', value: selectedStudent.absent },
    ]

    const attendanceRate = ((selectedStudent.present / selectedStudent.total) * 100).toFixed(2)

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{selectedStudent.name}'s Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Classes</p>
                <p className="text-2xl font-bold">{selectedStudent.total}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Present</p>
                <p className="text-2xl font-bold">{selectedStudent.present}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Absent</p>
                <p className="text-2xl font-bold">{selectedStudent.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance Management System</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <AttendanceSummary />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Users className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mark-attendance">
            <CalendarDays className="mr-2 h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Overview</CardTitle>
              <CardDescription>View and manage student attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mark-attendance">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>Manually mark attendance for students</CardDescription>
            </CardHeader>
            <CardContent>
              <ManualAttendance />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Student Statistics</CardTitle>
              <CardDescription>View detailed attendance statistics for each student</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentStatistics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedStudent && (
        <StudentDetailsPopup
          student={selectedStudent}
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false)
            setSelectedStudent(null)
          }}
        />
      )}
    </div>
  )
}