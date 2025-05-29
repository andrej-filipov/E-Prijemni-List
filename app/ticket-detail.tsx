"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Printer, Edit, Trash2, X, Upload, Trash, Save } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TicketDetailProps {
  selectedTicket: any
  isEditMode: boolean
  editFormData: any
  handleEditInputChange: (field: string, value: string | string[]) => void
  handleEditEquipmentChange: (equipment: string, checked: boolean) => void
  saveChanges: () => void
  cancelEdit: () => void
  handlePrint: () => void
  startEdit: () => void
  setShowDeleteModal: (show: boolean) => void
  setCurrentView: (view: string) => void
  formatServiceAgent: (agent: string) => string
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  deleteImage: (index: number) => void
  viewImage: (image: string) => void
  termsOfService: string
}

export default function TicketDetail({
  selectedTicket,
  isEditMode,
  editFormData,
  handleEditInputChange,
  handleEditEquipmentChange,
  saveChanges,
  cancelEdit,
  handlePrint,
  startEdit,
  setShowDeleteModal,
  setCurrentView,
  formatServiceAgent,
  fileInputRef,
  handleImageUpload,
  deleteImage,
  viewImage,
  termsOfService,
}: TicketDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">F-COM Prijemni Listovi</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditMode && (
                <>
                  <Button
                    onClick={startEdit}
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Izmeni
                  </Button>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Obriši tiket
                  </Button>
                </>
              )}
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Štampaj
              </Button>
              <Button onClick={() => setCurrentView("existing-tickets")} variant="outline" size="sm">
                Nazad
              </Button>
              <div className="text-xs text-gray-500">Developed by Andrej Filipov</div>
            </div>
          </div>
        </div>
      </header>

      {/* Print-Optimized Receipt Layout */}
      <div className="hidden print:block print:text-black print:bg-white">
        <div className="print:p-4 print:h-screen print:flex print:flex-col print:space-y-2">
          {/* Header with Logo and Company Info */}
          <div className="print:flex print:justify-between print:items-start print:mb-4">
            {/* Left side - Logo and Company Info */}
            <div className="print:flex print:items-start print:space-x-3">
              <div className="print:w-16 print:h-16 print:flex-shrink-0">
                <img src="/images/fcom-logo.png" alt="F-COM Logo" className="print:w-16 print:h-16" />
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

          {/* Card-style layout for customer information */}
          <div className="print:grid print:grid-cols-2 print:gap-2">
            <div className="print:card">
              <div className="print:card-header">Ime i Prezime</div>
              <div className="print:card-content print:font-bold">{selectedTicket.imeIPrezime}</div>
            </div>

            <div className="print:card">
              <div className="print:card-header">Datum prijema</div>
              <div className="print:card-content print:font-bold">{selectedTicket.datumKreiranja}</div>
            </div>
          </div>

          <div className="print:grid print:grid-cols-2 print:gap-2">
            <div className="print:card">
              <div className="print:card-header">Mobilni telefon</div>
              <div className="print:card-content print:font-bold">{selectedTicket.brojMobilnog}</div>
            </div>

            <div className="print:card">
              <div className="print:card-header">Fiksni telefon</div>
              <div className="print:card-content print:font-bold">{selectedTicket.brojFiksnog || "N/A"}</div>
            </div>
          </div>

          <div className="print:grid print:grid-cols-2 print:gap-2">
            <div className="print:card">
              <div className="print:card-header">Model uređaja</div>
              <div className="print:card-content print:font-bold">{selectedTicket.modelUredjaja}</div>
            </div>

            <div className="print:card">
              <div className="print:card-header">Serijski broj</div>
              <div className="print:card-content print:font-bold">{selectedTicket.serijskiBroj}</div>
            </div>
          </div>

          {/* Full-width card for description */}
          <div className="print:card">
            <div className="print:card-header">Opis kvara</div>
            <div className="print:card-content print:font-bold">{selectedTicket.opisKvara}</div>
          </div>

          <div className="print:grid print:grid-cols-2 print:gap-2">
            <div className="print:card">
              <div className="print:card-header">Procenjena cena popravke</div>
              <div className="print:card-content print:font-bold">{selectedTicket.procenjenaCena} RSD</div>
            </div>

            <div className="print:card">
              <div className="print:card-header">Fizičke anomalije</div>
              <div className="print:card-content print:font-bold">{selectedTicket.fizickeAnomalije}</div>
            </div>
          </div>

          <div className="print:grid print:grid-cols-2 print:gap-2">
            <div className="print:card">
              <div className="print:card-header">Prethodni servis</div>
              <div className="print:card-content print:font-bold">{selectedTicket.biouDrugomServisu}</div>
            </div>

            <div className="print:card">
              <div className="print:card-header">Dodatna oprema</div>
              <div className="print:card-content print:font-bold">
                {selectedTicket.dodatnaOprema?.join(", ") || "Nema"}
                {selectedTicket.dodatnoOstalo && ` (${selectedTicket.dodatnoOstalo})`}
              </div>
            </div>
          </div>

          <div className="print:card">
            <div className="print:card-header">Primio na servis</div>
            <div className="print:card-content print:font-bold">
              {formatServiceAgent(selectedTicket.primioNaServis)}
            </div>
          </div>

          {/* Agreement Section */}
          <div className="print:mb-2 print:text-sm">
            <div className="print:flex print:items-start print:space-x-2">
              <span className="print:text-lg">☑</span>
              <span>
                Saglasan sam sa uslovima korišćenja usluga F-COM D.O.O. koji su dostupni na sajtu www.f-com.co.rs
              </span>
            </div>
          </div>

          {/* Signatures Section - Positioned directly after content */}
          <div className="print:grid print:grid-cols-2 print:gap-8 print:mt-4">
            <div className="print:text-center">
              <div className="print:border-t print:border-black print:pt-2">
                <span className="print:text-sm print:font-semibold">Potpis vlasnika/donosioca</span>
              </div>
            </div>
            <div className="print:text-center">
              <div className="print:border-t print:border-black print:pt-2">
                <span className="print:text-sm print:font-semibold">Potpis servisera</span>
              </div>
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
                      Broj mobilnog:
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
                    <Label htmlFor="edit-brojFiksnog" className="font-semibold">
                      Broj fiksnog:
                    </Label>
                    <Input
                      id="edit-brojFiksnog"
                      value={editFormData.brojFiksnog || ""}
                      onChange={(e) => handleEditInputChange("brojFiksnog", e.target.value)}
                    />
                  </div>
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
                          onCheckedChange={(checked) => handleEditEquipmentChange(item, Boolean(checked))}
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
                        {editFormData.images.map((image: string, index: number) => (
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
                    <Label className="font-semibold print:text-sm">Broj mobilnog:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.brojMobilnog}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                  <div>
                    <Label className="font-semibold print:text-sm">Broj fiksnog:</Label>
                    <p className="font-bold print:border-b print:border-black print:pb-1">
                      <span className="font-bold">{selectedTicket.brojFiksnog || "N/A"}</span>
                    </p>
                  </div>
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
                        {selectedTicket.images.map((image: string, index: number) => (
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
    </div>
  )
}
