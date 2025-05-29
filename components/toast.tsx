"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  type: "success" | "error"
  title: string
  subtitle: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ type, title, subtitle, isVisible, onClose, duration = 3500 }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for fade out animation
  }

  if (!isVisible) return null

  const Icon = type === "success" ? CheckCircle : AlertCircle
  const iconColor = type === "success" ? "text-green-500" : "text-red-500"
  const borderColor = type === "success" ? "border-l-green-500" : "border-l-red-500"

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm w-full sm:max-w-md",
        "transform transition-all duration-300 ease-in-out",
        isAnimating ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95",
      )}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg border-l-4 p-4",
          "flex items-start space-x-3",
          "border border-gray-200",
          borderColor,
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{subtitle}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Zatvori obaveštenje"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
