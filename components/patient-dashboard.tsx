"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Home, FileText, Calendar, MessageCircle, BookOpen, User, LogOut, Clock, Send, Search, Play, FileText as Article, Heart, Shield, Smile, Mail, Phone, Video, X } from "lucide-react"
import Image from "next/image"

interface PatientData {
  name: string
  email: string
  phone: string
  nextAppointment?: {
    date: string
    time: string
    doctor: string
    type: string
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    date: string
  }>
  notifications: number
  messages?: Array<{
    id: number
    sender: string
    message: string
    timestamp: string
    isFromPatient: boolean
  }>
  appointments?: {
    upcoming: Array<{
      id: number
      date: string
      time: string
      purpose: string | null
      status: string
      notes: string | null
    }>
    past: Array<{
      id: number
      date: string
      time: string
      purpose: string | null
      status: string
      notes: string | null
    }>
  }
  consultations?: Array<{
    id: number
    date: string
    chiefComplaint: string | null
    diagnosis: string | null
    treatmentPlan: string | null
    clinicalNotes: string | null
    treatments: Array<{
      id: number
      tooth_number: string | null
      treatment_type: string
      treatment_description: string | null
      status: string
      start_date: Date | null
      completion_date: Date | null
      notes: string | null
    }>
  }>
  documents?: Array<{
    id: number
    fileName: string
    fileType: string | null
    description: string | null
    uploadedBy: string | null
    createdAt: string
  }>
}

interface PatientDashboardProps {
  patientData?: PatientData
  isLoading?: boolean
  error?: string
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "file", label: "My File", icon: FileText },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "library", label: "Library", icon: BookOpen },
]

export function PatientDashboard({ patientData, isLoading = false, error }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [messageText, setMessageText] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: "",
    newTime: "",
    reason: ""
  })
  const [librarySearchTerm, setLibrarySearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    chiefComplaint: "",
    painLevel: "",
    urgency: "routine",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
  })

  // Use real messages from props or fallback to mock data
  const [messages, setMessages] = useState(patientData?.messages || [
    {
      id: 1,
      sender: "Dr. Sarah Johnson",
      message: "Welcome to ENDOFLOW! Your account has been set up successfully.",
      timestamp: new Date().toLocaleString(),
      isFromPatient: false,
    },
  ])

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Update messages when patientData changes
    if (patientData?.messages) {
      setMessages(patientData.messages)
    }
  }, [patientData?.messages])

  const handleSendMessage = async () => {
    if (!messageText.trim() || isMessageSending) return
    
    // Optimistically add message to UI
    const newMessage = {
      id: Date.now(),
      sender: "You",
      message: messageText.trim(),
      timestamp: new Date().toLocaleString(),
      isFromPatient: true,
    }
    
    setMessages(prevMessages => [...prevMessages, newMessage])
    setMessageText("")
    
    setIsMessageSending(true)
    try {
      // Import and call the server action
      const { sendMessage } = await import('@/app/(patient)/actions')
      const result = await sendMessage(messageText.trim())
      
      if (!result.success) {
        console.error("Failed to send message:", result.error)
        // Optionally remove the optimistic message on failure
        // setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Optionally remove the optimistic message on error
      // setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id))
    } finally {
      setIsMessageSending(false)
    }
  }

  const handleUrgentAssistance = async () => {
    try {
      const { sendUrgentAssistance } = await import('@/app/(patient)/actions')
      const result = await sendUrgentAssistance("Patient has requested urgent assistance")
      
      if (result.success) {
        alert("Urgent assistance request sent! Our team will contact you immediately.")
        // Stay on current tab instead of reloading
      } else {
        alert("Failed to send urgent assistance request. Please try again.")
      }
    } catch (error) {
      console.error("Error sending urgent assistance:", error)
      alert("Failed to send urgent assistance request. Please try again.")
    }
  }

  const handleSignOut = async () => {
    try {
      const { signOutPatient } = await import('@/app/(patient)/actions')
      await signOutPatient()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  const handleRescheduleSubmit = async () => {
    try {
      // Here you would call your reschedule API
      console.log("Rescheduling appointment:", { selectedAppointment, rescheduleForm })
      
      // Show success message
      alert("Reschedule request submitted! Our team will contact you to confirm the new appointment time.")
      
      // Reset form and close modal
      setRescheduleForm({ newDate: "", newTime: "", reason: "" })
      setShowRescheduleModal(false)
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
      alert("Failed to submit reschedule request. Please try again.")
    }
  }

  const handleBookingSubmit = async () => {
    // Validate required fields
    if (!bookingForm.chiefComplaint.trim() || !bookingForm.preferredDate || !bookingForm.preferredTime) {
      alert("Please fill in all required fields (Chief Complaint, Date, and Time)")
      return
    }

    try {
      // Here you would call your booking API
      console.log("Booking appointment with data:", bookingForm)
      
      // Show success message
      alert("Appointment request submitted! Our team will contact you to confirm your appointment.")
      
      // Reset form and close modal
      setBookingForm({
        chiefComplaint: "",
        painLevel: "",
        urgency: "routine",
        preferredDate: "",
        preferredTime: "",
        additionalNotes: "",
      })
      setShowBookingModal(false)
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Failed to submit appointment request. Please try again.")
    }
  }

  const painLevels = [
    { value: "1", label: "1 - Mild" },
    { value: "2", label: "2 - Mild" },
    { value: "3", label: "3 - Mild" },
    { value: "4", label: "4 - Moderate" },
    { value: "5", label: "5 - Moderate" },
    { value: "6", label: "6 - Moderate" },
    { value: "7", label: "7 - Severe" },
    { value: "8", label: "8 - Severe" },
    { value: "9", label: "9 - Severe" },
    { value: "10", label: "10 - Severe" },
  ]

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Patient Data</h3>
            <p className="text-muted-foreground">Please log in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 tracking-normal">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
              <h1 className="font-semibold text-primary text-lg">ENDOFLOW</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {patientData.name}
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1 hover:bg-accent/10 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {patientData.notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs"
                    >
                      {patientData.notifications}
                    </Badge>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-10 w-80 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="p-2">
                      {patientData.recentActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="p-3 hover:bg-accent/5 rounded-lg cursor-pointer">
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                      ))}
                      <div className="p-3 text-center">
                        <button className="text-sm text-primary hover:underline">View All Notifications</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left p-2 hover:bg-accent/5 rounded-md text-sm text-foreground flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col pb-16">
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "home" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Welcome, {patientData.name.split(" ")[0]}!
                  </h2>
                </div>

                {patientData.nextAppointment && (
                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent" />
                        Next Appointment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{patientData.nextAppointment.date}</span>
                          <span className="text-muted-foreground">at {patientData.nextAppointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Dr. {patientData.nextAppointment.doctor}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {patientData.nextAppointment.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setShowBookingModal(true)}
                  >
                    <CardContent className="p-4 text-center">
                      <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-medium text-sm">Book Appointment</h3>
                    </CardContent>
                  </Card>
                  <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setActiveTab("file")}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-medium text-sm">View Records</h3>
                    </CardContent>
                  </Card>
                </div>

                {patientData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patientData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {patientData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{patientData.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Appointments</h2>
                  <p className="text-muted-foreground text-sm">
                    View and manage your upcoming and past appointments
                  </p>
                </div>
                
                {patientData?.appointments?.upcoming && patientData.appointments.upcoming.length > 0 ? (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patientData.appointments.upcoming.map((appointment) => (
                          <Card key={appointment.id} className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{appointment.date}</h3>
                                    <p className="text-sm text-muted-foreground">at {appointment.time}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-sm">
                                    {appointment.status}
                                  </Badge>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleReschedule(appointment)}
                                    className="text-primary border-primary hover:bg-primary/10"
                                  >
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">Dr. Sarah Johnson</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{appointment.purpose || 'General checkup'}</span>
                                </div>
                                {appointment.notes && (
                                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground">
                                      <strong>Notes:</strong> {appointment.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-xl mb-2">No Upcoming Appointments</h3>
                      <p className="text-muted-foreground mb-4">
                        Schedule your next dental visit to maintain optimal oral health
                      </p>
                      <Button className="bg-primary hover:bg-primary/90">
                        Book New Appointment
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {patientData?.appointments?.past && patientData.appointments.past.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-6 h-6 text-muted-foreground" />
                        Past Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patientData.appointments.past.slice(0, 5).map((appointment) => (
                          <Card key={appointment.id} className="border-muted bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{appointment.date}</h4>
                                    <p className="text-xs text-muted-foreground">at {appointment.time}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="ml-13">
                                <p className="text-sm text-foreground">
                                  <strong>Purpose:</strong> {appointment.purpose || 'General checkup'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Reschedule Modal */}
                {showRescheduleModal && selectedAppointment && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md bg-white">
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Reschedule Appointment</CardTitle>
                          <button
                            onClick={() => setShowRescheduleModal(false)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                          <p className="text-sm font-semibold text-foreground mb-2">Current Appointment:</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {selectedAppointment.date} at {selectedAppointment.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedAppointment.purpose || 'General checkup'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Preferred Date</label>
                            <input
                              type="date"
                              value={rescheduleForm.newDate}
                              onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                              className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Preferred Time</label>
                            <select 
                              value={rescheduleForm.newTime}
                              onChange={(e) => setRescheduleForm({ ...rescheduleForm, newTime: e.target.value })}
                              className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                            >
                              <option value="">Select time</option>
                              {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Reason for Rescheduling</label>
                          <textarea
                            value={rescheduleForm.reason}
                            onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                            placeholder="Please let us know why you need to reschedule..."
                            className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                            rows={3}
                          />
                        </div>

                        <Button 
                          onClick={handleRescheduleSubmit}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                        >
                          Submit Reschedule Request
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "file" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">My Digital File</h2>
                  <p className="text-muted-foreground text-sm">
                    Complete access to your clinical record and medical history
                  </p>
                </div>
                
                {patientData?.consultations && patientData.consultations.length > 0 ? (
                  <div className="space-y-4">
                    {patientData.consultations.map((consultation) => (
                      <Card key={consultation.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold">{consultation.date}</CardTitle>
                                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Files
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {consultation.chiefComplaint && (
                              <div className="bg-muted/30 p-4 rounded-lg">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Chief Complaint</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{consultation.chiefComplaint}</p>
                              </div>
                            )}
                            
                            {consultation.diagnosis && (
                              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Clinical Diagnosis</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{consultation.diagnosis}</p>
                              </div>
                            )}
                            
                            {consultation.treatmentPlan && (
                              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Treatment Plan</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{consultation.treatmentPlan}</p>
                              </div>
                            )}
                            
                            {consultation.clinicalNotes && (
                              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Clinical Notes</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{consultation.clinicalNotes}</p>
                              </div>
                            )}
                            
                            {consultation.treatments && consultation.treatments.length > 0 && (
                              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Completed Treatments</h4>
                                <div className="space-y-3">
                                  {consultation.treatments.map((treatment) => (
                                    <div key={treatment.id} className="bg-white p-3 rounded border">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="default" className="text-xs">
                                          {treatment.treatment_type}
                                        </Badge>
                                        {treatment.tooth_number && (
                                          <Badge variant="secondary" className="text-xs">
                                            Tooth {treatment.tooth_number}
                                          </Badge>
                                        )}
                                        <Badge variant={treatment.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                          {treatment.status}
                                        </Badge>
                                      </div>
                                      {treatment.treatment_description && (
                                        <p className="text-xs text-muted-foreground mb-1">{treatment.treatment_description}</p>
                                      )}
                                      {treatment.notes && (
                                        <p className="text-xs text-muted-foreground italic">{treatment.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">No Medical Records Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your complete medical history, consultation notes, and treatment records will appear here after your visits.
                      </p>
                    </div>
                  </div>
                )}

                {patientData?.documents && patientData.documents.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Associated Files & Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {patientData.documents.map((document) => (
                          <div key={document.id} className="p-4 border border-border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{document.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {document.description || `${document.fileType} file`} • Uploaded {document.createdAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {document.fileType || 'Document'}
                              </Badge>
                              <Button variant="ghost" size="sm" className="text-xs">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Messages</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 px-3 py-2 bg-transparent"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Schedule</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 px-3 py-2 bg-transparent"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-xs">Call</span>
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleUrgentAssistance}
                  className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 py-3 mb-4"
                >
                  <Bell className="w-5 h-5" />
                  Urgent Assistance 🛎️
                </Button>

                <Card className="flex-1 flex flex-col min-h-0">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Chat with Your Care Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col min-h-0 p-0">
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto space-y-4 p-4 max-h-[400px]"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isFromPatient ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.isFromPatient
                                ? "bg-primary text-primary-foreground"
                                : message.sender === "ENDOFLOW System"
                                  ? "bg-accent/20 text-foreground border border-accent/30"
                                  : "bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">{message.sender}</span>
                              <span className="text-xs opacity-70">{message.timestamp}</span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                      {/* Invisible element to scroll to */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Sticky bottom input */}
                    <div className="border-t bg-background p-4 flex-shrink-0">
                      <div className="flex gap-2 items-end">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          disabled={isMessageSending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || isMessageSending}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isMessageSending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "library" && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Educational Library</h2>
                  <p className="text-muted-foreground text-sm">
                    Credible, personalized health information to help you understand your dental care
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={librarySearchTerm}
                    onChange={(e) => setLibrarySearchTerm(e.target.value)}
                    placeholder="Search articles, videos, and resources..."
                    className="pl-10 py-3 text-base border-2 border-border focus:border-primary rounded-lg"
                  />
                </div>

                {/* Featured Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Featured Content</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                          Video
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">Proper Brushing Techniques</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn the correct way to brush your teeth for optimal oral health. Dr. Johnson demonstrates step-by-step techniques.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">5 min read</span>
                          <Button variant="outline" size="sm">
                            Watch Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <div className="h-40 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Article className="w-12 h-12 text-white" />
                        </div>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          Article
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">Understanding Root Canal Treatment</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          A comprehensive guide to root canal procedures, what to expect, and post-treatment care instructions.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">8 min read</span>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Browse by Category */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="font-semibold mb-1">Preventive Care</h4>
                        <p className="text-xs text-muted-foreground">Daily hygiene & prevention tips</p>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="font-semibold mb-1">Treatments</h4>
                        <p className="text-xs text-muted-foreground">Procedures & recovery guides</p>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Smile className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Cosmetic Dentistry</h4>
                        <p className="text-xs text-muted-foreground">Aesthetic treatments & options</p>
                      </CardContent>
                    </Card>

                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="w-6 h-6 text-purple-500" />
                        </div>
                        <h4 className="font-semibold mb-1">Pediatric Care</h4>
                        <p className="text-xs text-muted-foreground">Children's dental health</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

              </div>
            )}

            {!["home", "messages", "appointments", "file", "library"].includes(activeTab) && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {tabs.find((tab) => tab.id === activeTab)?.icon && (
                      React.createElement(tabs.find((tab) => tab.id === activeTab)!.icon, {
                        className: "w-8 h-8 text-muted-foreground"
                      })
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                  <p className="text-muted-foreground">This section is coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <nav className="bg-card border-t border-border p-2 fixed bottom-0 left-0 right-0 z-10">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Book New Appointment</CardTitle>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Chief Complaint *</label>
                  <textarea
                    value={bookingForm.chiefComplaint}
                    onChange={(e) => setBookingForm({ ...bookingForm, chiefComplaint: e.target.value })}
                    placeholder="Describe your main concern or reason for visit..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pain Level (1-10)</label>
                  <select
                    value={bookingForm.painLevel}
                    onChange={(e) => setBookingForm({ ...bookingForm, painLevel: e.target.value })}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Select pain level</option>
                    {painLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Urgency</label>
                  <select
                    value={bookingForm.urgency}
                    onChange={(e) => setBookingForm({ ...bookingForm, urgency: e.target.value })}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent (within 24 hours)</option>
                    <option value="emergency">Emergency (ASAP)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preferred Date *</label>
                    <input
                      type="date"
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preferred Time *</label>
                    <select
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Additional Notes</label>
                  <textarea
                    value={bookingForm.additionalNotes}
                    onChange={(e) => setBookingForm({ ...bookingForm, additionalNotes: e.target.value })}
                    placeholder="Any additional information or special requests..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleBookingSubmit}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}