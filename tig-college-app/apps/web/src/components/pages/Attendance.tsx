""

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const attendanceBySubject = [
  { subject: "Mathematics", present: 28, absent: 4, percentage: 87.5 },
  { subject: "Computer Science", present: 30, absent: 2, percentage: 93.8 },
  { subject: "Physics", present: 25, absent: 7, percentage: 78.1 },
  { subject: "English", present: 29, absent: 3, percentage: 90.6 },
  { subject: "Economics", present: 26, absent: 6, percentage: 81.3 },
]

const overallAttendance = [
  { name: "Present", value: 85, color: "rgb(230, 0, 0)" },
  { name: "Absent", value: 15, color: "#ff6b6b" },
]

export default function AttendancePage() {
  return (
    <DashboardLayout title="My Attendance">
      <div className="space-y-6">
        {/* Overall Attendance */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-chart-pie" />
              Overall Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={overallAttendance}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {overallAttendance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-chart-bar" />
              Subject-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={attendanceBySubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="white" stroke="rgb(230, 0, 0)" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Details Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-table" />
              Detailed Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold">Subject</th>
                    <th className="text-left p-3 font-semibold">Present</th>
                    <th className="text-left p-3 font-semibold">Absent</th>
                    <th className="text-left p-3 font-semibold">Percentage</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceBySubject.map((subject, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{subject.subject}</td>
                      <td className="p-3 text-green-600">{subject.present}</td>
                      <td className="p-3 text-red-600">{subject.absent}</td>
                      <td className="p-3 font-semibold">{subject.percentage}%</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subject.percentage >= 85
                              ? "bg-green-100 text-green-800"
                              : subject.percentage >= 75
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.percentage >= 85 ? "Good" : subject.percentage >= 75 ? "Average" : "Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}