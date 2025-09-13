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
  Plus, 
  Search, 
  Trash2, 
  AlertTriangle, 
  Pill, 
  FileText, 
  Printer,
  Download,
  Clock,
  CheckCircle,
  Edit,
  Copy
} from "lucide-react"

interface Medicine {
  id: string
  name: string
  genericName: string
  category: string
  strength: string[]
  forms: string[] // tablet, syrup, injection, etc.
  warnings?: string[]
  contraindications?: string[]
  interactions?: string[]
}

interface PrescriptionItem {
  id: string
  medicine: Medicine
  strength: string
  form: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeMeals: boolean
  quantity: number
}

interface Prescription {
  id: string
  patientId: string
  patientName: string
  date: string
  items: PrescriptionItem[]
  notes?: string
  status: "draft" | "issued" | "dispensed"
  dentistName: string
  clinicInfo: {
    name: string
    address: string
    phone: string
    license: string
  }
}

interface PrescriptionManagerProps {
  patientId: string
  patientName: string
  onSave?: (prescription: Prescription) => void
}

export function PrescriptionManager({ patientId, patientName, onSave }: PrescriptionManagerProps) {
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([])
  const [showMedicineSearch, setShowMedicineSearch] = useState(false)
  const [medicineSearch, setMedicineSearch] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showAddNewMedicine, setShowAddNewMedicine] = useState(false)
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: '',
    genericName: '',
    category: '',
    strength: [],
    forms: [],
    warnings: [],
    contraindications: [],
    interactions: []
  })
  const [customMedicines, setCustomMedicines] = useState<Medicine[]>([])

  // Mock medicine database
  const medicineDatabase: Medicine[] = [
    {
      id: "1",
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      strength: ["250mg", "500mg", "1000mg"],
      forms: ["Capsule", "Tablet", "Syrup"],
      warnings: ["May cause allergic reactions", "Complete full course"],
      contraindications: ["Penicillin allergy"],
      interactions: ["Warfarin", "Methotrexate"]
    },
    {
      id: "2", 
      name: "Ibuprofen",
      genericName: "Ibuprofen",
      category: "Pain Reliever/Anti-inflammatory",
      strength: ["200mg", "400mg", "600mg", "800mg"],
      forms: ["Tablet", "Capsule", "Syrup"],
      warnings: ["Take with food", "May cause stomach upset"],
      contraindications: ["Stomach ulcers", "Kidney disease"],
      interactions: ["Blood thinners", "ACE inhibitors"]
    },
    {
      id: "3",
      name: "Paracetamol",
      genericName: "Acetaminophen",
      category: "Pain Reliever/Fever Reducer",
      strength: ["325mg", "500mg", "650mg"],
      forms: ["Tablet", "Syrup", "Injection"],
      warnings: ["Maximum 4g per day", "Liver function monitoring"],
      contraindications: ["Severe liver disease"],
      interactions: ["Warfarin", "Alcohol"]
    },
    {
      id: "4",
      name: "Chlorhexidine Mouthwash",
      genericName: "Chlorhexidine Gluconate",
      category: "Antiseptic",
      strength: ["0.2%", "0.12%"],
      forms: ["Mouthwash", "Gel"],
      warnings: ["May stain teeth", "Do not swallow"],
      contraindications: ["Known hypersensitivity"]
    },
    {
      id: "5",
      name: "Metronidazole",
      genericName: "Metronidazole",
      category: "Antibiotic",
      strength: ["250mg", "400mg", "500mg"],
      forms: ["Tablet", "Gel", "Injection"],
      warnings: ["Avoid alcohol", "Complete course"],
      contraindications: ["Pregnancy first trimester", "Alcohol consumption"],
      interactions: ["Alcohol", "Warfarin", "Lithium"]
    }
  ]

  // Combine default and custom medicines
  const allMedicines = [...medicineDatabase, ...customMedicines]
  
  const filteredMedicines = allMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    medicine.category.toLowerCase().includes(medicineSearch.toLowerCase())
  )

  const frequencyOptions = [
    "Once daily",
    "Twice daily", 
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime"
  ]

  const durationOptions = [
    "3 days",
    "5 days", 
    "7 days",
    "10 days",
    "14 days",
    "21 days",
    "1 month",
    "Until finished",
    "As directed"
  ]

  const handleAddMedicine = (medicine: Medicine) => {
    const newItem: PrescriptionItem = {
      id: Math.random().toString(36).substr(2, 9),
      medicine,
      strength: medicine.strength[0] || "",
      form: medicine.forms[0] || "",
      dosage: "1",
      frequency: "Twice daily",
      duration: "5 days",
      instructions: "",
      beforeMeals: false,
      quantity: 10
    }
    
    setPrescriptionItems([...prescriptionItems, newItem])
    setShowMedicineSearch(false)
    setMedicineSearch("")
  }

  const handleAddNewMedicine = () => {
    if (!newMedicine.name.trim() || !newMedicine.genericName.trim()) {
      alert("Please enter at least medicine name and generic name")
      return
    }

    const medicine: Medicine = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newMedicine,
      strength: newMedicine.strength.filter(s => s.trim() !== ''),
      forms: newMedicine.forms.filter(f => f.trim() !== ''),
      warnings: newMedicine.warnings?.filter(w => w.trim() !== '') || [],
      contraindications: newMedicine.contraindications?.filter(c => c.trim() !== '') || [],
      interactions: newMedicine.interactions?.filter(i => i.trim() !== '') || []
    }

    setCustomMedicines(prev => [...prev, medicine])
    setNewMedicine({
      name: '',
      genericName: '',
      category: '',
      strength: [],
      forms: [],
      warnings: [],
      contraindications: [],
      interactions: []
    })
    setShowAddNewMedicine(false)
    handleAddMedicine(medicine)
  }

  const addToNewMedicineArray = (field: 'strength' | 'forms' | 'warnings' | 'contraindications' | 'interactions', value: string) => {
    if (value.trim() === '') return
    setNewMedicine(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }))
  }

  const removeFromNewMedicineArray = (field: 'strength' | 'forms' | 'warnings' | 'contraindications' | 'interactions', index: number) => {
    setNewMedicine(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }))
  }

  const updatePrescriptionItem = (id: string, updates: Partial<PrescriptionItem>) => {
    setPrescriptionItems(items =>
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }

  const removePrescriptionItem = (id: string) => {
    setPrescriptionItems(items => items.filter(item => item.id !== id))
  }

  const generatePrescription = (): Prescription => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      patientId,
      patientName,
      date: new Date().toISOString().split('T')[0],
      items: prescriptionItems,
      notes: prescriptionNotes,
      status: "draft",
      dentistName: "Dr. Sarah Wilson",
      clinicInfo: {
        name: "ENDOFLOW Dental Clinic",
        address: "123 Healthcare Ave, Medical District, MD 12345",
        phone: "+1 (555) 123-ENDO",
        license: "MD-DENT-2024-001"
      }
    }
  }

  const handleSavePrescription = () => {
    const prescription = generatePrescription()
    if (onSave) {
      onSave(prescription)
    }
    console.log("Prescription saved:", prescription)
  }

  const checkDrugInteractions = () => {
    const interactions: string[] = []
    prescriptionItems.forEach((item, index) => {
      prescriptionItems.slice(index + 1).forEach(otherItem => {
        if (item.medicine.interactions?.some(interaction =>
          otherItem.medicine.name.includes(interaction) ||
          otherItem.medicine.genericName.includes(interaction)
        )) {
          interactions.push(`${item.medicine.name} may interact with ${otherItem.medicine.name}`)
        }
      })
    })
    return interactions
  }

  const drugInteractions = checkDrugInteractions()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Prescription Manager
          </h3>
          <p className="text-sm text-muted-foreground">Create digital prescription for {patientName}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowMedicineSearch(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
          {prescriptionItems.length > 0 && (
            <Button 
              size="sm"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Preview Prescription
            </Button>
          )}
        </div>
      </div>

      {/* Drug Interactions Warning */}
      {drugInteractions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Drug Interaction Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {drugInteractions.map((interaction, index) => (
              <p key={index} className="text-sm text-orange-700 mb-1">
                ⚠️ {interaction}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Prescription Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prescribed Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptionItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No medications prescribed</p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => setShowMedicineSearch(true)}
              >
                Add First Medicine
              </Button>
            </div>
          ) : (
            prescriptionItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{item.medicine.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.medicine.genericName}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.medicine.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrescriptionItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <Label className="text-xs">Strength</Label>
                      <Select
                        value={item.strength}
                        onValueChange={(value) => updatePrescriptionItem(item.id, { strength: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.medicine.strength.map(strength => (
                            <SelectItem key={strength} value={strength}>{strength}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Form</Label>
                      <Select
                        value={item.form}
                        onValueChange={(value) => updatePrescriptionItem(item.id, { form: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.medicine.forms.map(form => (
                            <SelectItem key={form} value={form}>{form}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Dosage</Label>
                      <Input
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionItem(item.id, { dosage: e.target.value })}
                        className="h-8"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePrescriptionItem(item.id, { quantity: parseInt(e.target.value) })}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Select
                        value={item.frequency}
                        onValueChange={(value) => updatePrescriptionItem(item.id, { frequency: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map(freq => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Duration</Label>
                      <Select
                        value={item.duration}
                        onValueChange={(value) => updatePrescriptionItem(item.id, { duration: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map(duration => (
                            <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`before-meals-${item.id}`}
                        checked={item.beforeMeals}
                        onCheckedChange={(checked) => 
                          updatePrescriptionItem(item.id, { beforeMeals: !!checked })
                        }
                      />
                      <Label htmlFor={`before-meals-${item.id}`} className="text-xs">
                        Take before meals
                      </Label>
                    </div>

                    <div>
                      <Label className="text-xs">Special Instructions</Label>
                      <Input
                        value={item.instructions}
                        onChange={(e) => updatePrescriptionItem(item.id, { instructions: e.target.value })}
                        placeholder="Additional instructions..."
                        className="h-8"
                      />
                    </div>
                  </div>

                  {/* Warnings */}
                  {item.medicine.warnings && item.medicine.warnings.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs font-medium text-yellow-800 mb-1">Warnings:</p>
                      {item.medicine.warnings.map((warning, index) => (
                        <p key={index} className="text-xs text-yellow-700">• {warning}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Prescription Notes */}
      {prescriptionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              placeholder="Additional instructions or notes for the patient..."
              className="w-full h-24 p-3 border border-border rounded-lg resize-none text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {prescriptionItems.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSavePrescription}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Issue Prescription
          </Button>
        </div>
      )}

      {/* Medicine Search Dialog */}
      <Dialog open={showMedicineSearch} onOpenChange={setShowMedicineSearch}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Medicine to Prescription</DialogTitle>
            <DialogDescription>
              Search and select medicines from the database
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines by name, generic name, or category..."
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Add New Medicine Button */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <span className="text-sm font-medium">Search Results ({filteredMedicines.length} found)</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddNewMedicine(true)}
                className="text-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New Medicine
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="cursor-pointer hover:bg-accent/5 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{medicine.name}</h4>
                          {medicine.id.startsWith('custom_') && (
                            <Badge variant="outline" className="text-xs text-primary border-primary">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {medicine.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Available in: {medicine.strength.join(", ")}
                          </span>
                        </div>
                        {medicine.warnings && medicine.warnings.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-orange-600">Warnings:</p>
                            <p className="text-xs text-orange-600">
                              {medicine.warnings.slice(0, 2).join(", ")}
                              {medicine.warnings.length > 2 && "..."}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddMedicine(medicine)}
                        className="ml-3"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredMedicines.length === 0 && medicineSearch && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No medicines found matching "{medicineSearch}"</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => setShowAddNewMedicine(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add "{medicineSearch}" as New Medicine
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Prescription Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
            <DialogDescription>
              Review the prescription before issuing
            </DialogDescription>
          </DialogHeader>

          <div className="bg-white border rounded-lg p-6 text-black">
            {/* Clinic Header */}
            <div className="text-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold">ENDOFLOW Dental Clinic</h2>
              <p className="text-sm">123 Healthcare Ave, Medical District, MD 12345</p>
              <p className="text-sm">Phone: +1 (555) 123-ENDO | License: MD-DENT-2024-001</p>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p><strong>Patient:</strong> {patientName}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Doctor:</strong> Dr. Sarah Wilson</p>
                <p><strong>Prescription #:</strong> RX{Date.now().toString().slice(-6)}</p>
              </div>
            </div>

            {/* Prescription Items */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">PRESCRIPTION</h3>
              {prescriptionItems.map((item, index) => (
                <div key={item.id} className="mb-4 p-3 border rounded">
                  <p className="font-medium">{index + 1}. {item.medicine.name} ({item.strength}) - {item.form}</p>
                  <p className="text-sm mt-1">
                    <strong>Sig:</strong> Take {item.dosage} {item.form.toLowerCase()} {item.frequency.toLowerCase()}
                    {item.beforeMeals ? " before meals" : ""} for {item.duration}
                  </p>
                  <p className="text-sm"><strong>Quantity:</strong> {item.quantity}</p>
                  {item.instructions && (
                    <p className="text-sm"><strong>Instructions:</strong> {item.instructions}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            {prescriptionNotes && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">ADDITIONAL NOTES</h3>
                <p className="text-sm">{prescriptionNotes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 mt-6">
              <p className="text-xs text-gray-600">
                This prescription is electronically generated and valid. 
                For any queries, contact the clinic at +1 (555) 123-ENDO
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button size="sm" onClick={() => {
              setShowPreview(false)
              handleSavePrescription()
            }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Issue Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Medicine Dialog */}
      <Dialog open={showAddNewMedicine} onOpenChange={setShowAddNewMedicine}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Add a custom medicine to the database for prescribing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicine-name">Medicine Name *</Label>
                  <Input
                    id="medicine-name"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={medicineSearch || "e.g., Amoxicillin"}
                  />
                </div>
                <div>
                  <Label htmlFor="generic-name">Generic Name *</Label>
                  <Input
                    id="generic-name"
                    value={newMedicine.genericName}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, genericName: e.target.value }))}
                    placeholder="e.g., Amoxicillin"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newMedicine.category}
                  onValueChange={(value) => setNewMedicine(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                    <SelectItem value="Pain Reliever">Pain Reliever</SelectItem>
                    <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                    <SelectItem value="Antiseptic">Antiseptic</SelectItem>
                    <SelectItem value="Analgesic">Analgesic</SelectItem>
                    <SelectItem value="Anesthetic">Anesthetic</SelectItem>
                    <SelectItem value="Antifungal">Antifungal</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="font-medium">Available Strengths</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 250mg, 500mg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToNewMedicineArray('strength', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value) {
                      addToNewMedicineArray('strength', input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newMedicine.strength.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {strength}
                    <button
                      onClick={() => removeFromNewMedicineArray('strength', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Forms */}
            <div className="space-y-3">
              <h4 className="font-medium">Available Forms</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Tablet, Syrup, Injection"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToNewMedicineArray('forms', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value) {
                      addToNewMedicineArray('forms', input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newMedicine.forms.map((form, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {form}
                    <button
                      onClick={() => removeFromNewMedicineArray('forms', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div className="space-y-3">
              <h4 className="font-medium">Warnings (Optional)</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., May cause drowsiness"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToNewMedicineArray('warnings', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value) {
                      addToNewMedicineArray('warnings', input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newMedicine.warnings && newMedicine.warnings.map((warning, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-200">
                    {warning}
                    <button
                      onClick={() => removeFromNewMedicineArray('warnings', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            <div className="space-y-3">
              <h4 className="font-medium">Contraindications (Optional)</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Pregnancy, Liver disease"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToNewMedicineArray('contraindications', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value) {
                      addToNewMedicineArray('contraindications', input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newMedicine.contraindications && newMedicine.contraindications.map((contraindication, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 text-red-600 border-red-200">
                    {contraindication}
                    <button
                      onClick={() => removeFromNewMedicineArray('contraindications', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interactions */}
            <div className="space-y-3">
              <h4 className="font-medium">Drug Interactions (Optional)</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Warfarin, Alcohol"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToNewMedicineArray('interactions', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value) {
                      addToNewMedicineArray('interactions', input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newMedicine.interactions && newMedicine.interactions.map((interaction, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
                    {interaction}
                    <button
                      onClick={() => removeFromNewMedicineArray('interactions', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNewMedicine(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewMedicine}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine & Prescribe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}