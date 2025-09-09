""

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

const timeSlots = [
  "8:00-8:45",
  "8:45-9:30",
  "9:45-10:30",
  "10:30-11:30",
  "11:30-12:15",
  "12:15-13:00",
  "13:00-13:45",
  "14:00-14:45",
  "14:45-15:30",
  "15:30-16:15",
]

const initialTimetable = {
  Monday: {
    "8:00-8:45": "Economics",
    "8:45-9:30": "Economics",
    "9:45-10:30": "Analog & Digital Electronics",
    "10:30-11:30": "Analog & Digital Electronics",
    "11:30-12:15": "Linear Algebra",
    "12:15-13:00": "Remedial",
    "13:00-13:45": "LUNCH",
    "14:00-14:45": "Mentoring Class",
    "14:45-15:30": "Free",
    "15:30-16:15": "Free",
  },
  Tuesday: {
    "8:00-8:45": "Peer Review Seminar",
    "8:45-9:30": "Analog & Digital Electronics",
    "9:45-10:30": "Remedial",
    "10:30-11:30": "Economics",
    "11:30-12:15": "Linear Algebra",
    "12:15-13:00": "CO",
    "13:00-13:45": "LUNCH",
    "14:00-14:45": "Linear Algebra",
    "14:45-15:30": "Free",
    "15:30-16:15": "Free",
  },
  Wednesday: {
    "8:00-8:45": "Peer Review Seminar",
    "8:45-9:30": "Remedial",
    "9:45-10:30": "DSA",
    "10:30-11:30": "CO",
    "11:30-12:15": "Linear Algebra",
    "12:15-13:00": "IT Workshop (Sci Lab/Matlab Python/R)",
    "13:00-13:45": "LUNCH",
    "14:00-14:45": "Analog & Digital Electronics",
    "14:45-15:30": "Free",
    "15:30-16:15": "Free",
  },
  Thursday: {
    "8:00-8:45": "Free",
    "8:45-9:30": "ANA DIGI LAB",
    "9:45-10:30": "ANA DIGI LAB",
    "10:30-11:30": "Remedial",
    "11:30-12:15": "Free",
    "12:15-13:00": "DSA Lab",
    "13:00-13:45": "LUNCH",
    "14:00-14:45": "Free",
    "14:45-15:30": "Free",
    "15:30-16:15": "Free",
  },
  Friday: {
    "8:00-8:45": "Free",
    "8:45-9:30": "ANA DIGI LAB",
    "9:45-10:30": "ANA DIGI LAB",
    "10:30-11:30": "Remedial",
    "11:30-12:15": "Free",
    "12:15-13:00": "DSA Lab",
    "13:00-13:45": "LUNCH",
    "14:00-14:45": "Free",
    "14:45-15:30": "Free",
    "15:30-16:15": "Free",
  },
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function TimetablePage() {
  const [timetable, setTimetable] = useState(initialTimetable)
  const [editingCell, setEditingCell] = useState<{ day: string; time: string } | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleCellClick = (day: string, time: string) => {
    setEditingCell({ day, time })
    setEditValue(timetable[day as keyof typeof timetable][time] || "")
  }

  const handleSave = () => {
    if (editingCell) {
      setTimetable((prev) => ({
        ...prev,
        [editingCell.day]: {
          ...prev[editingCell.day as keyof typeof prev],
          [editingCell.time]: editValue,
        },
      }))
      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const getCellStyle = (subject: string) => {
    if (subject === "LUNCH") return "bg-orange-100 text-orange-800 font-semibold"
    if (subject === "Free") return "bg-gray-100 text-gray-500"
    if (subject.includes("LAB")) return "bg-blue-100 text-blue-800"
    if (subject === "Remedial") return "bg-green-100 text-green-800"
    return "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
  }

  const getTodayStats = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    const todaySchedule = timetable[today as keyof typeof timetable]
    if (!todaySchedule) return { total: 0, labs: 0, free: 0 }

    const subjects = Object.values(todaySchedule)
    return {
      total: subjects.filter((s) => s !== "Free" && s !== "LUNCH").length,
      labs: subjects.filter((s) => s.includes("LAB")).length,
      free: subjects.filter((s) => s === "Free").length,
    }
  }

  const stats = getTodayStats()

  return (
    <DashboardLayout title="Class Timetable">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">AIML 2C (M-506)</h2>
            <p className="text-gray-600">Weekly Class Schedule - Click any cell to edit</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-download mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-file-csv mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-print mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Interactive Timetable */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-calendar-days" />
              Interactive Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 font-bold">Time</TableHead>
                    {days.map((day) => (
                      <TableHead key={day} className="text-center font-bold min-w-32">
                        {day}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((time) => (
                    <TableRow key={time}>
                      <TableCell className="font-semibold text-sm bg-gray-50">{time}</TableCell>
                      {days.map((day) => {
                        const subject = timetable[day as keyof typeof timetable][time] || "Free"
                        const isEditing = editingCell?.day === day && editingCell?.time === time

                        return (
                          <TableCell key={`${day}-${time}`} className="p-1">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="text-xs"
                                  autoFocus
                                />
                                <div className="flex gap-1">
                                  <Button size="sm" onClick={handleSave} className="text-xs px-2 py-1">
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="text-xs px-2 py-1 bg-transparent"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-2 rounded text-xs text-center transition-colors ${getCellStyle(subject)}`}
                                onClick={() => handleCellClick(day, time)}
                              >
                                {subject}
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats and Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Classes</span>
                  <Badge variant="default">{stats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lab Sessions</span>
                  <Badge variant="secondary">{stats.labs}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Free Periods</span>
                  <Badge variant="outline">{stats.free}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Room Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Primary Room</span>
                  <span className="font-semibold">M-506</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Lab Room</span>
                  <span className="font-semibold">Lab-A2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Capacity</span>
                  <span className="font-semibold">60 students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 rounded"></div>
                  <span>Regular Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded"></div>
                  <span>Laboratory</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>Remedial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 rounded"></div>
                  <span>Lunch Break</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}