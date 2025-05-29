"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Toast, type ToastProps } from "./toast"

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, "isVisible" | "onClose">) => void
  showSuccess: (title?: string, subtitle?: string) => void
  showError: (title?: string, subtitle?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [currentToast, setCurrentToast] = useState<Omit<ToastProps, "isVisible" | "onClose"> | null>(null)

  const showToast = (toast: Omit<ToastProps, "isVisible" | "onClose">) => {
    // Close any existing toast first
    setCurrentToast(null)

    // Small delay to ensure previous toast is cleared
    setTimeout(() => {
      setCurrentToast(toast)
    }, 50)
  }

  const showSuccess = (title = "Uspešno sačuvano", subtitle = "Prijemni list je dodat u bazu podataka.") => {
    showToast({
      type: "success",
      title,
      subtitle,
    })
  }

  const showError = (title = "Greška pri čuvanju", subtitle = "Došlo je do greške. Pokušajte ponovo.") => {
    showToast({
      type: "error",
      title,
      subtitle,
    })
  }

  const closeToast = () => {
    setCurrentToast(null)
  }

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}
      {currentToast && <Toast {...currentToast} isVisible={true} onClose={closeToast} />}
    </ToastContext.Provider>
  )
}
