"use client"

import { useState, useEffect } from "react"
import type { EqualizerSettings } from "@/components/music-player/types"

export const useEqualizer = () => {
  const [settings, setSettings] = useState<EqualizerSettings>({
    bass: 0,
    mid: 0,
    treble: 0,
    customBands: [0, 0, 0, 0, 0],
  })

  useEffect(() => {
    // Cargar configuración guardada
    const savedSettings = localStorage.getItem("equalizerSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading equalizer settings:", error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<EqualizerSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem("equalizerSettings", JSON.stringify(updated))
      return updated
    })
  }

  return {
    settings,
    updateSettings,
  }
}
