"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddPatientModal } from "@/components/add-patient-modal"
import { ConsultationForm } from "@/components/consultation-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Users, 
  FileText, 
  CalendarClock, 
  BarChart3, 
  FlaskConical, 
  Layout, 
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
  Microscope,
  StickyNote,
  Eye,
  Banknote
} from "lucide-react"

interface DentistDashboardProps {
  dentistData?: any
  isLoading?: boolean
  error?: string
}

// Tab configuration for dentist dashboard
const dentistTabs = [
  { id: "todays-view", label: "Today's View", icon: Calendar },
  { id: "patients", label: "Patients", icon: Users },
  { id: "consultation", label: "New Consultation", icon: FileText },
  { id: "appointments", label: "Appointment Organizer", icon: CalendarClock },
  { id: "clinic-analysis", label: "Clinic Analysis", icon: BarChart3 },
  { id: "research", label: "Research Projects", icon: FlaskConical },
  { id: "templates", label: "Templates", icon: Layout },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "assistant-tasks", label: "Assistant Tasks", icon: CheckSquare },
]

export function DentistDashboard({ dentistData, isLoading = false, error }: DentistDashboardProps) {
  const [activeTab, setActiveTab] = useState("todays-view")
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [patientFilter, setPatientFilter] = useState("active")
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [activePatientTab, setActivePatientTab] = useState("overview")
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [newPatientForm, setNewPatientForm] = useState({
    uhid: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    emailAddress: "",
    medicalHistory: ""
  })

  // Mock data - replace with real data
  const todayStats = {
    appointments: { total: 8, completed: 3, remaining: 5 },
    completionRate: 38,
    revenue: 2450,
    newPatients: 2
  }

  const todaySchedule = [
    { 
      time: "09:00 AM", 
      patient: "John Smith", 
      treatment: "Routine Cleaning", 
      duration: "60min", 
      status: "completed" 
    },
    { 
      time: "10:30 AM", 
      patient: "Sarah Johnson", 
      treatment: "Root Canal - Session 2", 
      duration: "90min", 
      status: "in progress" 
    },
    { 
      time: "12:00 PM", 
      patient: "Michael Brown", 
      treatment: "Crown Fitting", 
      duration: "45min", 
      status: "scheduled" 
    },
    { 
      time: "02:00 PM", 
      patient: "Emily Davis", 
      treatment: "Consultation", 
      duration: "30min", 
      status: "scheduled" 
    },
    { 
      time: "03:30 PM", 
      patient: "Robert Wilson", 
      treatment: "Filling Replacement", 
      duration: "60min", 
      status: "scheduled" 
    }
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Patient John Smith requires follow-up call regarding post-treatment care",
      time: "30 min ago"
    },
    {
      id: 2,
      type: "info",
      title: "Equipment sterilization cycle completes in 15 minutes",
      time: "45 min ago"
    },
    {
      id: 3,
      type: "success",
      title: "Lab results for crown impressions have arrived",
      time: "1 hour ago"
    }
  ]

  const quickActions = [
    { label: "Find Patient", icon: Search },
    { label: "Schedule", icon: Calendar, primary: true },
    { label: "Treatment Notes", icon: FileText },
    { label: "Billing", icon: DollarSign }
  ]

  // Mock patient data
  const mockPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      uhid: "UH001235",
      phone: "(555) 234-5678",
      lastVisit: "20/01/2024",
      nextVisit: "15/02/2024 at 2:30 PM",
      status: "active",
      isNew: false,
      medicalAlerts: ["Allergies: Latex"],
      hasCriticalInfo: true
    },
    {
      id: 2,
      name: "Michael Brown",
      uhid: "UH001236",
      phone: "(555) 345-6789",
      lastVisit: "10/12/2023",
      nextVisit: "10/02/2024 at 2:30 PM",
      status: "active",
      isNew: false,
      medicalAlerts: [],
      hasCriticalInfo: false
    },
    {
      id: 3,
      name: "Emily Davis",
      uhid: "UH001237",
      phone: "(555) 456-7890",
      lastVisit: null,
      nextVisit: null,
      status: "new",
      isNew: true,
      medicalAlerts: [],
      hasCriticalInfo: false
    },
    {
      id: 4,
      name: "John Smith",
      uhid: "UH001234",
      phone: "(555) 123-4567",
      lastVisit: "15/01/2024",
      nextVisit: "15/02/2024 at 2:30 PM",
      status: "active",
      isNew: false,
      medicalAlerts: [],
      hasCriticalInfo: false
    }
  ]

  // Filter patients based on search and filter
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
                         patient.uhid.toLowerCase().includes(patientSearchTerm.toLowerCase())
    
    const matchesFilter = patientFilter === "all" ? true :
                         patientFilter === "active" ? patient.status === "active" :
                         patientFilter === "new" ? patient.isNew :
                         patientFilter === "inactive" ? patient.status === "inactive" :
                         true
    
    return matchesSearch && matchesFilter
  })

  const patientTabsConfig = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "clinical-notes", label: "Clinical Notes", icon: StickyNote },
    { id: "dental-chart", label: "Dental Chart", icon: UserCheck },
    { id: "image-gallery", label: "Image Gallery", icon: Camera },
    { id: "lab-rx", label: "Lab Rx", icon: Microscope },
    { id: "billing", label: "Billing", icon: Receipt }
  ]

  const dentalChartLegend = [
    { label: "Healthy", color: "bg-green-200", textColor: "text-green-800" },
    { label: "Caries", color: "bg-red-200", textColor: "text-red-800" },
    { label: "Filled", color: "bg-blue-200", textColor: "text-blue-800" },
    { label: "Crown", color: "bg-yellow-200", textColor: "text-yellow-800" },
    { label: "Missing", color: "bg-gray-200", textColor: "text-gray-800" },
    { label: "Needs Attention", color: "bg-orange-200", textColor: "text-orange-800" }
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
              <span className="text-muted-foreground text-sm">Dental Clinic Management</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Emergency Contact
              </Button>
              
              <Button
                size="sm"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                New Appointment
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
                    3
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
                      {alerts.map((alert) => (
                        <div key={alert.id} className="p-3 hover:bg-accent/5 rounded-lg cursor-pointer border-b border-border last:border-0">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.type === 'warning' ? 'bg-yellow-500' : 
                              alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{alert.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
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
            {dentistTabs.map((tab) => {
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
            {activeTab === "todays-view" && (
              <div className="p-6 space-y-6">
                {/* Page Header */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Hello, {dentistData?.name || 'Doctor'}!
                  </h2>
                  <p className="text-muted-foreground">Saturday, September 13, 2025</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.appointments.total}</span>
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {todayStats.appointments.completed} completed, {todayStats.appointments.remaining} remaining
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.completionRate}%</span>
                            <TrendingUp className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-3">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${todayStats.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">₹{todayStats.revenue.toLocaleString()}</span>
                            <Banknote className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">New Patients</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold">{todayStats.newPatients}</span>
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Welcome consultations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Schedule */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <p className="text-sm text-muted-foreground">Your appointments for today</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {todaySchedule.map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-muted-foreground min-w-20">
                                {appointment.time}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{appointment.patient}</p>
                                <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">{appointment.duration}</span>
                              <Badge 
                                variant={
                                  appointment.status === 'completed' ? 'default' :
                                  appointment.status === 'in progress' ? 'secondary' : 'outline'
                                }
                                className={
                                  appointment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                  appointment.status === 'in progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Alerts & Reminders */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Alerts & Reminders</CardTitle>
                        <p className="text-sm text-muted-foreground">Important notifications</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {alerts.map((alert) => (
                          <div key={alert.id} className="p-3 rounded-lg border border-border">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                alert.type === 'warning' ? 'bg-yellow-500' : 
                                alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Frequently used functions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                          <Button
                            key={index}
                            variant={action.primary ? "default" : "outline"}
                            className={`h-20 flex flex-col gap-2 ${action.primary ? 'bg-accent hover:bg-accent/90' : ''}`}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-sm">{action.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Patient Management */}
            {activeTab === "patients" && (
              <div className="flex h-full">
                {/* Left Sidebar - Patient List */}
                <div className="w-80 border-r border-border bg-white flex flex-col">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">Patient Queue</h3>
                        <p className="text-sm text-muted-foreground">{filteredPatients.length} patients</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setShowAddPatientModal(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={patientSearchTerm}
                        onChange={(e) => setPatientSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    
                    {/* Filter Dropdown */}
                    <div className="relative">
                      <select
                        value={patientFilter}
                        onChange={(e) => setPatientFilter(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                      >
                        <option value="all">All Patients</option>
                        <option value="active">Active</option>
                        <option value="new">New Patients</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Patient List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`p-4 border-b border-border cursor-pointer hover:bg-accent/5 transition-colors ${
                          selectedPatient?.id === patient.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{patient.name}</h4>
                          <div className="flex gap-2">
                            {patient.isNew && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">new</Badge>
                            )}
                            <Badge 
                              className={patient.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                            >
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">UHID: {patient.uhid}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <Phone className="w-3 h-3 inline mr-1" />{patient.phone}
                        </p>
                        
                        {patient.lastVisit && (
                          <p className="text-xs text-muted-foreground mb-1">
                            <CalendarIcon className="w-3 h-3 inline mr-1" />Last: {patient.lastVisit}
                          </p>
                        )}
                        
                        {patient.nextVisit && (
                          <p className="text-xs text-primary">
                            <CalendarIcon className="w-3 h-3 inline mr-1" />Next: {patient.nextVisit}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  {selectedPatient ? (
                    <>
                      {/* Patient Header */}
                      <div className="p-6 border-b border-border bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-foreground">{selectedPatient.name}</h2>
                              <div className="flex gap-2">
                                {selectedPatient.hasCriticalInfo && (
                                  <Badge className="bg-red-100 text-red-800 border-red-200">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Medical Alert
                                  </Badge>
                                )}
                                {selectedPatient.isNew && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">new</Badge>
                                )}
                                <Badge className={selectedPatient.status === 'active' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                                  {selectedPatient.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground">UHID: {selectedPatient.uhid}</p>
                          </div>
                        </div>
                        
                        {/* Critical Medical Information */}
                        {selectedPatient.hasCriticalInfo && selectedPatient.medicalAlerts.length > 0 && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-red-800 mb-1">Critical Medical Information</h4>
                                {selectedPatient.medicalAlerts.map((alert: string, index: number) => (
                                  <p key={index} className="text-sm text-red-700">{alert}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Patient Tab Navigation */}
                        <div className="mt-6">
                          <div className="flex gap-1">
                            {patientTabsConfig.map((tab) => {
                              const Icon = tab.icon
                              const isActive = activePatientTab === tab.id
                              
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setActivePatientTab(tab.id)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                        </div>
                      </div>
                      
                      {/* Patient Tab Content */}
                      <div className="flex-1 overflow-y-auto p-6">
                        {activePatientTab === "dental-chart" && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground">Interactive Dental Chart</h3>
                                <p className="text-muted-foreground">Click on any tooth to add diagnosis</p>
                              </div>
                              <Button className="bg-primary hover:bg-primary/90">
                                <Eye className="w-4 h-4 mr-2" />
                                Open 3D Visual Aid
                              </Button>
                            </div>
                            
                            {/* Legend */}
                            <Card>
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-3">Legend</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  {dentalChartLegend.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                                      <span className="text-sm text-foreground">{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                            
                            {/* Dental Chart */}
                            <Card>
                              <CardContent className="p-6">
                                <div className="space-y-8">
                                  {/* Upper Jaw */}
                                  <div>
                                    <h5 className="text-center font-medium mb-4">Upper Jaw (Maxilla)</h5>
                                    <div className="flex justify-center gap-1">
                                      {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
                                        <button
                                          key={tooth}
                                          className={`w-8 h-8 border border-border rounded text-xs font-medium hover:border-primary transition-colors ${
                                            [16, 24].includes(tooth) ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                                          }`}
                                        >
                                          {tooth}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Lower Jaw */}
                                  <div>
                                    <h5 className="text-center font-medium mb-4">Lower Jaw (Mandible)</h5>
                                    <div className="flex justify-center gap-1">
                                      {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
                                        <button
                                          key={tooth}
                                          className="w-8 h-8 border border-border rounded text-xs font-medium bg-green-200 text-green-800 hover:border-primary transition-colors"
                                        >
                                          {tooth}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                        
                        {/* Other tab content placeholders */}
                        {activePatientTab !== "dental-chart" && (
                          <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                {patientTabsConfig.find(tab => tab.id === activePatientTab)?.icon && (
                                  React.createElement(patientTabsConfig.find(tab => tab.id === activePatientTab)!.icon, {
                                    className: "w-8 h-8 text-muted-foreground"
                                  })
                                )}
                              </div>
                              <h3 className="font-semibold text-lg mb-2">
                                {patientTabsConfig.find(tab => tab.id === activePatientTab)?.label}
                              </h3>
                              <p className="text-muted-foreground">This section is coming soon.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* No Patient Selected */
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <UserCheck className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Clinical Cockpit</h3>
                        <p className="text-muted-foreground">Select a patient to view their details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Consultation Tab */}
            {activeTab === "consultation" && <ConsultationForm />}

            {/* Other tab content placeholders */}
            {!["todays-view", "patients", "consultation"].includes(activeTab) && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {dentistTabs.find(tab => tab.id === activeTab)?.icon && (
                      React.createElement(dentistTabs.find(tab => tab.id === activeTab)!.icon, {
                        className: "w-8 h-8 text-muted-foreground"
                      })
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {dentistTabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                  <p className="text-muted-foreground">This section is coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddPatientModal 
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSave={(data) => console.log('Saving patient:', data)}
        newPatientForm={newPatientForm}
        setNewPatientForm={setNewPatientForm}
      />
    </div>
  )
}
