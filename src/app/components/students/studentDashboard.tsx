"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarDays, User, CheckCircle, Book, BarChart2, Clock, AlertTriangle, Upload, MessageSquare, ChevronLeft, ChevronRight, Flag } from "lucide-react"
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
import axios from "axios"
import { saveNewProject, showAttendence, showFlaggedUserDetail, showFlaggedUserDetailStudent, showUserDetail } from "@/lib/action"
import { signOut, useSession } from "next-auth/react"


interface userFlagCount {
  flagCount : number | null
}

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
  const [attendanceData, setAttendanceData] = useState<{ date: string; status: string }[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [userDetail, setUserDetail] = useState<{ Name: string  , studentNo : number , _id : string}>({
    Name: "", studentNo : 0 , _id : ""
  })
  const [windowOpen, setWindowOpen] = useState<boolean | null>(null);
  const [fetchExistingFlag, setfetchExistingFlag] = useState<number | null>(0)
  
  const {data : session} = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // console.log(session,"wwedwedd")

  useEffect(() => {
    setIsMounted(true) 
  }, [])

  useEffect(() => {
    if (!isMounted) return; 
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      if (now >= attendanceWindowEnd) {
        setIsAttendanceWindowOpen(false)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [attendanceWindowEnd , isMounted])

  
  const markAttendance = useCallback( async () => {
    
    await axios.post("/api/mark-attendance")
    .then((data) => {
      // console.log(data)
    })
    .catch((err) => console.log(err))
    setAttendanceMarked(true)
    
  },[attendanceMarked])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/checkStatusAttendance'); // Adjust the API route as necessary
        const data = await response.json();

        if (response.status === 200) {
          setWindowOpen(true);
        } else {
          setWindowOpen(false);
          console.error('Failed to fetch status:', data.error);
        }
      } catch (error) {
        console.error('Error fetching attendance status:', error);
      }
    };

    // Poll every second
    const intervalId = setInterval(fetchStatus, 10000000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
      const getUserDetails = async () => {
        if (session?.user.studentNo) {
          const detail = await showUserDetail({ studentNo: session.user.studentNo });
          // console.log(detail);
          setUserDetail({
            Name : detail.userDetail?.Name || "",
            studentNo : detail.userDetail?.studentNo || 0,
            _id : detail.userDetail._id
          });
          // console.log(userDetail,"harsh")
        }
      }
  
      getUserDetails();
    },[])


  useEffect(() => {
    const fetchAttendance = async () => {
      const data = await showAttendence();
      if (Array.isArray(data)) {
        setAttendanceData(prevData => {
          const newData = data.map(item => ({
            date: item.date,
            status: item.status
          }));
          const uniqueData = Array.from(new Set([...prevData, ...newData].map(item => item.date)))
            .map(date => {
              return [...prevData, ...newData].find(item => item.date === date);
            })
            .filter((item): item is { date: string; status: string } => item !== undefined);
          return uniqueData;
        });
      } else {
        console.error("Invalid data format", data);
      }
    };

    fetchAttendance();
  },[])

  const attendancePercentage = (studentData.attendedClasses / studentData.totalClasses) * 100
  // const timeLeftInMinutes = Math.max(0, differenceInMinutes(attendanceWindowEnd, currentTime))

  
  const handleProjectSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(isSubmitted)
  };
  
  useEffect(() => {
    if (isSubmitted) {
      const submitProject = async () => {

        const task = await saveNewProject(newProject.name , newProject.description , newProject.dueDate)
        // console.log(task);
        setIsSubmitted(false); 
      } 
      submitProject();
    }
  }, [isSubmitted]);


  // const handleProjectSubmit = (e:any) => {
  //   e.preventDefault()
  //   // setProjects([...projects, { ...newProject, id: projects.length + 1, status: "Not Started", updates: [] }])
  //   // setNewProject({ name: "", description: "", dueDate: "" })


  // }

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const showFlaguser = async () => {
      // console.log(userDetail._id,"kakak")
      const user = await showFlaggedUserDetailStudent(session?.user.studentNo) as userFlagCount | null;
          // console.log(user[0]?.flagCount),"kjhkkn";
          setfetchExistingFlag(user?.flagCount ?? 0)
    }
    showFlaguser();
  },[])
  

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        BDCOE Student Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={userDetail.Name}
                />
                <AvatarFallback>
                  {userDetail.Name.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{userDetail.Name}</h2>
                {/* <p className="text-gray-500">{studentData.id}</p> */}
                <p className="text-gray-500">{userDetail.studentNo}</p>
                <p className="text-gray-500">2nd year</p>
                {/* <p className="text-gray-500">{studentData.email}</p> */}
              </div>
            </div>
          </CardContent>
          <Card className="w-1/2 mb-7 mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Flag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Flag className="w-6 h-6 text-yellow-500" />
              <span className="text-3xl font-bold">{fetchExistingFlag}</span>
          </div>
          
        </div>
      </CardContent>
    </Card>
          <CardFooter className="flex justify-center gap-4">
            <EditProfilePopup
              studentData={userDetail}
              onSave={handleProfileUpdate}
            />
            <Button className="bg-red-500 hover:bg-red-600" onClick={() => signOut({ callbackUrl: '/signin', redirect:true })}>Signout</Button>
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
                <CardDescription>
                  Your recent attendance history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRecords.map((day, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white rounded-lg shadow"
                    >
                      <span className="font-medium">
                        {formatDate(day.date)}
                      </span>
                      <Badge
                        variant={
                          day.status === "present" ? "default" : "destructive"
                        }
                      >
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
                      setRecordsPerPage(Number(value));
                      setCurrentPage(1);
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
              <div className="relative">
                {/* Overlay Screen for Closed Message */}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white p-8 w-64 md:w-full rounded-lg shadow-lg max-w-md text-center transform transition-transform duration-300 scale-105 hover:scale-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500 mb-4 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01M4 12h16M4 12a9.963 9.963 0 00.854-4.636C5.052 5.516 8.417 2 12 2s6.948 3.516 7.146 5.364A9.963 9.963 0 0016 12h-4z"
                      />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Section Unavailable
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We're sorry, but this section is currently closed. Please
                      check back later.
                    </p>
                    <a
                      href="https://bdcoe.co.in/"
                      target="_blank"
                      className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      onClick={() => console.log("More Information")}
                    >
                      More Information
                    </a>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Manage your projects and track progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="new" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="new">New Project</TabsTrigger>
                      <TabsTrigger value="ongoing">
                        Ongoing Projects
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed Projects
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">
                      <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <h3 className="font-semibold text-lg mb-4">
                          Submit New Project
                        </h3>
                        <form
                          onSubmit={handleProjectSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                              id="projectName"
                              value={newProject.name}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="projectDescription">
                              Description
                            </Label>
                            <Textarea
                              id="projectDescription"
                              value={newProject.description}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  description: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="projectDueDate">Due Date</Label>
                            <Input
                              id="projectDueDate"
                              type="date"
                              value={newProject.dueDate}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  dueDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <Button type="submit">Submit Project</Button>
                        </form>
                      </div>
                    </TabsContent>
                    <TabsContent value="ongoing">
                      <div className="space-y-4 mt-4">
                        {projects
                          .filter((project) => project.status !== "Completed")
                          .map((project) => (
                            <Card key={project.id}>
                              <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>
                                  {project.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p>
                                  <strong>Due Date:</strong> {project.dueDate}
                                </p>
                                <p>
                                  <strong>Status:</strong> {project.status}
                                </p>
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2">
                                    Updates
                                  </h4>
                                  {project.updates.map((update, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-100 p-2 rounded mb-2"
                                    >
                                      <p className="text-sm text-gray-600">
                                        {update.date}
                                      </p>
                                      <p>{update.comment}</p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter>
                                <form
                                  onSubmit={handleProjectUpdate}
                                  className="w-full"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      value={newUpdate}
                                      onChange={(e) =>
                                        setNewUpdate(e.target.value)
                                      }
                                      placeholder="Add an update..."
                                    />
                                    <Button
                                      type="submit"
                                      onClick={() =>
                                        setSelectedProject(project)
                                      }
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </form>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="completed">
                      <div className="space-y-4 mt-4">
                        {projects
                          .filter((project) => project.status === "Completed")
                          .map((project) => (
                            <Card key={project.id}>
                              <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>
                                  {project.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p>
                                  <strong>Due Date:</strong> {project.dueDate}
                                </p>
                                <p>
                                  <strong>Status:</strong> {project.status}
                                </p>
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2">
                                    Updates
                                  </h4>
                                  {project.updates.map((update, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-100 p-2 rounded mb-2"
                                    >
                                      <p className="text-sm text-gray-600">
                                        {update.date}
                                      </p>
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
              </div>
            </TabsContent>
            <TabsContent value="stats">
              <div className="relative">

              
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white p-8 w-72 md:w-full rounded-lg shadow-lg max-w-md text-center transform transition-transform duration-300 scale-105 hover:scale-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500 mb-4 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01M4 12h16M4 12a9.963 9.963 0 00.854-4.636C5.052 5.516 8.417 2 12 2s6.948 3.516 7.146 5.364A9.963 9.963 0 0016 12h-4z"
                      />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Section Unavailable
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We're sorry, but this section is currently closed. Please
                      check back later.
                    </p>
                    <a
                      href="https://bdcoe.co.in/"
                      target="_blank"
                      className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      onClick={() => console.log("More Information")}
                    >
                      More Information
                    </a>
                  </div>
                </div>
              <CardHeader>
                <CardTitle>Attendance Statistics</CardTitle>
                <CardDescription>
                  Your overall attendance performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Overall Attendance
                    </span>
                    <span className="text-sm font-medium">
                      {attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={attendancePercentage} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                      <Book className="mx-auto h-6 w-6 text-blue-500" />
                      <p className="mt-2 font-semibold">
                        {studentData.totalClasses}
                      </p>
                      <p className="text-sm text-gray-500">Total Classes</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                      <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                      <p className="mt-2 font-semibold">
                        {studentData.attendedClasses}
                      </p>
                      <p className="text-sm text-gray-500">Classes Attended</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mark Today's Attendance</CardTitle>
            <CardDescription>
              {isMounted && currentTime
                ? new Date(currentTime).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-lg font-semibold">Current Time</p>
                  {isMounted ? (
                    <p className="text-2xl">
                      {format(currentTime, "HH:mm:ss")}
                    </p>
                  ) : (
                    <p>Loading...</p>
                  )}
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
                    {windowOpen ? (
                      <Button
                        onClick={markAttendance}
                        // disabled={!isPresent}
                        size="lg"
                        className="px-8 mb-2"
                      >
                        Mark Attendance
                      </Button>
                    ) : (
                      <div className="text-red-600 font-semibold flex items-center">
                        <AlertTriangle className="mr-2" />
                        Attendance Window Closed
                      </div>
                    )}
                    {/* <p className="text-sm text-gray-500">
                      Time left: {timeLeftInMinutes} minute
                      {timeLeftInMinutes !== 1 ? "s" : ""}
                    </p> */}
                  </div>
                )
              ) : null}
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
                The attendance marking window is open for 10 minutes each day.
                Please ensure you mark your attendance within this timeframe. If
                you miss the window, please contact your administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
