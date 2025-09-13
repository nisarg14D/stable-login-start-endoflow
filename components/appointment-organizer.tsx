"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  MoreHorizontal,
  User,
  Phone,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  date: string
  time: string
  duration: number
  treatment: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"
  notes?: string
  dentist: string
}

interface TimeSlot {
  time: string
  available: boolean
  appointmentId?: string
}

export function AppointmentOrganizer() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false)

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientId: "p1",
      patientName: "John Smith",
      patientPhone: "+1 (555) 123-4567",
      date: "2024-01-15",
      time: "09:00",
      duration: 60,
      treatment: "Routine Cleaning",
      status: "confirmed",
      dentist: "Dr. Sarah Wilson",
      notes: "First visit, gentle approach needed"
    },
    {
      id: "2",
      patientId: "p2",
      patientName: "Sarah Johnson",
      patientPhone: "+1 (555) 234-5678",
      date: "2024-01-15",
      time: "10:30",
      duration: 90,
      treatment: "Root Canal - Session 2",
      status: "confirmed",
      dentist: "Dr. Sarah Wilson"
    },
    {
      id: "3",
      patientId: "p3",
      patientName: "Michael Brown",
      patientPhone: "+1 (555) 345-6789",
      date: "2024-01-15",
      time: "14:00",
      duration: 45,
      treatment: "Crown Fitting",
      status: "scheduled",
      dentist: "Dr. Sarah Wilson"
    },
    {
      id: "4",
      patientId: "p4",
      patientName: "Emily Davis",
      patientPhone: "+1 (555) 456-7890",
      date: "2024-01-16",
      time: "09:30",
      duration: 30,
      treatment: "Consultation",
      status: "scheduled",
      dentist: "Dr. Sarah Wilson"
    }
  ])

  // Generate time slots for a day
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startTime = 9 // 9 AM
    const endTime = 17 // 5 PM
    const slotDuration = 30 // 30 minutes

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const dateString = date.toISOString().split('T')[0]
        
        const appointment = appointments.find(apt => 
          apt.date === dateString && apt.time === timeString
        )
        
        slots.push({
          time: timeString,
          available: !appointment,
          appointmentId: appointment?.id
        })
      }
    }
    
    return slots
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "no-show":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0]
    return apt.date === today
  })

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0]
    return apt.date > today
  }).slice(0, 5)

  const timeSlots = generateTimeSlots(selectedDate)

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Organizer</h2>
          <p className="text-muted-foreground">Manage your clinic schedule and appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewAppointment(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() - 1)
                setCurrentDate(newDate)
                setSelectedDate(newDate)
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium min-w-48 text-center">
              {formatDate(currentDate)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() + 1)
                setCurrentDate(newDate)
                setSelectedDate(newDate)
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {["day", "week", "month"].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(mode as "day" | "week" | "month")}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Today's Schedule & Time Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule ({todayAppointments.length} appointments)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowAppointmentDetails(true)
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-muted-foreground min-w-16">
                        {appointment.time}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{appointment.duration}min</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Time Slots View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available Time Slots - {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const appointment = slot.appointmentId ? 
                    appointments.find(apt => apt.id === slot.appointmentId) : null
                  
                  return (
                    <div
                      key={slot.time}
                      className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                        slot.available
                          ? "border-green-200 bg-green-50 hover:bg-green-100 text-green-800"
                          : "border-blue-200 bg-blue-50 text-blue-800"
                      }`}
                      onClick={() => {
                        if (slot.available) {
                          setShowNewAppointment(true)
                        } else if (appointment) {
                          setSelectedAppointment(appointment)
                          setShowAppointmentDetails(true)
                        }
                      }}
                    >
                      <div className="text-sm font-medium">{slot.time}</div>
                      {appointment && (
                        <div className="text-xs mt-1 truncate">{appointment.patientName}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Upcoming Appointments & Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayAppointments.length}</div>
                  <div className="text-xs text-muted-foreground">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {todayAppointments.filter(apt => apt.status === "completed").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {todayAppointments.filter(apt => apt.status === "confirmed").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {timeSlots.filter(slot => slot.available).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming appointments
                </p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowAppointmentDetails(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{appointment.patientName}</p>
                        <p className="text-xs text-muted-foreground">{appointment.treatment}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                View and manage appointment information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Patient</Label>
                  <p className="text-sm">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedAppointment.patientPhone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm">{selectedAppointment.time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{selectedAppointment.duration} minutes</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Treatment</Label>
                <p className="text-sm">{selectedAppointment.treatment}</p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Patient
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  // Handle cancellation
                  setShowAppointmentDetails(false)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Input id="patient" placeholder="Search and select patient..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
            <div>
              <Label htmlFor="treatment">Treatment</Label>
              <Input id="treatment" placeholder="Enter treatment type..." />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <select className="w-full border border-border rounded-lg px-3 py-2">
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input id="notes" placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAppointment(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewAppointment(false)}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}