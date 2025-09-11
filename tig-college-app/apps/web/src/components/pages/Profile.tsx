"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import boyImage from "@/assets/boy-image.jpg"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState<string[]>([])
  const [accolades, setAccolades] = useState<string[]>([])
  const [workExperience, setWorkExperience] = useState<string[]>([])

  useEffect(() => {
    // Fetch staff profile
    fetch("http://localhost:3001/api/v1/staff/5")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err))
  }, [])

  const addItem = (type: string) => {
    const item = prompt(`Enter ${type} details:`)
    if (!item) return
    if (type === "Experience") setExperience([...experience, item])
    if (type === "Accolade") setAccolades([...accolades, item])
    if (type === "Work Experience") setWorkExperience([...workExperience, item])
  }

  if (!profile) {
    return (
      <DashboardLayout title="My Profile">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    )
  }

  // Extract first name after Dr.
  const firstName = profile.Name?.replace("Dr.", "").trim().split(" ")[0]

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* Profile Header with Photo and Welcome */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={boyImage}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-primary object-cover shadow-lg"
                />
              </div>
             <h2 className="text-2xl font-semibold text-gray-800">
                 <span className="text-primary">Welcome! </span>{firstName}
              </h2>

            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <Input defaultValue={profile.Name} className="bg-gray-50 border-gray-300 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <Input
                    defaultValue={profile.StreamName}
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <Input
                    defaultValue={profile.MobileNumber}
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input
                    defaultValue={profile.ProfessionalEmail || profile.PersonalEmail}
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Designation</label>
                  <Input
                    defaultValue={profile.Designation}
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">College</label>
                  <Input
                    defaultValue={profile.CollegeName}
                    className="bg-gray-50 border-gray-300 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">PAN Number</label>
                  <Input defaultValue={profile.PANNumber || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
                  <Input defaultValue={profile.AadharNumber || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <Input defaultValue={profile.DateOfBirth || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Whatsapp Number</label>
                  <Input defaultValue={profile.WhatsappNumber || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Appointment Type</label>
                  <Input defaultValue={profile.AppointmentType || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Contract Type</label>
                  <Input defaultValue={profile.ContractType || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                  <Input defaultValue={profile.DateOfJoining || "Not Provided"} className="bg-gray-50 border-gray-300" />
                </div>
              </div>
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-6">
              {/* Experience */}
              <div className="bg-gray-50 rounded-xl p-6 border">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Experience</h2>
                  <Button onClick={() => addItem("Experience")} className="bg-blue-600 text-white bg-primary text-sm px-3 py-1">
                    + Add
                  </Button>
                </div>
                {experience.length === 0 ? (
                  <p className="text-gray-500 text-sm">No Experience Added</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Accolades */}
              <div className="bg-gray-50 rounded-xl p-6 border">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Accolades</h2>
                  <Button onClick={() => addItem("Accolade")} className="bg-green-600 text-white bg-primary text-sm px-3 py-1">
                    + Add
                  </Button>
                </div>
                {accolades.length === 0 ? (
                  <p className="text-gray-500 text-sm">No Accolades Added</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {accolades.map((acc, i) => (
                      <li key={i}>{acc}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Work Experience */}
              <div className="bg-gray-50 rounded-xl p-6 border">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Work Experience</h2>
                  <Button
                    onClick={() => addItem("Work Experience")}
                    className="bg-purple-600 text-white bg-primary text-sm px-3 py-1"
                  >
                    + Add
                  </Button>
                </div>
                {workExperience.length === 0 ? (
                  <p className="text-gray-500 text-sm">No Work Experience Added</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {workExperience.map((work, i) => (
                      <li key={i}>{work}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-6 py-2">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
