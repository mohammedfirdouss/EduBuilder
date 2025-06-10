"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CustomContent {
  id: string
  title: string
  category: string
  gradeLevel: string
  description: string
  explanation: string
  imageUrl?: string
  questions: Array<{
    id: string
    text: string
    options: string[]
    correctAnswer: number
    difficulty: "easy" | "medium" | "hard"
    explanation?: string
  }>
  customData?: any
}

interface CustomizationContextType {
  customContent: CustomContent[]
  addCustomContent: (content: CustomContent) => void
  updateCustomContent: (id: string, content: Partial<CustomContent>) => void
  deleteCustomContent: (id: string) => void
  getCustomContent: (id: string) => CustomContent | undefined
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined)

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [customContent, setCustomContent] = useState<CustomContent[]>([])

  // Load custom content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("edubuilder-custom-content")
    if (saved) {
      try {
        setCustomContent(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading custom content:", error)
      }
    }
  }, [])

  // Save to localStorage whenever customContent changes
  useEffect(() => {
    localStorage.setItem("edubuilder-custom-content", JSON.stringify(customContent))
  }, [customContent])

  const addCustomContent = (content: CustomContent) => {
    setCustomContent((prev) => [...prev, content])
  }

  const updateCustomContent = (id: string, updates: Partial<CustomContent>) => {
    setCustomContent((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteCustomContent = (id: string) => {
    setCustomContent((prev) => prev.filter((item) => item.id !== id))
  }

  const getCustomContent = (id: string) => {
    return customContent.find((item) => item.id === id)
  }

  return (
    <CustomizationContext.Provider
      value={{
        customContent,
        addCustomContent,
        updateCustomContent,
        deleteCustomContent,
        getCustomContent,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  )
}

export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (context === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider")
  }
  return context
}
