""

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const assignments = [
  {
    id: 1,
    subject: "Computer Science",
    title: "Data Structures Implementation",
    description: "Implement Stack, Queue, and Linked List in Python",
    dueDate: "2024-01-15",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    subject: "Mathematics",
    title: "Calculus Problem Set",
    description: "Solve integration and differentiation problems from Chapter 5",
    dueDate: "2024-01-12",
    status: "completed",
    priority: "medium",
  },
  {
    id: 3,
    subject: "Physics",
    title: "Wave Motion Lab Report",
    description: "Complete lab report on wave interference experiments",
    dueDate: "2024-01-18",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 4,
    subject: "English",
    title: "Essay on Modern Literature",
    description: "Write a 1500-word essay on contemporary authors",
    dueDate: "2024-01-20",
    status: "pending",
    priority: "low",
  },
  {
    id: 5,
    subject: "Economics",
    title: "Market Analysis Project",
    description: "Analyze current market trends and prepare presentation",
    dueDate: "2024-01-10",
    status: "overdue",
    priority: "high",
  },
  {
    id: 6,
    subject: "Computer Science",
    title: "Database Design Assignment",
    description: "Design and implement a library management system database",
    dueDate: "2024-01-25",
    status: "pending",
    priority: "medium",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AssignmentsPage() {
  const pendingAssignments = assignments.filter((a) => a.status === "pending" || a.status === "in-progress")
  const completedAssignments = assignments.filter((a) => a.status === "completed")
  const overdueAssignments = assignments.filter((a) => a.status === "overdue")

  return (
    <DashboardLayout title="My Assignments">
      <div className="space-y-6">
        {/* Assignment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary">{assignments.length}</p>
                </div>
                <i className="fa-solid fa-clipboard-list text-2xl text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingAssignments.length}</p>
                </div>
                <i className="fa-solid fa-clock text-2xl text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedAssignments.length}</p>
                </div>
                <i className="fa-solid fa-check-circle text-2xl text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueAssignments.length}</p>
                </div>
                <i className="fa-solid fa-exclamation-triangle text-2xl text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <i className="fa-solid fa-tasks" />
              All Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace("-", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority} priority</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-book" />
                          {assignment.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-calendar" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.status === "pending" && (
                        <button className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-red-700 transition-colors">
                          Start
                        </button>
                      )}
                      {assignment.status === "in-progress" && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                          Complete
                        </button>
                      )}
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}