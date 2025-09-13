"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Calendar,
  Clock,
  Bell,
  UserCheck,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Star,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

interface FollowUpItem {
  id: string
  type: "appointment" | "call" | "message" | "reminder" | "checkup"
  title: string
  description: string
  scheduledDate: string
  scheduledTime: string
  priority: "low" | "medium" | "high"
  status: "pending" | "scheduled" | "completed" | "cancelled"
  reminderDays: number[]
  notes?: string
  outcome?: string
  rating?: number
}

interface FollowUpPlan {
  id: string
  patientId: string
  patientName: string
  treatmentType: string
  createdDate: string
  items: FollowUpItem[]
  overallStatus: "active" | "completed" | "cancelled"
  nextDueDate?: string
}

interface FollowUpManagerProps {
  patientId: string
  patientName: string
  treatmentType: string
  onSave?: (followUpPlan: FollowUpPlan) => void
}

export function FollowUpManager({ patientId, patientName, treatmentType, onSave }: FollowUpManagerProps) {
  const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([])
  const [showAddFollowUp, setShowAddFollowUp] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUpItem>>({
    type: "appointment",
    priority: "medium",
    reminderDays: [1, 3]
  })
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem | null>(null)

  // Predefined follow-up templates based on treatment type
  const followUpTemplates = {
    "Root Canal": [
      {
        type: "appointment",
        title: "Post-Treatment Check",
        description: "Check for pain, swelling, and initial healing",
        daysAfter: 3,
        priority: "high"
      },
      {
        type: "call",
        title: "Comfort Check Call",
        description: "Phone call to assess patient comfort and pain levels",
        daysAfter: 1,
        priority: "medium"
      },
      {
        type: "appointment",
        title: "Crown Placement",
        description: "Schedule permanent crown placement",
        daysAfter: 14,
        priority: "high"
      }
    ],
    "Tooth Extraction": [
      {
        type: "call",
        title: "24-Hour Check Call",
        description: "Assess pain levels and ensure proper care instructions are followed",
        daysAfter: 1,
        priority: "high"
      },
      {
        type: "appointment", 
        title: "Healing Assessment",
        description: "Check extraction site healing and remove sutures if needed",
        daysAfter: 7,
        priority: "medium"
      },
      {
        type: "appointment",
        title: "Replacement Options Consultation",
        description: "Discuss implant, bridge, or denture options",
        daysAfter: 30,
        priority: "medium"
      }
    ],
    "Routine Cleaning": [
      {
        type: "reminder",
        title: "Next Cleaning Reminder",
        description: "Remind patient to schedule next routine cleaning",
        daysAfter: 150,
        priority: "low"
      },
      {
        type: "message",
        title: "Oral Care Tips",
        description: "Send personalized oral care tips and recommendations",
        daysAfter: 30,
        priority: "low"
      }
    ],
    "Crown Fitting": [
      {
        type: "call",
        title: "Comfort Check",
        description: "Ensure crown fits properly and no discomfort",
        daysAfter: 1,
        priority: "medium"
      },
      {
        type: "appointment",
        title: "Crown Follow-up",
        description: "Check crown placement and bite adjustment",
        daysAfter: 14,
        priority: "medium"
      }
    ]
  }

  const followUpTypes = [
    { value: "appointment", label: "Follow-up Appointment", icon: Calendar },
    { value: "call", label: "Phone Call", icon: Phone },
    { value: "message", label: "Message/SMS", icon: MessageCircle },
    { value: "reminder", label: "Reminder", icon: Bell },
    { value: "checkup", label: "Progress Checkup", icon: UserCheck }
  ]

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  }

  const statusColors = {
    pending: "bg-gray-100 text-gray-800 border-gray-200",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  }

  const handleApplyTemplate = (template: string) => {
    const templateItems = followUpTemplates[template as keyof typeof followUpTemplates] || []
    const baseDate = new Date()
    
    const newItems: FollowUpItem[] = templateItems.map((item, index) => {
      const scheduledDate = new Date(baseDate)
      scheduledDate.setDate(scheduledDate.getDate() + item.daysAfter)
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: item.type as FollowUpItem["type"],
        title: item.title,
        description: item.description,
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        scheduledTime: item.type === "appointment" ? "10:00" : "09:00",
        priority: item.priority as FollowUpItem["priority"],
        status: "pending",
        reminderDays: item.type === "appointment" ? [1, 3] : [1]
      }
    })
    
    setFollowUpItems([...followUpItems, ...newItems])
    setSelectedTemplate("")
  }

  const handleAddFollowUp = () => {
    if (!newFollowUp.title || !newFollowUp.scheduledDate) return

    const followUpItem: FollowUpItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: newFollowUp.type || "appointment",
      title: newFollowUp.title || "",
      description: newFollowUp.description || "",
      scheduledDate: newFollowUp.scheduledDate || "",
      scheduledTime: newFollowUp.scheduledTime || "10:00",
      priority: newFollowUp.priority || "medium",
      status: "pending",
      reminderDays: newFollowUp.reminderDays || [1],
      notes: newFollowUp.notes
    }

    setFollowUpItems([...followUpItems, followUpItem])
    setNewFollowUp({
      type: "appointment",
      priority: "medium",
      reminderDays: [1, 3]
    })
    setShowAddFollowUp(false)
  }

  const updateFollowUpItem = (id: string, updates: Partial<FollowUpItem>) => {
    setFollowUpItems(items =>
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }

  const removeFollowUpItem = (id: string) => {
    setFollowUpItems(items => items.filter(item => item.id !== id))
  }

  const handleSaveFollowUpPlan = () => {
    const followUpPlan: FollowUpPlan = {
      id: Math.random().toString(36).substr(2, 9),
      patientId,
      patientName,
      treatmentType,
      createdDate: new Date().toISOString().split('T')[0],
      items: followUpItems,
      overallStatus: "active",
      nextDueDate: followUpItems
        .filter(item => item.status === "pending")
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0]?.scheduledDate
    }

    if (onSave) {
      onSave(followUpPlan)
    }
    console.log("Follow-up plan saved:", followUpPlan)
  }

  const getNextDueItem = () => {
    return followUpItems
      .filter(item => item.status === "pending")
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0]
  }

  const completedItemsCount = followUpItems.filter(item => item.status === "completed").length
  const totalItemsCount = followUpItems.length
  const progressPercentage = totalItemsCount > 0 ? (completedItemsCount / totalItemsCount) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Follow-up Care Plan
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage follow-up care for {patientName} - {treatmentType}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddFollowUp(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Follow-up
          </Button>
          {followUpItems.length > 0 && (
            <Button 
              size="sm"
              onClick={handleSaveFollowUpPlan}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save Plan
            </Button>
          )}
        </div>
      </div>

      {/* Quick Templates */}
      {followUpItems.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Start Templates</CardTitle>
            <p className="text-sm text-muted-foreground">
              Apply pre-configured follow-up plans based on treatment type
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(followUpTemplates).map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <div className="font-medium">{template}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {followUpTemplates[template as keyof typeof followUpTemplates].length} follow-up items
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      {followUpItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Follow-up Progress
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalItemsCount}</div>
                  <div className="text-xs text-muted-foreground">Total Items</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedItemsCount}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {followUpItems.filter(item => item.status === "pending").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {followUpItems.filter(item => item.status === "scheduled").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Scheduled</div>
                </div>
              </div>

              {getNextDueItem() && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Next Due:</p>
                  <p className="text-sm text-blue-700">
                    {getNextDueItem()?.title} - {new Date(getNextDueItem()!.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Follow-up Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {followUpItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No follow-up items scheduled</p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => setShowAddFollowUp(true)}
              >
                Add First Follow-up
              </Button>
            </div>
          ) : (
            followUpItems
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((item) => {
                const ItemIcon = followUpTypes.find(type => type.value === item.type)?.icon || Calendar
                return (
                  <Card key={item.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <ItemIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={priorityColors[item.priority]}>
                                {item.priority} priority
                              </Badge>
                              <Badge className={statusColors[item.status]}>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFollowUp(item)
                              setShowProgressDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFollowUpItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <Label className="text-xs font-medium">Scheduled Date</Label>
                          <p>{new Date(item.scheduledDate).toLocaleDateString()}</p>
                        </div>
                        {item.type === "appointment" && (
                          <div>
                            <Label className="text-xs font-medium">Time</Label>
                            <p>{item.scheduledTime}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-xs font-medium">Reminders</Label>
                          <p>{item.reminderDays.join(", ")} days before</p>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <Label className="text-xs font-medium">Notes:</Label>
                          <p className="text-gray-700">{item.notes}</p>
                        </div>
                      )}

                      {item.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFollowUpItem(item.id, { status: "scheduled" })}
                          >
                            Mark Scheduled
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateFollowUpItem(item.id, { status: "completed" })}
                          >
                            Mark Completed
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
          )}
        </CardContent>
      </Card>

      {/* Add Follow-up Dialog */}
      <Dialog open={showAddFollowUp} onOpenChange={setShowAddFollowUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Follow-up Item</DialogTitle>
            <DialogDescription>
              Schedule a new follow-up activity for the patient
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newFollowUp.type}
                onValueChange={(value) => setNewFollowUp({...newFollowUp, type: value as FollowUpItem["type"]})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {followUpTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newFollowUp.title || ""}
                onChange={(e) => setNewFollowUp({...newFollowUp, title: e.target.value})}
                placeholder="Follow-up title..."
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newFollowUp.description || ""}
                onChange={(e) => setNewFollowUp({...newFollowUp, description: e.target.value})}
                placeholder="Description of the follow-up..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newFollowUp.scheduledDate || ""}
                  onChange={(e) => setNewFollowUp({...newFollowUp, scheduledDate: e.target.value})}
                />
              </div>
              {newFollowUp.type === "appointment" && (
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newFollowUp.scheduledTime || "10:00"}
                    onChange={(e) => setNewFollowUp({...newFollowUp, scheduledTime: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newFollowUp.priority}
                onValueChange={(value) => setNewFollowUp({...newFollowUp, priority: value as FollowUpItem["priority"]})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={newFollowUp.notes || ""}
                onChange={(e) => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFollowUp(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFollowUp}>
              Add Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Update Dialog */}
      {selectedFollowUp && (
        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Follow-up Progress</DialogTitle>
              <DialogDescription>
                Record the outcome and progress of this follow-up
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="font-medium">{selectedFollowUp.title}</Label>
                <p className="text-sm text-muted-foreground">{selectedFollowUp.description}</p>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedFollowUp.status}
                  onValueChange={(value) => setSelectedFollowUp({
                    ...selectedFollowUp, 
                    status: value as FollowUpItem["status"]
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="outcome">Outcome/Notes</Label>
                <textarea
                  id="outcome"
                  value={selectedFollowUp.outcome || ""}
                  onChange={(e) => setSelectedFollowUp({
                    ...selectedFollowUp, 
                    outcome: e.target.value
                  })}
                  placeholder="Record the outcome or notes from this follow-up..."
                  className="w-full h-24 p-3 border border-border rounded-lg resize-none text-sm"
                />
              </div>

              {selectedFollowUp.status === "completed" && (
                <div>
                  <Label>Patient Satisfaction Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFollowUp({
                          ...selectedFollowUp,
                          rating
                        })}
                        className={`p-1 ${selectedFollowUp.rating && selectedFollowUp.rating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                updateFollowUpItem(selectedFollowUp.id, selectedFollowUp)
                setShowProgressDialog(false)
                setSelectedFollowUp(null)
              }}>
                Update Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}