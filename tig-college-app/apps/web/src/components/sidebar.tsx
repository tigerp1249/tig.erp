import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import Logo from "@/assets/logo-tigps.png"
const navigationItems = [
  { href: "/", icon: "fa-solid fa-table-columns", label: "Dashboard" },
  { href: "/attendance", icon: "fa-solid fa-clipboard-user", label: "My Attendance" },
  { href: "/profile", icon: "fa-solid fa-user", label: "Profile" },
  { href: "/subjects", icon: "fa-solid fa-book", label: "Subjects" },
  { href: "/results", icon: "fa-solid fa-file-lines", label: "My Results" },
  { href: "/assignments", icon: "fa-solid fa-book-open-reader", label: "Assignments" },
  { href: "/timetable", icon: "fa-solid fa-calendar-days", label: "Time Table" },
  { href: "/notifications", icon: "fa-solid fa-bell", label: "Notifications" },
]

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside
      className="bg-white w-63 h-screen fixed left-0 top-0 flex flex-col z-20 mt-4"
      style={{ boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}
    >
      {/* Logo Section */}
      <div className="logo flex justify-center py-6">
        <img
          src={Logo}
          alt="TECHNO INDIA GROUP"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-primary transition-all duration-300",
                  pathname === item.href && "bg-primary text-white font-medium",
                )}
              >
                <i className={`${item.icon} w-5 text-center`} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary transition-colors duration-300 font-medium"
        >
          <i className="fa-solid fa-sign-out-alt w-5 text-center" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  )
}