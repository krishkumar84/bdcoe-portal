import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StudentData {
  name: string
  id: string
  course: string
  email: string
  year: string
  avatar?: string
}

interface EditProfilePopupProps {
  studentData: StudentData
  onSave: (updatedData: StudentData) => void
}

export function EditProfilePopup({ studentData, onSave }: EditProfilePopupProps) {
  const [editedData, setEditedData] = useState(studentData)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedData)
    setIsOpen(false)
  }

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student Profile</DialogTitle>
          <DialogDescription>Update the student's information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={editedData.id}
                onChange={(e) => setEditedData({ ...editedData, id: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={editedData.course}
                onChange={(e) => setEditedData({ ...editedData, course: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="year">Year</Label>
              <Select
                value={editedData.year}
                onValueChange={(value) => setEditedData({ ...editedData, year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}