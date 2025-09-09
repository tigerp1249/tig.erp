""

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [activeTab, setActiveTab] = useState("student")
  const [formData, setFormData] = useState({
    identifier: "",
    mobile: "",
    otp: "",
  })
  const navigate = useNavigate()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Sending OTP to: ${formData.identifier} ${formData.mobile}`)
    setIsOtpSent(true)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Verifying OTP: ${formData.otp} for ${formData.identifier} / ${formData.mobile}`)
    navigate("/") // Redirect on successful login
  }

  const getPlaceholderText = () => {
    if (activeTab === "student") {
      return "Student ID / College Gmail / Roll Number/Phone"
    }
    return "Official Email / Phone Number"
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start">
      {/* Background blur image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/university-campus.png')",
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Top-left Semi Circle */}
      <div
        className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-500 rounded-br-full z-10"
      />
      {/* Bottom-right Semi Circle */}
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-500 rounded-tl-full z-10"
      />

      {/* Logo */}
      <div className="relative z-20 mt-16 mb-8">
        <img
          src="/images/logo-tigps.png"
          alt="TECHNO INDIA GROUP"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>


          
      {/* Login Container */}
      <div className="relative z-20 w-full max-w-md px-4 flex justify-center mt-4">
        <Card className="bg-white rounded-lg shadow-2xl w-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty_staff">Faculty & Staff</TabsTrigger>
              </TabsList>

              {["student", "faculty_staff"].map((userType) => (
                <TabsContent key={userType} value={userType}>
                  {!isOtpSent ? (
                    // FORM 1: SEND OTP
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      {/* Identifier */}
                      <Input
                        type="text"
                        placeholder={getPlaceholderText()}
                        value={formData.identifier}
                        onChange={(e) =>
                          setFormData({ ...formData, identifier: e.target.value })
                        }
                        required
                        className="w-full"
                      />

                     

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Send OTP
                      </Button>
                    </form>
                  ) : (
                    // FORM 2: VERIFY OTP
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">
                          An OTP has been sent to your registered contact.
                        </p>
                      </div>

                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData({ ...formData, otp: e.target.value })
                        }
                        required
                        maxLength={6}
                        className="w-full text-center text-lg tracking-widest"
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOtpSent(false)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                          Verify & Login
                        </Button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={handleSendOtp}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </form>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}