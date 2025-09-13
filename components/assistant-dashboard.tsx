"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Users, 
  FileText, 
  CalendarClock, 
  BarChart3, 
  Settings, 
  MessageCircle, 
  CheckSquare,
  Bell,
  User,
  Phone,
  Plus,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Search,
  Activity,
  Filter,
  ChevronDown,
  UserCheck,
  Calendar as CalendarIcon,
  Camera,
  Receipt,
  CreditCard,
  Shield,
  ClipboardList,
  Stethoscope,
  FileCheck,
  UserPlus,
  PhoneCall,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react"

interface AssistantDashboardProps {
  assistantData?: any
  isLoading?: boolean
  error?: string
}

// Tab configuration for assistant dashboard
const assistantTabs = [
  { id: "today", label: "Home", icon: Calendar },
  { id: "checkin", label: "Patient Check-In", icon: UserPlus },
  { id: "appointments", label: "Appointment Manager", icon: CalendarClock },
  { id: "insurance", label: "Insurance & Billing", icon: CreditCard },
  { id: "coordination", label: "Treatment Coordination", icon: Stethoscope },
  { id: "messages", label: "Patient Communications", icon: MessageCircle },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "tasks", label: "Daily Tasks", icon: CheckSquare },
]

export function AssistantDashboard({ assistantData, isLoading = false, error }: AssistantDashboardProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [showNotifications, setShowNotifications] = useState(false)
  const [checkinFilter, setCheckinFilter] = useState("scheduled")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with real data
  const todayStats = {
    checkedInPatients: 12,
    waitingPatients: 3,
    completedAppointments: 8,
    pendingInsurance: 4,
    completionRate: 75
  }

  const notifications = [
    {
      id: 1,
      type: "urgent",
      title: "Mrs. Johnson's insurance pre-authorization expired",
      time: "10 min ago"
    },
    {
      id: 2,
      type: "info",
      title: "Dr. Smith requesting patient files for 2:00 PM appointment",
      time: "25 min ago"
    },
    {
      id: 3,
      type: "success",
      title: "Payment processed for John Doe - $450",
      time: "1 hour ago"
    }
  ]

  const todayAppointments = [
    {
      time: "09:00 AM",
      patient: "Sarah Johnson",
      treatment: "Routine Cleaning",
      status: "checked-in",
      insurance: "verified",
      phone: "(555) 234-5678"
    },
    {
      time: "10:30 AM",
      patient: "Michael Brown",
      treatment: "Root Canal Consultation",
      status: "waiting",
      insurance: "pending",
      phone: "(555) 345-6789"
    },
    {
      time: "12:00 PM",
      patient: "Emily Davis",
      treatment: "Crown Fitting",
      status: "scheduled",
      insurance: "verified",
      phone: "(555) 456-7890"
    },
    {
      time: "02:00 PM",
      patient: "Robert Wilson",
      treatment: "Filling Replacement",
      status: "scheduled",
      insurance: "needs-verification",
      phone: "(555) 567-8901"
    }
  ]

  const dailyTasks = [
    { id: 1, task: "Verify insurance for 2:00 PM appointment", priority: "high", completed: false },
    { id: 2, task: "Call patient to confirm tomorrow's appointment", priority: "medium", completed: false },
    { id: 3, task: "Process payment for completed treatments", priority: "high", completed: true },
    { id: 4, task: "Update patient contact information", priority: "low", completed: false },
    { id: 5, task: "Prepare treatment rooms for afternoon appointments", priority: "medium", completed: true }
  ]

  const insuranceQueue = [
    {
      patient: "John Smith",
      procedure: "Root Canal",
      insurance: "Delta Dental",
      status: "pending-authorization",
      amount: "$1,200",
      submitted: "2 days ago"
    },
    {
      patient: "Mary Johnson",
      procedure: "Crown",
      insurance: "Aetna",
      status: "approved",
      amount: "$950",
      submitted: "1 day ago"
    },
    {
      patient: "Bob Wilson",
      procedure: "Deep Cleaning",
      insurance: "MetLife",
      status: "denied",
      amount: "$300",
      submitted: "3 days ago"
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h1 className="text-xl font-bold text-primary">ENDOFLOW</h1>
              </div>
              <span className="text-muted-foreground text-sm">Assistant Portal</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Doctor
              </Button>
              
              <Button
                size="sm"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Quick Check-In
              </Button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-accent/10 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notifications.length}
                  </Badge>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-96 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Mark all read
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-accent/5 rounded-lg cursor-pointer border-b border-border last:border-0">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'urgent' ? 'bg-red-500' : 
                              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-border px-6 py-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {assistantTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {activeTab === "today" && (
              <div className="p-6 space-y-6">
                {/* Page Header */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Good morning, {assistantData?.name || 'Assistant'}!
                  </h2>
                  <p className="text-muted-foreground">Saturday, September 13, 2025</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.checkedInPatients}</span>
                            <UserCheck className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Waiting</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.waitingPatients}</span>
                            <Clock className="w-5 h-5 text-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completed</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.completedAppointments}</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Insurance Pending</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.pendingInsurance}</span>
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Efficiency Rate</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.completionRate}%</span>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${todayStats.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Appointments */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <p className="text-sm text-muted-foreground">Patient appointments and status</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {todayAppointments.map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-muted-foreground min-w-20">
                                {appointment.time}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{appointment.patient}</p>
                                <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                                <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={
                                  appointment.status === 'checked-in' ? 'default' :
                                  appointment.status === 'waiting' ? 'secondary' : 'outline'
                                }
                                className={
                                  appointment.status === 'checked-in' ? 'bg-green-100 text-green-800 border-green-200' :
                                  appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }
                              >
                                {appointment.status}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  appointment.insurance === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                  appointment.insurance === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                                }
                              >
                                {appointment.insurance}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Daily Tasks */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Tasks</CardTitle>
                        <p className="text-sm text-muted-foreground">Your task checklist</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dailyTasks.map((task) => (
                          <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'border-border'}`}>
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              className="mt-1"
                              readOnly
                            />
                            <div className="flex-1">
                              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.task}
                              </p>
                              <Badge 
                                variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                                className="mt-1 text-xs"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Check-In Tab */}
            {activeTab === "checkin" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">Patient Check-In</h2>
                    <p className="text-muted-foreground">Manage patient arrivals and check-in process</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Walk-in Patient
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {todayAppointments.map((appointment, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                          <Badge 
                            className={
                              appointment.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p><Clock className="w-4 h-4 inline mr-2" />{appointment.time}</p>
                          <p><Stethoscope className="w-4 h-4 inline mr-2" />{appointment.treatment}</p>
                          <p><Phone className="w-4 h-4 inline mr-2" />{appointment.phone}</p>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Button 
                            className="w-full" 
                            variant={appointment.status === 'checked-in' ? 'outline' : 'default'}
                            disabled={appointment.status === 'checked-in'}
                          >
                            {appointment.status === 'checked-in' ? 'Checked In' : 'Check In'}
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                              <PhoneCall className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance & Billing Tab */}
            {activeTab === "insurance" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">Insurance & Billing</h2>
                    <p className="text-muted-foreground">Manage insurance verifications and billing</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Claim
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Queue</CardTitle>
                    <p className="text-sm text-muted-foreground">Pending insurance verifications and claims</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insuranceQueue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.patient}</h4>
                          <p className="text-sm text-muted-foreground">{item.procedure} - {item.insurance}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {item.submitted}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{item.amount}</span>
                          <Badge 
                            className={
                              item.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              item.status === 'denied' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {item.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other tabs placeholder */}
            {!["today", "checkin", "insurance"].includes(activeTab) && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {assistantTabs.find(tab => tab.id === activeTab)?.icon && (
                      React.createElement(assistantTabs.find(tab => tab.id === activeTab)!.icon, {
                        className: "w-8 h-8 text-muted-foreground"
                      })
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {assistantTabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                  <p className="text-muted-foreground">This section is coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}