import type React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 mt-0">
        <Header title="Techno India Group" />
  

  
        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}