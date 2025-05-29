"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, FolderOpen, Printer, Save, FileText, X, Upload, Trash } from "lucide-react"
import { useToast } from "@/components/toast-provider"

/* Import the Header component */
import Header from "@/components/header"

interface Ticket {
  id: string
  imeIPrezime: string
  brojMobilnog: string
  brojFiksnog: string
  modelUredjaja: string
  serijskiBroj: string
  opisKvara: string
  biouDrugomServisu: string
  tamojRadjeno: string
  procenjenaCena: string
  fizickeAnomalije: string
  dodatnaOprema: string[]
  dodatnoOstalo: string
  primioNaServis: string
  datumKreiranja: string
  generated: boolean
  images?: string[] // Array of image data URLs
}

export default function FCOMAdmin() {
  const [currentView, setCurrentView] = useState<"dashboard" | "new-ticket" | "existing-tickets" | "ticket-detail">(
    "dashboard",
  )
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 10
  const { showSuccess, showError } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<Ticket>>({
    imeIPrezime: "",
    brojMobilnog: "",
    modelUredjaja: "",
    serijskiBroj: "",
    opisKvara: "",
    biouDrugomServisu: "",
    tamojRadjeno: "",
    procenjenaCena: "",
    fizickeAnomalije: "",
    dodatnaOprema: [],
    dodatnoOstalo: "",
    primioNaServis: "",
    generated: false,
    images: [],
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Ticket>>({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Load tickets from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem("fcom-tickets")
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets))
    }
  }, [])

  // Save tickets to localStorage
  const saveTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets)
    localStorage.setItem("fcom-tickets", JSON.stringify(newTickets))
  }

  // Generate unique ticket ID
  const generateTicketId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `FCM${timestamp}${random}`
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle checkbox changes for additional equipment
  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    const current = formData.dodatnaOprema || []
    if (checked) {
      handleInputChange("dodatnaOprema", [...current, equipment])
    } else {
      handleInputChange(
        "dodatnaOprema",
        current.filter((item) => item !== equipment),
      )
    }
  }

  // Generate ticket
  const generateTicket = () => {
    const ticketId = generateTicketId()
    const newTicket: Ticket = {
      ...(formData as Ticket),
      id: ticketId,
      datumKreiranja: new Date().toLocaleDateString("sr-RS"),
      generated: true,
    }
    setFormData(newTicket)
    showSuccess("Tiket Kreiran", "Novi prijemni list je uspešno kreiran.")
  }

  // Save ticket to database
  const saveTicket = () => {
    if (formData.generated && formData.id) {
      const newTickets = [...tickets, formData as Ticket]
      saveTickets(newTickets)
      showSuccess("Tiket Sačuvan", "Tiket je uspešno sačuvan u bazi.")
      resetForm()
      setCurrentView("dashboard")
    } else {
      showError("Greška", "Molimo proverite unete informacije.")
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      imeIPrezime: "",
      brojMobilnog: "",
      modelUredjaja: "",
      serijskiBroj: "",
      opisKvara: "",
      biouDrugomServisu: "",
      tamojRadjeno: "",
      procenjenaCena: "",
      fizickeAnomalije: "",
      dodatnaOprema: [],
      dodatnoOstalo: "",
      primioNaServis: "",
      generated: false,
      images: [],
    })
  }

  // Print functionality
  const handlePrint = () => {
    window.print()
  }

  // Filter and paginate tickets
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.imeIPrezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.modelUredjaja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage)

  const termsOfService = `USLOVI KORIŠĆENJA SERVISA:

1. Servis ne odgovara za podatke koji se nalaze na uređaju koji se predaje na popravku.
2. Preporučujemo da napravite rezervnu kopiju važnih podataka pre predaje uređaja.
3. Uređaj koji se ne preuzme u roku od 90 dana postaje vlasništvo servisa.
4. Cena popravke može varirati u zavisnosti na složenost kvara i potrebne delove.
5. Garancija na izvršene usluge je 30 dana od datuma preuzimanja uređaja.
6. Servis zadržava pravo da odbije popravku ukoliko proceni da nije ekonomski opravdana.
7. Vlasnik uređaja je obavestan o procenjenoj ceni popravke i saglasan je sa istom.`

  // Start editing
  const startEdit = () => {
    setEditFormData({ ...selectedTicket })
    setIsEditMode(true)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditFormData({})
    setIsEditMode(false)
  }

  // Save changes
  const saveChanges = () => {
    if (editFormData.id) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === editFormData.id ? (editFormData as Ticket) : ticket,
      )
      saveTickets(updatedTickets)
      setSelectedTicket(editFormData as Ticket)
      setIsEditMode(false)
      showSuccess("Izmene sačuvane", "Tiket je uspešno ažuriran.")
    }
  }

  // Delete ticket
  const deleteTicket = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.filter((ticket) => ticket.id !== selectedTicket.id)
      saveTickets(updatedTickets)
      setShowDeleteModal(false)
      setCurrentView("existing-tickets")
      showError("Tiket uspešno obrisan", "Tiket je trajno uklonjen iz baze.")
    }
  }

  // Handle edit form changes
  const handleEditInputChange = (field: string, value: string | string[]) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle edit equipment changes
  const handleEditEquipmentChange = (equipment: string, checked: boolean) => {
    const current = editFormData.dodatnaOprema || []
    if (checked) {
      handleEditInputChange("dodatnaOprema", [...current, equipment])
    } else {
      handleEditInputChange(
        "dodatnaOprema",
        current.filter((item) => item !== equipment),
      )
    }
  }
  // Format service agent name
  const formatServiceAgent = (agent: string) => {
    const nameMap = {
      "andrej-filipov": "Andrej Filipov",
      "jegor-filipov": "Jegor Filipov", 
      "mita-filipov": "Mita Filipov",
    }
    return nameMap[agent as keyof typeof nameMap] || agent
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const filePromises: Promise<string>[] = []

    Array.from(files).forEach((file) => {
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      })
      filePromises.push(promise)
    })

    Promise.all(filePromises).then((results) => {
      if (isEditMode) {
        const currentImages = editFormData.images || []
        handleEditInputChange("images", [...currentImages, ...results])
      } else if (selectedTicket) {
        const updatedTicket = {
          ...selectedTicket,
          images: [...(selectedTicket.images || []), ...results],
        }
        const updatedTickets = tickets.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket))
        saveTickets(updatedTickets)
        setSelectedTicket(updatedTicket)
        showSuccess("Slike dodate", "Slike su uspešno dodate u tiket.")
      }
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Delete image
  const deleteImage = (index: number) => {
    if (isEditMode) {
      const currentImages = [...(editFormData.images || [])]
      currentImages.splice(index, 1)
      handleEditInputChange("images", currentImages)
    } else if (selectedTicket && selectedTicket.images) {
      const updatedImages = [...selectedTicket.images]
      updatedImages.splice(index, 1)
      const updatedTicket = { ...selectedTicket, images: updatedImages }
      const updatedTickets = tickets.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket))
      saveTickets(updatedTickets)
      setSelectedTicket(updatedTicket)
      showSuccess("Slika obrisana", "Slika je uspešno obrisana iz tiketa.")
    }
  }

  // View image in modal
  const viewImage = (image: string) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView}
        />

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dobrodošli u F-COM Admin Panel</h2>
              <p className="text-lg text-gray-600">Izaberite opciju za upravljanje tiketima</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => setCurrentView("new-ticket")}
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Napravi novi tiket
              </Button>

              <Button
                onClick={() => setCurrentView("existing-tickets")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                <FolderOpen className="mr-2 h-5 w-5" />
                Pogledaj postojeće tikete
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (currentView === "new-ticket") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header currentView={currentView} setCurrentView={setCurrentView} showBackButton={true} />

        {/* Form Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:px-8 print:py-4">
          {formData.id && (
            <div className="mb-6 print:hidden">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold text-green-600">ID Tiketa: #{formData.id}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="print:shadow-none print:border-none">
            <CardHeader className="print:pb-2">
              <CardTitle className="print:hidden">Novi Prijemni List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 print:space-y-3">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                <div>
                  <Label htmlFor="imeIPrezime" className="print:text-sm print:font-semibold">
                    Ime i prezime
                  </Label>
                  <Input
                    id="imeIPrezime"
                    value={formData.imeIPrezime}
                    onChange={(e) => handleInputChange("imeIPrezime", e.target.value)}
                    className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                  />
                </div>
                <div>
                  <Label htmlFor="brojMobilnog" className="print:text-sm print:font-semibold">
                    Broj Telefona
                  </Label>
                  <Input
                    id="brojMobilnog"
                    value={formData.brojMobilnog}
                    onChange={(e) => handleInputChange("brojMobilnog", e.target.value)}
                    className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                <div>
                  <Label htmlFor="modelUredjaja" className="print:text-sm print:font-semibold">
                    Model uređaja
                  </Label>
                  <Input
                    id="modelUredjaja"
                    value={formData.modelUredjaja}
                    onChange={(e) => handleInputChange("modelUredjaja", e.target.value)}
                    className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="serijskiBroj" className="print:text-sm print:font-semibold">
                  Serijski broj uređaja
                </Label>
                <Input
                  id="serijskiBroj"
                  value={formData.serijskiBroj}
                  onChange={(e) => handleInputChange("serijskiBroj", e.target.value)}
                  className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                />
              </div>

              <div>
                <Label htmlFor="opisKvara" className="print:text-sm print:font-semibold">
                  Opis kvara
                </Label>
                <Textarea
                  id="opisKvara"
                  value={formData.opisKvara}
                  onChange={(e) => handleInputChange("opisKvara", e.target.value)}
                  rows={4}
                  className="print:border print:rounded-none print:min-h-[80px]"
                />
              </div>

              {/* Previous Service */}
              <div>
                <Label className="print:text-sm print:font-semibold">Da li je bio u drugom servisu?</Label>
                <RadioGroup
                  value={formData.biouDrugomServisu}
                  onValueChange={(value) => handleInputChange("biouDrugomServisu", value)}
                  className="flex space-x-6 mt-2 print:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="da" id="servis-da" />
                    <Label htmlFor="servis-da" className="print:text-sm">
                      Da
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ne" id="servis-ne" />
                    <Label htmlFor="servis-ne" className="print:text-sm">
                      Ne
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ne-znam" id="servis-ne-znam" />
                    <Label htmlFor="servis-ne-znam" className="print:text-sm">
                      Ne znam
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.biouDrugomServisu === "da" && (
                <div>
                  <Label htmlFor="tamojRadjeno" className="print:text-sm print:font-semibold">
                    Tamo je rađeno / konstatovano
                  </Label>
                  <Input
                    id="tamojRadjeno"
                    value={formData.tamojRadjeno}
                    onChange={(e) => handleInputChange("tamojRadjeno", e.target.value)}
                    className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                  />
                </div>
              )}

              {/* Price */}
              <div>
                <Label htmlFor="procenjenaCena" className="print:text-sm print:font-semibold">
                  Procenjena cena popravke (RSD)
                </Label>
                <Input
                  id="procenjenaCena"
                  value={formData.procenjenaCena}
                  onChange={(e) => handleInputChange("procenjenaCena", e.target.value)}
                  className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                />
                <p className="text-sm text-gray-600 mt-1 print:text-xs">
                  <em>Tražilac usluge je saglasan sa navedenim rasponom cene popravke.</em>
                </p>
              </div>

              {/* Physical Anomalies */}
              <div>
                <Label className="print:text-sm print:font-semibold">Vidljive fizičke anomalije?</Label>
                <RadioGroup
                  value={formData.fizickeAnomalije}
                  onValueChange={(value) => handleInputChange("fizickeAnomalije", value)}
                  className="flex space-x-6 mt-2 print:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="da" id="anomalije-da" />
                    <Label htmlFor="anomalije-da" className="print:text-sm">
                      Da
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ne" id="anomalije-ne" />
                    <Label htmlFor="anomalije-ne" className="print:text-sm">
                      Ne
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Additional Equipment */}
              <div>
                <Label className="print:text-sm print:font-semibold">Dodata oprema:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 print:gap-2">
                  {["Punjač", "Torba", "Baterija", "Dodatno"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`oprema-${item}`}
                        checked={formData.dodatnaOprema?.includes(item) || false}
                        onCheckedChange={(checked: boolean) => handleEquipmentChange(item, checked)}
                      />
                      <Label htmlFor={`oprema-${item}`} className="print:text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.dodatnaOprema?.includes("Dodatno") && (
                <div>
                  <Label htmlFor="dodatnoOstalo" className="print:text-sm print:font-semibold">
                    Specificirati dodatno:
                  </Label>
                  <Input
                    id="dodatnoOstalo"
                    value={formData.dodatnoOstalo}
                    onChange={(e) => handleInputChange("dodatnoOstalo", e.target.value)}
                    className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none print:px-0"
                  />
                </div>
              )}

              {/* Service Representative */}
              <div>
                <Label htmlFor="primioNaServis" className="print:text-sm print:font-semibold">
                  Primio na servis
                </Label>
                <Select
                  value={formData.primioNaServis}
                  onValueChange={(value) => handleInputChange("primioNaServis", value)}
                >
                  <SelectTrigger className="print:border-b print:border-t-0 print:border-l-0 print:border-r-0 print:rounded-none">
                    <SelectValue placeholder="Izaberite..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andrej-filipov">Andrej Filipov</SelectItem>
                    <SelectItem value="jegor-filipov">Jegor Filipov</SelectItem>
                    <SelectItem value="mita-filipov">Mita Filipov</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms of Service */}
              <div className="print:mt-4">
                <Label className="print:text-sm print:font-semibold">Uslovi korišćenja servisa:</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto text-sm print:bg-white print:p-0 print:max-h-none print:overflow-visible print:text-xs">
                  <pre className="whitespace-pre-wrap font-sans">{termsOfService}</pre>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 print:gap-4 print:mt-6">
                <div className="text-center">
                  <div className="border-t border-black pt-2 print:pt-1">
                    <p className="text-sm font-semibold print:text-xs">Potpis donosioca/vlasnika</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-black pt-2 print:pt-1">
                    <p className="text-sm font-semibold print:text-xs">Potpis servisera</p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="text-center mt-6 print:mt-4">
                <p className="text-sm print:text-xs">Datum: {new Date().toLocaleDateString("sr-RS")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 print:hidden">
            <Button
              onClick={generateTicket}
              disabled={!formData.imeIPrezime || !formData.modelUredjaja}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generiši Prijemni List
            </Button>

            <Button
              onClick={saveTicket}
              disabled={!formData.generated}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Sačuvaj u bazu
            </Button>

            <Button onClick={handlePrint} disabled={!formData.generated} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Štampaj
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (currentView === "existing-tickets") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header currentView={currentView} setCurrentView={setCurrentView} showBackButton={true} />

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Postojeći Tiketi</h2>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pretraži tikete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tickets Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Tiketa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ime Vlasnika
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model Uređaja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum Kreiranja
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTickets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Nema pronađenih tiketa
                        </td>
                      </tr>
                    ) : (
                      paginatedTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setCurrentView("ticket-detail")
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            #{ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.imeIPrezime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.modelUredjaja}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.datumKreiranja}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Prethodna
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Strana {currentPage} od {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Sledeća
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (currentView === "ticket-detail" && selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          showBackButton={true}
          showEditButton={!isEditMode}
          showDeleteButton={!isEditMode}
          showPrintButton={true}
          onEdit={startEdit}
          onDelete={() => setShowDeleteModal(true)}
          onPrint={handlePrint}
        />

        {/* Print-Optimized Receipt Layout */}
        <div className="hidden print:block print:text-black print:bg-white">
          <div className="print:p-4 print:min-h-0 print:h-auto print:flex print:flex-col">
            {/* Header Section with Logo and Info */}
            <div className="print:flex print:justify-between print:items-start print:border-b-2 print:border-black print:pb-3 print:mb-4">
              {/* Left side - Logo and Company Info */}
              <div className="print:flex print:items-start print:space-x-3">
                <div className="print:w-24 print:h-18 print:flex-shrink-0">
                  <img
                    src="/images/fcom-logo.png"
                    alt="F-COM Logo"
                    className="print:w-24 print:h-18 print:object-contain"
                  />
                </div>
                <div className="print:text-xs print:leading-tight">
                  <div className="print:font-bold print:text-sm">F-COM D.O.O.</div>
                  <div>Bulevar Zorana Đinđića 12D, lokal 36</div>
                  <div>11070 Novi Beograd</div>
                  <div>Tel: +381 11 313 28 27, +381 62 871 93 84</div>
                  <div>Email: office@f-com.co.rs</div>
                  <div>Žiro račun: 160-120801-65 (Banca Intesa)</div>
                  <div>Web: www.f-com.co.rs</div>
                </div>
              </div>

              {/* Right side - Document Title and Info */}
              <div className="print:text-right print:text-sm">
                <h1 className="print:text-xl print:font-bold print:mb-1">PRIJEMNI LIST</h1>
                <div className="print:font-bold">ID Tiketa: #{selectedTicket.id}</div>
                <div>Datum: {selectedTicket.datumKreiranja}</div>
              </div>
            </div>

            {/* New Form Layout with Black Headers */}
            <div className="print:mb-4">
              {/* First Row - Name and Date */}
              <div className="print:form-row">
                <div className="print:form-col">
                  <div className="print:form-header">Ime i Prezime</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.imeIPrezime}</div>
                </div>
                <div className="print:form-col">
                  <div className="print:form-header">Datum prijema uređaja</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.datumKreiranja}</div>
                </div>
              </div>

              {/* Second Row - Phone Numbers */}
              <div className="print:form-row">
                <div className="print:form-col">
                  <div className="print:form-header">Broj Telefona</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.brojMobilnog}</div>
                </div>
              </div>

              {/* Third Row - Device Info */}
              <div className="print:form-row">
                <div className="print:form-col">
                  <div className="print:form-header">Model uređaja</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.modelUredjaja}</div>
                </div>
                <div className="print:form-col">
                  <div className="print:form-header">Serijski broj</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.serijskiBroj}</div>
                </div>
              </div>

              {/* Fourth Row - Description (Full Width) */}
              <div className="print:form-row">
                <div className="print:form-col-full">
                  <div className="print:form-header">Opis Kvara</div>
                  <div className="print:form-content print:font-bold" style={{ minHeight: "20mm" }}>
                    {selectedTicket.opisKvara}
                  </div>
                </div>
              </div>

              {/* Fifth Row - Price and Anomalies */}
              <div className="print:form-row">
                <div className="print:form-col">
                  <div className="print:form-header">Procenjena cena popravke</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.procenjenaCena} RSD</div>
                </div>
                <div className="print:form-col">
                  <div className="print:form-header">Fizičke anomalije</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.fizickeAnomalije}</div>
                </div>
              </div>

              {/* Sixth Row - Previous Service and Equipment */}
              <div className="print:form-row">
                <div className="print:form-col">
                  <div className="print:form-header">Prethodni servis</div>
                  <div className="print:form-content print:font-bold">{selectedTicket.biouDrugomServisu}</div>
                </div>
                <div className="print:form-col">
                  <div className="print:form-header">Dodatna oprema</div>
                  <div className="print:form-content print:font-bold">
                    {selectedTicket.dodatnaOprema?.join(", ") || "Nema"}
                    {selectedTicket.dodatnoOstalo && ` (${selectedTicket.dodatnoOstalo})`}
                  </div>
                </div>
              </div>

              {/* Seventh Row - Service Agent */}
              <div className="print:form-row">
                <div className="print:form-col-full">
                  <div className="print:form-header">Primio na servis</div>
                  <div className="print:form-content print:font-bold">
                    {formatServiceAgent(selectedTicket.primioNaServis)}
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Section */}
            <div className="print:mb-3 print:text-sm">
              <div className="print:flex print:items-start print:space-x-2">
                <span className="print:text-lg">☑</span>
                <span>
                  Saglasan sam sa uslovima korišćenja usluga F-COM D.O.O. koji su dostupni na sajtu www.f-com.co.rs
                </span>
              </div>
            </div>

            {/* Signatures Section - Removed the overlapping element */}
            <div className="print:form-signatures">
              <div className="print:signature-line">
                <span className="print:text-sm print:font-semibold">Potpis vlasnika/donosioca</span>
              </div>
              <div className="print:signature-line">
                <span className="print:text-sm print:font-semibold">Potpis servisera</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Detail */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:px-8 print:py-4">
          <Card className="print:hidden print:shadow-none print:border-none">
            <CardHeader className="print:pb-2">
              <CardTitle className="print:hidden">
                {isEditMode ? `Izmeni Tiket #${selectedTicket.id}` : `Detalji Tiketa #${selectedTicket.id}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 print:space-y-2">
              {isEditMode ? (
                // Edit Mode - Editable Form
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-imeIPrezime" className="font-semibold">
                        Ime i prezime:
                      </Label>
                      <Input
                        id="edit-imeIPrezime"
                        value={editFormData.imeIPrezime || ""}
                        onChange={(e) => handleEditInputChange("imeIPrezime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-brojMobilnog" className="font-semibold">
                        Broj Telefona:
                      </Label>
                      <Input
                        id="edit-brojMobilnog"
                        value={editFormData.brojMobilnog || ""}
                        onChange={(e) => handleEditInputChange("brojMobilnog", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-modelUredjaja" className="font-semibold">
                        Model uređaja:
                      </Label>
                      <Input
                        id="edit-modelUredjaja"
                        value={editFormData.modelUredjaja || ""}
                        onChange={(e) => handleEditInputChange("modelUredjaja", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-serijskiBroj" className="font-semibold">
                      Serijski broj:
                    </Label>
                    <Input
                      id="edit-serijskiBroj"
                      value={editFormData.serijskiBroj || ""}
                      onChange={(e) => handleEditInputChange("serijskiBroj", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-opisKvara" className="font-semibold">
                      Opis kvara:
                    </Label>
                    <Textarea
                      id="edit-opisKvara"
                      value={editFormData.opisKvara || ""}
                      onChange={(e) => handleEditInputChange("opisKvara", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Bio u drugom servisu:</Label>
                    <RadioGroup
                      value={editFormData.biouDrugomServisu || ""}
                      onValueChange={(value) => handleEditInputChange("biouDrugomServisu", value)}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="da" id="edit-servis-da" />
                        <Label htmlFor="edit-servis-da">Da</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ne" id="edit-servis-ne" />
                        <Label htmlFor="edit-servis-ne">Ne</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ne-znam" id="edit-servis-ne-znam" />
                        <Label htmlFor="edit-servis-ne-znam">Ne znam</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {editFormData.biouDrugomServisu === "da" && (
                    <div>
                      <Label htmlFor="edit-tamojRadjeno" className="font-semibold">
                        Tamo je rađeno:
                      </Label>
                      <Input
                        id="edit-tamojRadjeno"
                        value={editFormData.tamojRadjeno || ""}
                        onChange={(e) => handleEditInputChange("tamojRadjeno", e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="edit-procenjenaCena" className="font-semibold">
                      Procenjena cena (RSD):
                    </Label>
                    <Input
                      id="edit-procenjenaCena"
                      value={editFormData.procenjenaCena || ""}
                      onChange={(e) => handleEditInputChange("procenjenaCena", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Fizičke anomalije:</Label>
                    <RadioGroup
                      value={editFormData.fizickeAnomalije || ""}
                      onValueChange={(value) => handleEditInputChange("fizickeAnomalije", value)}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="da" id="edit-anomalije-da" />
                        <Label htmlFor="edit-anomalije-da">Da</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ne" id="edit-anomalije-ne" />
                        <Label htmlFor="edit-anomalije-ne">Ne</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="font-semibold">Dodata oprema:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {["Punjač", "Torba", "Baterija", "Dodatno"].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-oprema-${item}`}
                            checked={editFormData.dodatnaOprema?.includes(item) || false}
                            onCheckedChange={(checked: boolean) => handleEditEquipmentChange(item, checked)}
                          />
                          <Label htmlFor={`edit-oprema-${item}`}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {editFormData.dodatnaOprema?.includes("Dodatno") && (
                    <div>
                      <Label htmlFor="edit-dodatnoOstalo" className="font-semibold">
                        Specificirati dodatno:
                      </Label>
                      <Input
                        id="edit-dodatnoOstalo"
                        value={editFormData.dodatnoOstalo || ""}
                        onChange={(e) => handleEditInputChange("dodatnoOstalo", e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="edit-primioNaServis" className="font-semibold">
                      Primio na servis:
                    </Label>
                    <Select
                      value={editFormData.primioNaServis || ""}
                      onValueChange={(value) => handleEditInputChange("primioNaServis", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andrej-filipov">Andrej Filipov</SelectItem>
                        <SelectItem value="jegor-filipov">Jegor Filipov</SelectItem>
                        <SelectItem value="mita-filipov">Mita Filipov</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image Upload Section for Edit Mode */}
                  <div>
                    <Label className="font-semibold">Slike (samo za interni pregled):</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-4"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Dodaj slike
                      </Button>

                      {/* Display uploaded images */}
                      {editFormData.images && editFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {editFormData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Slika ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border cursor-pointer"
                                onClick={() => viewImage(image)}
                              />
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteImage(index)
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                    <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Sačuvaj izmene
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="border-gray-600 text-gray-600 hover:bg-gray-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Otkaži izmene
                    </Button>
                  </div>
                </>
              ) : (
                // View Mode - Read-only Display
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                    <div>
                      <Label className="font-semibold print:text-sm">Ime i prezime:</Label>
                      <p className="font-bold print:border-b print:border-black print:pb-1">
                        <span className="font-bold">{selectedTicket.imeIPrezime}</span>
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold print:text-sm">Broj Telefona:</Label>
                      <p className="font-bold print:border-b print:border-black print:pb-1">
                        <span className="font-bold">{selectedTicket.brojMobilnog}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                    <div>
                      <Label className="font-semibold print:text-sm">Model uređaja:</Label>
                      <p className="font-bold print:border-b print:border-black print:pb-1">
                        <span className="font-bold">{selectedTicket.modelUredjaja}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Serijski broj:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.serijskiBroj}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Opis kvara:</Label>
                    <p className="font-bold print:border print:border-black print:p-2 print:min-h-[60px]">
                      <span className="font-bold">{selectedTicket.opisKvara}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Bio u drugom servisu:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.biouDrugomServisu}</span>
                    </p>
                  </div>

                  {selectedTicket.tamojRadjeno && (
                    <div>
                      <Label className="font-semibold print:text-sm">Tamo je rađeno:</Label>
                      <p className="font-bold print:border-b print:border-black print:pb-1">
                        <span className="font-bold">{selectedTicket.tamojRadjeno}</span>
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="font-semibold print:text-sm">Procenjena cena (RSD):</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.procenjenaCena}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Fizičke anomalije:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.fizickeAnomalije}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Dodata oprema:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      {selectedTicket.dodatnaOprema?.join(", ") || "Nema"}
                      {selectedTicket.dodatnoOstalo && ` (${selectedTicket.dodatnoOstalo})`}
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Primio na servis:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{formatServiceAgent(selectedTicket.primioNaServis)}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="font-semibold print:text-sm">Datum kreiranja:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.datumKreiranja}</span>
                    </p>
                  </div>

                  {/* Image Upload Section for View Mode */}
                  <div>
                    <Label className="font-semibold">Slike (samo za interni pregled):</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-4"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Dodaj slike
                      </Button>

                      {/* Display uploaded images */}
                      {selectedTicket.images && selectedTicket.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedTicket.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Slika ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border cursor-pointer"
                                onClick={() => viewImage(image)}
                              />
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteImage(index)
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms of Service */}
                  <div className="print:mt-4">
                    <Label className="font-semibold print:text-sm">Uslovi korišćenja servisa:</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm print:bg-white print:p-0 print:text-xs">
                      <pre className="whitespace-pre-wrap font-sans">{termsOfService}</pre>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 print:gap-4 print:mt-6">
                    <div className="text-center">
                      <div className="border-t border-black pt-2 print:pt-1">
                        <p className="text-sm font-semibold print:text-xs">Potpis donosioca/vlasnika</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-black pt-2 print:pt-1">
                        <p className="text-sm font-semibold print:text-xs">Potpis servisera</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Da li ste sigurni?</h3>
                <p className="text-gray-600 mb-6">
                  Ova akcija će trajno obrisati tiket #{selectedTicket.id}. Ovo ne može biti vraćeno.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Otkaži
                  </Button>
                  <Button onClick={deleteTicket} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    Obriši zauvek
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Uvećana slika"
                className="max-w-full max-h-full object-contain"
              />
              <Button
                onClick={() => {
                  setShowImageModal(false)
                  setSelectedImage(null)
                }}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
