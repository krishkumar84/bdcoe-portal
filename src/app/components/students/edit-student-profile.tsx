import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { students } from "@/lib/constants"

interface StudentData {
  Name: string
  studentNo : number
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


  const filterStudent = students.filter((item) => item.studentNo == studentData.studentNo.toString());

  const email = filterStudent[0]?.email;

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
              disabled
                id="name"
                value={studentData.Name}
                // onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                id="email"
                type="email"
                value={email}
                // onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="year">Year</Label>
              <Input
                disabled
                id="email"
                type="email"
                value={"2nd Year"}
                // onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                required
              />
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