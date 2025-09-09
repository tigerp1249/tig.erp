import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* Profile Header with Photo and Welcome */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src="/images/boy-image.jpg"
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-primary object-cover shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome! <span className="text-primary">Aman</span>
              </h2>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <Input defaultValue="Aman Jha" className="bg-gray-50 border-gray-300 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <Input
                    defaultValue="Computer Science and Engineering"
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <Input defaultValue="+91 7439623735" className="bg-gray-50 border-gray-300 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">University Roll</label>
                  <Input defaultValue="10930824211" className="bg-gray-50 border-gray-300 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Batch</label>
                  <Input defaultValue="2024-2028" className="bg-gray-50 border-gray-300 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">College</label>
                  <Input
                    defaultValue="Netaji Subhash Engineering College"
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-6 py-2">
                Change Password
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-6 py-2">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}