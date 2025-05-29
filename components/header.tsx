"use client"

import { Button } from "@/components/ui/button"
import type { Dispatch, SetStateAction } from "react"

type ViewType = "dashboard" | "new-ticket" | "existing-tickets" | "ticket-detail"

interface HeaderProps {
  currentView: ViewType
  setCurrentView: Dispatch<SetStateAction<ViewType>>
  showBackButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  showPrintButton?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onPrint?: () => void
}

export default function Header({
  currentView,
  setCurrentView,
  showBackButton = false,
  showEditButton = false,
  showDeleteButton = false,
  showPrintButton = false,
  onEdit,
  onDelete,
  onPrint,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-auto cursor-pointer" onClick={() => setCurrentView("dashboard")}>
              <img src="/images/fcom-logo.png" alt="F-COM Logo" className="h-full w-auto object-contain" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
              F-COM Prijemni Listovi
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                onClick={() => setCurrentView(currentView === "ticket-detail" ? "existing-tickets" : "dashboard")}
                variant="outline"
                size="sm"
              >
                Nazad
              </Button>
            )}
            {showEditButton && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Izmeni
              </Button>
            )}
            {showDeleteButton && (
              <Button
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Obriši tiket
              </Button>
            )}
            {showPrintButton && (
              <Button onClick={onPrint} variant="outline" size="sm">
                Štampaj
              </Button>
            )}
            <div className="text-xs text-gray-500">Developed by Andrej Filipov</div>
          </div>
        </div>
      </div>
    </header>
  )
}