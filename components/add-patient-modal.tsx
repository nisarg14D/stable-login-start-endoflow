"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patientData: any) => void
  newPatientForm: any
  setNewPatientForm: (form: any) => void
}

export function AddPatientModal({ 
  isOpen, 
  onClose, 
  onSave, 
  newPatientForm, 
  setNewPatientForm 
}: AddPatientModalProps) {
  if (!isOpen) return null

  const handleSave = () => {
    if (!newPatientForm.firstName || !newPatientForm.lastName || !newPatientForm.phoneNumber) {
      alert("Please fill in all required fields (First Name, Last Name, Phone Number)")
      return
    }
    
    const uhid = newPatientForm.uhid || `ENDO-${Date.now().toString().slice(-6)}`
    alert(`Patient ${newPatientForm.firstName} ${newPatientForm.lastName} has been registered successfully!\nUHID: ${uhid}`)
    
    setNewPatientForm({ 
      uhid: "", 
      firstName: "", 
      lastName: "", 
      dateOfBirth: "", 
      phoneNumber: "", 
      emailAddress: "", 
      medicalHistory: "" 
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-primary text-primary-foreground text-center">
          <CardTitle className="text-xl">Register New Patient</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">UHID (Unique Health ID)</label>
            <input
              type="text"
              value={newPatientForm.uhid}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, uhid: e.target.value })}
              placeholder="Enter UHID (auto-generated if left empty)"
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name *</label>
              <input
                type="text"
                value={newPatientForm.firstName}
                onChange={(e) => setNewPatientForm({ ...newPatientForm, firstName: e.target.value })}
                placeholder="Enter first name"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name *</label>
              <input
                type="text"
                value={newPatientForm.lastName}
                onChange={(e) => setNewPatientForm({ ...newPatientForm, lastName: e.target.value })}
                placeholder="Enter last name"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            <input
              type="date"
              value={newPatientForm.dateOfBirth}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, dateOfBirth: e.target.value })}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <input
                type="tel"
                value={newPatientForm.phoneNumber}
                onChange={(e) => setNewPatientForm({ ...newPatientForm, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={newPatientForm.emailAddress}
                onChange={(e) => setNewPatientForm({ ...newPatientForm, emailAddress: e.target.value })}
                placeholder="Enter email address"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Medical History Summary</label>
            <textarea
              value={newPatientForm.medicalHistory}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, medicalHistory: e.target.value })}
              placeholder="Enter relevant medical history, allergies, current medications, etc."
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
            >
              Save Patient
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}