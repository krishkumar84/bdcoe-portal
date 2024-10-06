"use client"

import { useState, useEffect } from "react"
import { CalendarDays, User, CheckCircle, Book, BarChart2, Clock, AlertTriangle, Upload, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { format, parseISO, isToday, differenceInMinutes } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditProfilePopup } from "./edit-student-profile"

const initialStudentData = {
    name: "John Doe",
    id: "S12345",
    course: "Computer Science",
    email: "john.doe@example.com",
    year: "3rd Year",
    totalClasses: 100,
    attendedClasses: 85,
  }

const attendanceData = [
  { date: "2023-05-01", status: "Present" },
  { date: "2023-05-02", status: "Absent" },
  { date: "2023-05-03", status: "Present" },
  { date: "2023-05-04", status: "Present" },
  { date: "2023-05-05", status: "Absent" },
  { date: "2023-05-06", status: "Present" },
  { date: "2023-05-07", status: "Present" },
]

// Simulated attendance window (10 minutes from now)
const attendanceWindowStart = new Date()
const attendanceWindowEnd = new Date(attendanceWindowStart.getTime() + 10 * 60000)

// Mock project data
const projectData = [
  {
    id: 1,
    name: "Web Development Project",
    description: "Create a responsive website using React and Next.js",
    dueDate: "2023-06-15",
    status: "In Progress",
    updates: [
      { date: "2023-05-01", comment: "Started project planning" },
      { date: "2023-05-03", comment: "Completed wireframes" },
    ],
  },
  {
    id: 2,
    name: "Machine Learning Assignment",
    description: "Implement a neural network for image classification",
    dueDate: "2023-06-30",
    status: "Not Started",
    updates: [],
  },
]

export default function EnhancedStudentDashboard() {
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAttendanceWindowOpen, setIsAttendanceWindowOpen] = useState(true)
  const [projects, setProjects] = useState(projectData)
  const [newProject, setNewProject] = useState({ name: "", description: "", dueDate: "" })
  const [selectedProject, setSelectedProject] = useState<{ id: number; name: string; description: string; dueDate: string; status: string; updates: { date: string; comment: string }[] } | null>(null)
  const [newUpdate, setNewUpdate] = useState("")
  const [studentData, setStudentData] = useState(initialStudentData)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      if (now >= attendanceWindowEnd) {
        setIsAttendanceWindowOpen(false)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const markAttendance = () => {
    setAttendanceMarked(true)
  }

  const attendancePercentage = (studentData.attendedClasses / studentData.totalClasses) * 100
  const timeLeftInMinutes = Math.max(0, differenceInMinutes(attendanceWindowEnd, currentTime))

  const handleProjectSubmit = (e:any) => {
    e.preventDefault()
    setProjects([...projects, { ...newProject, id: projects.length + 1, status: "Not Started", updates: [] }])
    setNewProject({ name: "", description: "", dueDate: "" })
  }

  const handleProjectUpdate = (e:any) => {
    e.preventDefault()
    if (selectedProject && newUpdate) {
      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
          ? { ...project, updates: [...project.updates, { date: format(new Date(), 'yyyy-MM-dd'), comment: newUpdate }] }
          : project
      )
      setProjects(updatedProjects)
      setNewUpdate("")
    }
  }

  const handleProfileUpdate = (updatedData:any) => {
    setStudentData(updatedData)
  }

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage)

  const paginate = (pageNumber:any) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">BDCOE Student Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder-avatar.jpg" alt={studentData.name} />
                <AvatarFallback>{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{studentData.name}</h2>
                <p className="text-gray-500">{studentData.id}</p>
                <p className="text-gray-500">{studentData.course}</p>
                <p className="text-gray-500">{studentData.year}</p>
                <p className="text-gray-500">{studentData.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <EditProfilePopup studentData={studentData} onSave={handleProfileUpdate} />
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              {/* <TabsTrigger value="timetable">Timetable</TabsTrigger> */}
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="attendance">
              <CardHeader>
                <CardTitle>Attendance Record</CardTitle>
                <CardDescription>Your recent attendance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRecords.map((day, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg shadow">
                      <span className="font-medium">{format(parseISO(day.date), 'MMMM d, yyyy')}</span>
                      <Badge variant={day.status === "Present" ? "default" : "destructive"}>
                        {day.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <Label htmlFor="recordsPerPage" className="mr-2">
                    Records per page:
                  </Label>
                  <Select
                    value={recordsPerPage.toString()}
                    onValueChange={(value) => {
                      setRecordsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </TabsContent>
            <TabsContent value="projects">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your projects and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="new" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="new">New Project</TabsTrigger>
                    <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
                    <TabsTrigger value="completed">Completed Projects</TabsTrigger>
                  </TabsList>
                  <TabsContent value="new">
                    <div className="bg-white p-4 rounded-lg shadow mt-4">
                      <h3 className="font-semibold text-lg mb-4">Submit New Project</h3>
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            id="projectName"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea
                            id="projectDescription"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDueDate">Due Date</Label>
                          <Input
                            id="projectDueDate"
                            type="date"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                            required
                          />
                        </div>
                        <Button type="submit">Submit Project</Button>
                      </form>
                    </div>
                  </TabsContent>
                  <TabsContent value="ongoing">
                    <div className="space-y-4 mt-4">
                      {projects.filter(project => project.status !== "Completed").map((project) => (
                        <Card key={project.id}>
                          <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p><strong>Due Date:</strong> {project.dueDate}</p>
                            <p><strong>Status:</strong> {project.status}</p>
                            <div className="mt-4">
                              <h4 className="font-semibold mb-2">Updates</h4>
                              {project.updates.map((update, index) => (
                                <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                                  <p className="text-sm text-gray-600">{update.date}</p>
                                  <p>{update.comment}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <form onSubmit={handleProjectUpdate} className="w-full">
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={newUpdate}
                                  onChange={(e) => setNewUpdate(e.target.value)}
                                  placeholder="Add an update..."
                                />
                                <Button type="submit" onClick={() => setSelectedProject(project)}>Update</Button>
                              </div>
                            </form>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="completed">
                    <div className="space-y-4 mt-4">
                      {projects.filter(project => project.status === "Completed").map((project) => (
                        <Card key={project.id}>
                          <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p><strong>Due Date:</strong> {project.dueDate}</p>
                            <p><strong>Status:</strong> {project.status}</p>
                            <div className="mt-4">
                              <h4 className="font-semibold mb-2">Updates</h4>
                              {project.updates.map((update, index) => (
                                <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                                  <p className="text-sm text-gray-600">{update.date}</p>
                                  <p>{update.comment}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </TabsContent>
            <TabsContent value="stats">
              <CardHeader>
                <CardTitle>Attendance Statistics</CardTitle>
                <CardDescription>Your overall attendance performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Attendance</span>
                    <span className="text-sm font-medium">{attendancePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={attendancePercentage} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                      <Book className="mx-auto h-6 w-6 text-blue-500" />
                      <p className="mt-2 font-semibold">{studentData.totalClasses}</p>
                      <p className="text-sm text-gray-500">Total Classes</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                      <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                      <p className="mt-2 font-semibold">{studentData.attendedClasses}</p>
                      <p className="text-sm text-gray-500">Classes Attended</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mark Today's Attendance</CardTitle>
            <CardDescription>
              {format(currentTime, 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-lg font-semibold">Current Time</p>
                  <p className="text-2xl">{format(currentTime, 'HH:mm:ss')}</p>
                </div>
              </div>
              {isAttendanceWindowOpen ? (
                attendanceMarked ? (
                  <div className="text-green-600 font-semibold flex items-center">
                    <CheckCircle className="mr-2" />
                    Attendance Marked
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Button onClick={markAttendance} size="lg" className="px-8 mb-2">
                      Mark Attendance
                    </Button>
                    <p className="text-sm text-gray-500">
                      Time left: {timeLeftInMinutes} minute{timeLeftInMinutes !== 1 ? 's' : ''}
                    </p>
                  </div>
                )
              ) : (
                <div className="text-red-600 font-semibold flex items-center">
                  <AlertTriangle className="mr-2" />
                  Attendance Window Closed
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Attendance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                The attendance marking window is open for 10 minutes each day. Please ensure you mark your attendance within this timeframe.
                If you miss the window, please contact your administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}