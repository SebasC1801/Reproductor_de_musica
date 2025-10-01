"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Track } from "@/components/music-player/types"

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [queue, setQueue] = useState<Track[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      nextTrack()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const playTrack = useCallback((track: Track) => {
    console.log("🎵 useAudioPlayer: Playing track", track.name, "source:", track.source)
    setCurrentTrack(track)
    setIsPlaying(true)
    setCurrentTime(0)

    if (audioRef.current && track.preview_url) {
      audioRef.current.src = track.preview_url
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
        setIsPlaying(true)
      }
    }
  }, [isPlaying])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error resuming audio:", error)
      })
      setIsPlaying(true)
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const [nextTrack, ...remainingQueue] = queue
      playTrack(nextTrack)
      setQueue(remainingQueue)
    }
  }, [queue, playTrack])

  const previousTrack = useCallback(() => {
    console.log("Previous track")
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track])
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  const updateEqualizerSettings = useCallback((settings: any) => {
    console.log("Equalizer settings updated:", settings)
  }, [])

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    playTrack,
    togglePlayPause,
    pause,
    resume,
    setVolume,
    seekTo,
    nextTrack,
    previousTrack,
    addToQueue,
    clearQueue,
    updateEqualizerSettings,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  }
}
