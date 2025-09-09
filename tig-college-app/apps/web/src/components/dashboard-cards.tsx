""

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Chart data matching the original HTML
const attendanceData = [
  { name: "Present", value: 85, color: "#e60000" },
  { name: "Absent", value: 15, color: "#ff6b6b" },
]

const marksData = [
  { subject: "Math", marks: 78 },
  { subject: "Science", marks: 92 },
  { subject: "English", marks: 85 },
  { subject: "CS", marks: 88 },
]

const subjectsData = [
  { name: "Math", value: 25, color: "#e60000" },
  { name: "Science", value: 25, color: "#e53935" },
  { name: "English", value: 25, color: "#ef5350" },
  { name: "CS", value: 25, color: "#ffcdd2" },
]

const resultsData = [
  { semester: "Sem 1", cgpa: 7.2 },
  { semester: "Sem 2", cgpa: 7.8 },
  { semester: "Sem 3", cgpa: 8.1 },
  { semester: "Sem 4", cgpa: 8.4 },
]

const completionData = [
  { subject: "Maths", completion: 80 },
  { subject: "Computer Organization", completion: 65 },
  { subject: "DSA", completion: 70 },
  { subject: "Analog & Digital", completion: 50 },
  { subject: "Economics", completion: 60 },
]

export function DashboardCards() {
  return (
    <>
      {/* Main Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Attendance Card */}
        <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <i className="fa-solid fa-clipboard-user" />
              Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={attendanceData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marks Card */}
        <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <i className="fa-solid fa-pen" />
              Marks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="marks" fill="#e60000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subjects Card */}
        <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <i className="fa-solid fa-book" />
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={subjectsData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                  {subjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="card-shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <i className="fa-solid fa-graduation-cap" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={resultsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[6, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cgpa"
                  stroke="#e60000"
                  strokeWidth={3}
                  dot={{ fill: "#e60000", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Completion Chart */}
      <Card className="card-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-primary flex items-center justify-center gap-2">
            <i className="fa-solid fa-chart-bar" />
            Subject Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="subject" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="completion" fill="#e60000" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}