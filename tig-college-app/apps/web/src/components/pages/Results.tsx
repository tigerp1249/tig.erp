""

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Dummy data based on the provided grade card
const semesterResults = [
  { code: "BSCH201", subject: "Chemistry-I (Gr-A)", grade: "C", points: 6, credit: 4.0, creditPoints: 24 },
  { code: "BSM201", subject: "Mathematics -IIA", grade: "E", points: 9, credit: 4.0, creditPoints: 36 },
  { code: "ESCS201", subject: "Programming for Problem Solving", grade: "E", points: 9, credit: 3.0, creditPoints: 27 },
  { code: "HMHU201", subject: "English", grade: "A", points: 8, credit: 2.0, creditPoints: 16 },
  { code: "BSCH291", subject: "Chemistry-I Laboratory (Gr-A)", grade: "O", points: 10, credit: 1.5, creditPoints: 15 },
  {
    code: "ESCS291",
    subject: "Programming for Problem Solving",
    grade: "O",
    points: 10,
    credit: 2.0,
    creditPoints: 20,
  },
  {
    code: "ESME291",
    subject: "Engineering Graphics & Design(Gr-A)",
    grade: "E",
    points: 9,
    credit: 3.0,
    creditPoints: 27,
  },
  { code: "HMHU291", subject: "Language Laboratory", grade: "O", points: 10, credit: 1.0, creditPoints: 10 },
]

const caMarks = [
  { subject: "Data Structures & Algorithms", ca1: 18, ca2: 22, ca3: 20, total: 60, outOf: 75 },
  { subject: "Computer Organization", ca1: 16, ca2: 19, ca3: 18, total: 53, outOf: 75 },
  { subject: "Mathematics-III", ca1: 20, ca2: 17, ca3: 21, total: 58, outOf: 75 },
  { subject: "Digital Electronics", ca1: 19, ca2: 20, ca3: 19, total: 58, outOf: 75 },
  { subject: "Economics", ca1: 17, ca2: 18, ca3: 20, total: 55, outOf: 75 },
]

const gradeDistribution = [
  { grade: "O", count: 3, color: "#22c55e" },
  { grade: "E", count: 3, color: "#3b82f6" },
  { grade: "A", count: 1, color: "#f59e0b" },
  { grade: "C", count: 1, color: "#ef4444" },
]

const performanceData = caMarks.map((item) => ({
  subject: item.subject.split(" ")[0],
  percentage: Math.round((item.total / item.outOf) * 100),
}))

export default function ResultsPage() {
  const totalCredits = semesterResults.reduce((sum, item) => sum + item.credit, 0)
  const totalCreditPoints = semesterResults.reduce((sum, item) => sum + item.creditPoints, 0)
  const sgpa = (totalCreditPoints / totalCredits).toFixed(2)

  return (
    <DashboardLayout title="My Results">
      <div className="space-y-6">
        {/* CGPA Highlight Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Current SGPA</CardTitle>
            <div className="text-4xl font-bold text-primary mt-2">{sgpa}</div>
            <CardDescription>Second Semester 2024-25 • Result: PASS</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Semester Results Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Semester Results</CardTitle>
                <CardDescription>Second Semester Examination 2024-25</CardDescription>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold">Subject Code</th>
                      <th className="text-left p-3 font-semibold">Subject</th>
                      <th className="text-center p-3 font-semibold">Grade</th>
                      <th className="text-center p-3 font-semibold">Points</th>
                      <th className="text-center p-3 font-semibold">Credit</th>
                      <th className="text-center p-3 font-semibold">Credit Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{result.code}</td>
                        <td className="p-3">{result.subject}</td>
                        <td className="p-3 text-center">
                          <Badge
                            variant={
                              result.grade === "O"
                                ? "default"
                                : result.grade === "E"
                                  ? "secondary"
                                  : result.grade === "A"
                                    ? "outline"
                                    : "destructive"
                            }
                            className="font-bold"
                          >
                            {result.grade}
                          </Badge>
                        </td>
                        <td className="p-3 text-center font-semibold">{result.points}</td>
                        <td className="p-3 text-center">{result.credit}</td>
                        <td className="p-3 text-center font-semibold">{result.creditPoints}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                      <td colSpan={4} className="p-3 text-right">
                        Total:
                      </td>
                      <td className="p-3 text-center">{totalCredits}</td>
                      <td className="p-3 text-center">{totalCreditPoints}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CA Marks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Continuous Assessment Marks</CardTitle>
              <CardDescription>Current Semester CA Performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-2 font-semibold">Subject</th>
                      <th className="text-center p-2 font-semibold">CA1</th>
                      <th className="text-center p-2 font-semibold">CA2</th>
                      <th className="text-center p-2 font-semibold">CA3</th>
                      <th className="text-center p-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caMarks.map((ca, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-2 text-xs">{ca.subject}</td>
                        <td className="p-2 text-center">{ca.ca1}</td>
                        <td className="p-2 text-center">{ca.ca2}</td>
                        <td className="p-2 text-center">{ca.ca3}</td>
                        <td className="p-2 text-center font-semibold">
                          {ca.total}/{ca.outOf}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>CA Performance Chart</CardTitle>
              <CardDescription>Subject-wise CA percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Distribution of grades across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}