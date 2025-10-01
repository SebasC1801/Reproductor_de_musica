"use client"

import type React from "react"
import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { useAudioPlayer } from "@/components/music-player/hooks/useAudioPlayer"
import type { AudioSettings } from "@/components/music-player/types"

interface AudioPlayerContextType {
  currentTrack: any
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playTrack: (track: any) => void
  togglePlayPause: () => void
  pause: () => void
  resume: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  nextTrack: () => void
  previousTrack: () => void
  queue: any[]
  addToQueue: (track: any) => void
  clearQueue: () => void
  audioSettings: AudioSettings
  updateAudioSettings: (settings: Partial<AudioSettings>) => void
  updateEqualizerSettings: (settings: any) => void
  shuffleMode: boolean
  repeatMode: boolean
  toggleShuffle: () => void
  toggleRepeat: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

interface AudioPlayerProviderProps {
  children: ReactNode
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayer = useAudioPlayer()
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    volume: 80,
    quality: "high",
    equalizer: {
      bass: 0,
      mid: 0,
      treble: 0,
      customBands: [0, 0, 0, 0, 0],
    },
  })
  const [shuffleMode, setShuffleMode] = useState(false)
  const [repeatMode, setRepeatMode] = useState(false)

  // Cargar ajustes guardados al iniciar
  useEffect(() => {
    const savedSettings = localStorage.getItem("audioSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setAudioSettings(parsed)
      } catch (error) {
        console.error("Error loading audio settings:", error)
      }
    }
  }, [])

  const updateAudioSettings = (settings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => {
      const newSettings = { ...prev, ...settings }
      localStorage.setItem("audioSettings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const updateEqualizerSettings = (settings: any) => {
    // Actualizar el ecualizador en el hook
    audioPlayer.updateEqualizerSettings(settings)

    // Actualizar también en audioSettings
    updateAudioSettings({ equalizer: settings })
  }

  const toggleShuffle = () => {
    setShuffleMode((prev) => !prev)
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) => !prev)
  }

  const contextValue = {
    ...audioPlayer,
    audioSettings,
    updateAudioSettings,
    updateEqualizerSettings,
    shuffleMode,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
  }

  return <AudioPlayerContext.Provider value={contextValue}>{children}</AudioPlayerContext.Provider>
}

export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider")
  }
  return context
}
