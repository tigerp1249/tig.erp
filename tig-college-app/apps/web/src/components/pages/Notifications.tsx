""

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "Class Cancelled - DSA",
    message: "Today's Data Structures & Algorithms class has been cancelled due to heavy rain. Stay safe!",
    time: "2 hours ago",
    icon: "fa-solid fa-triangle-exclamation",
    read: false,
  },
  {
    id: 2,
    type: "holiday",
    title: "Holiday Tomorrow",
    message: "Tomorrow will be a holiday due to weather conditions. All classes are suspended.",
    time: "3 hours ago",
    icon: "fa-solid fa-calendar-xmark",
    read: false,
  },
  {
    id: 3,
    type: "important",
    title: "CR Meeting Called",
    message:
      "The teacher has called the Class Representative (CR) for an important meeting regarding upcoming assignments.",
    time: "5 hours ago",
    icon: "fa-solid fa-user-tie",
    read: true,
  },
  {
    id: 4,
    type: "assignment",
    title: "New Assignment Posted",
    message: "Computer Organization assignment has been posted. Due date: 15th January 2025.",
    time: "1 day ago",
    icon: "fa-solid fa-file-lines",
    read: true,
  },
  {
    id: 5,
    type: "exam",
    title: "Mid-Semester Exam Schedule",
    message: "Mid-semester examination schedule has been released. Check your timetable for details.",
    time: "2 days ago",
    icon: "fa-solid fa-clipboard-list",
    read: true,
  },
  {
    id: 6,
    type: "general",
    title: "Library Hours Extended",
    message: "Library hours have been extended till 10 PM during examination period.",
    time: "3 days ago",
    icon: "fa-solid fa-book",
    read: true,
  },
  {
    id: 7,
    type: "event",
    title: "Technical Fest Registration",
    message: "Registration for annual technical fest 'TechnoVision 2025' is now open. Register before 20th January.",
    time: "4 days ago",
    icon: "fa-solid fa-rocket",
    read: true,
  },
  {
    id: 8,
    type: "maintenance",
    title: "Lab Maintenance",
    message: "Computer lab will be under maintenance on Saturday. All practical classes are rescheduled.",
    time: "1 week ago",
    icon: "fa-solid fa-wrench",
    read: true,
  },
]

const getNotificationStyle = (type: string, read: boolean) => {
  const baseStyle = read ? "opacity-75" : ""

  switch (type) {
    case "urgent":
      return `border-l-4 border-l-red-500 bg-red-50 ${baseStyle}`
    case "holiday":
      return `border-l-4 border-l-green-500 bg-green-50 ${baseStyle}`
    case "important":
      return `border-l-4 border-l-primary bg-primary/5 ${baseStyle}`
    case "assignment":
      return `border-l-4 border-l-blue-500 bg-blue-50 ${baseStyle}`
    case "exam":
      return `border-l-4 border-l-purple-500 bg-purple-50 ${baseStyle}`
    case "event":
      return `border-l-4 border-l-orange-500 bg-orange-50 ${baseStyle}`
    case "maintenance":
      return `border-l-4 border-l-yellow-500 bg-yellow-50 ${baseStyle}`
    default:
      return `border-l-4 border-l-gray-500 bg-gray-50 ${baseStyle}`
  }
}

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "urgent":
      return "destructive"
    case "holiday":
      return "secondary"
    case "important":
      return "default"
    default:
      return "outline"
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">All Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-check-double mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-filter mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={getNotificationStyle(notification.type, notification.read)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <i className={`${notification.icon} text-gray-600`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                        {notification.type}
                      </Badge>
                      {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>

                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        <i className="fa-solid fa-clock mr-1" />
                        {notification.time}
                      </span>

                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" className="text-xs">
                            Mark as read
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-xs">
                          <i className="fa-solid fa-trash" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">
            <i className="fa-solid fa-chevron-down mr-2" />
            Load More Notifications
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}