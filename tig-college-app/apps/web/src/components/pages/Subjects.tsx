import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const subjects = [
  {
    name: "Mathematics",
    code: "MATH101",
    credits: 4,
    instructor: "Dr. Smith",
    completion: 80,
    grade: "A",
    attendance: 87.5,
  },
  {
    name: "Computer Organization",
    code: "CS201",
    credits: 3,
    instructor: "Prof. Johnson",
    completion: 65,
    grade: "B+",
    attendance: 93.8,
  },
  {
    name: "Data Structures & Algorithms",
    code: "CS301",
    credits: 4,
    instructor: "Dr. Williams",
    completion: 70,
    grade: "A-",
    attendance: 78.1,
  },
  {
    name: "Analog & Digital Electronics",
    code: "ECE101",
    credits: 3,
    instructor: "Prof. Brown",
    completion: 50,
    grade: "B",
    attendance: 90.6,
  },
  {
    name: "Economics",
    code: "ECO101",
    credits: 2,
    instructor: "Dr. Davis",
    completion: 60,
    grade: "B+",
    attendance: 81.3,
  },
]

export default function SubjectsPage() {
  return (
    <DashboardLayout title="Subjects">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Card key={index} className="card-shadow hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <i className="fa-solid fa-book" />
                  {subject.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {subject.code} • {subject.credits} Credits
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Instructor</p>
                  <p className="text-gray-800">{subject.instructor}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Completion</span>
                    <span className="text-sm font-semibold text-primary">{subject.completion}%</span>
                  </div>
                  <Progress value={subject.completion} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-semibold text-primary">{subject.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="font-semibold text-green-600">{subject.attendance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject Summary */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-chart-line" />
              Academic Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{subjects.length}</p>
                <p className="text-sm text-gray-600">Total Subjects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {subjects.reduce((acc, subject) => acc + subject.credits, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {(subjects.reduce((acc, subject) => acc + subject.completion, 0) / subjects.length).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Avg Completion</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {(subjects.reduce((acc, subject) => acc + subject.attendance, 0) / subjects.length).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}