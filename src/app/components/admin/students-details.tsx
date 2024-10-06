import React from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface StudentDetailsPopupProps {
  student: {
    id: number
    name: string
    present: number
    absent: number
    total: number
    project: {
      name: string
      status: number
    }
    comments: Array<{
      id: number
      date: string
      text: string
    }>
  } | null
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailsPopup({ student, isOpen, onClose }: StudentDetailsPopupProps) {
  if (!student) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{student.name}'s Details</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-semibold">Present:</div>
            <div>{student.present}</div>
            <div className="font-semibold">Absent:</div>
            <div>{student.absent}</div>
            <div className="font-semibold">Total Classes:</div>
            <div>{student.total}</div>
            <div className="font-semibold">Attendance Rate:</div>
            <div>{((student.present / student.total) * 100).toFixed(2)}%</div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Project Status</h3>
            <div className="space-y-2">
              <div>{student.project.name}</div>
              <Progress value={student.project.status} className="w-full" />
              <div className="text-sm text-muted-foreground">
                {student.project.status}% Complete
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Comments</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {student.comments.map((comment) => (
                <div key={comment.id} className="mb-4 last:mb-0">
                  <div className="font-semibold">{comment.date}</div>
                  <div>{comment.text}</div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}