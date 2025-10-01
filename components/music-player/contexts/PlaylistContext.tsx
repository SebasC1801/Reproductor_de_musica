"use client"

import type React from "react"
import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import type { Playlist, Track } from "@/components/music-player/types"

// Contexto global para tracks
interface TracksContextType {
  tracks: Track[]
  addTracks: (newTracks: Track[]) => void
  removeTrack: (trackId: string) => void
  updateTrack: (trackId: string, updates: Partial<Track>) => void
  getTrack: (trackId: string) => Track | undefined
}

const TracksContext = createContext<TracksContextType | undefined>(undefined)

export const TracksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([])

  // Cargar tracks guardados al iniciar
  useEffect(() => {
    const savedTracks = localStorage.getItem("userTracks")
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks)
        const cleanedTracks = parsedTracks.filter(
          (track: Track) => !track.id.startsWith("youtube-") || track.source === "itunes",
        )
        setTracks(cleanedTracks)
        // Guardar la versión limpia
        if (cleanedTracks.length !== parsedTracks.length) {
          localStorage.setItem("userTracks", JSON.stringify(cleanedTracks))
        }
      } catch (error) {
        console.error("Error loading saved tracks:", error)
      }
    }
  }, [])

  // Guardar tracks cuando cambian
  useEffect(() => {
    try {
      // Solo guardar metadatos básicos, no los object URLs que se pierden
      const tracksToSave = tracks.map((track) => ({
        ...track,
        preview_url: track.source === "local" ? undefined : track.preview_url,
      }))
      localStorage.setItem("userTracks", JSON.stringify(tracksToSave))
    } catch (error) {
      console.error("Error saving tracks:", error)
    }
  }, [tracks])

  const addTracks = (newTracks: Track[]) => {
    setTracks((prev) => {
      // Evitar duplicados por ID
      const existingIds = new Set(prev.map((t) => t.id))
      const uniqueNewTracks = newTracks.filter((t) => !existingIds.has(t.id))
      return [...uniqueNewTracks, ...prev]
    })
  }

  const removeTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((track) => track.id !== trackId))
  }

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setTracks((prev) => prev.map((track) => (track.id === trackId ? { ...track, ...updates } : track)))
  }

  const getTrack = (trackId: string) => {
    return tracks.find((track) => track.id === trackId)
  }

  return (
    <TracksContext.Provider value={{ tracks, addTracks, removeTrack, updateTrack, getTrack }}>
      {children}
    </TracksContext.Provider>
  )
}

export const useTracksContext = (): TracksContextType => {
  const context = useContext(TracksContext)
  if (!context) {
    throw new Error("useTracksContext must be used within a TracksProvider")
  }
  return context
}

interface PlaylistContextType {
  playlists: Playlist[]
  createPlaylist: (name: string, description: string) => void
  addToPlaylist: (playlistId: string, track: Track) => void
  removeFromPlaylist: (playlistId: string, trackId: string) => void
  deletePlaylist: (playlistId: string) => void
  getPlaylist: (playlistId: string) => Playlist | undefined
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

interface PlaylistProviderProps {
  children: ReactNode
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [tracks, setTracks] = useState<Track[]>([])

  // Cargar tracks disponibles
  useEffect(() => {
    const savedTracks = localStorage.getItem("userTracks")
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks)
        setTracks(parsedTracks)
      } catch (error) {
        console.error("Error loading tracks:", error)
      }
    }
  }, [])

  // Cargar playlists guardadas al iniciar y sincronizar con tracks disponibles
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists")
    if (savedPlaylists) {
      try {
        const parsed = JSON.parse(savedPlaylists)
        const syncedPlaylists = parsed.map((playlist: Playlist) => ({
          ...playlist,
          tracks: playlist.tracks
            .filter(
              (playlistTrack: Track) => !playlistTrack.id.startsWith("youtube-") || playlistTrack.source === "itunes",
            )
            .map((playlistTrack: Track) => {
              const currentTrack = tracks.find((t) => t.id === playlistTrack.id)
              return (
                currentTrack || {
                  ...playlistTrack,
                  preview_url: playlistTrack.source === "local" ? undefined : playlistTrack.preview_url,
                }
              )
            }),
        }))
        setPlaylists(syncedPlaylists)
        // Guardar la versión limpia
        localStorage.setItem("playlists", JSON.stringify(syncedPlaylists))
      } catch (error) {
        console.error("Error loading playlists:", error)
      }
    }
  }, [tracks])

  // Guardar playlists cuando cambien
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists))
  }, [playlists])

  const createPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      tracks: [],
      created_at: new Date(),
    }
    setPlaylists((prev) => [...prev, newPlaylist])
  }

  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, tracks: [...playlist.tracks, track] } : playlist,
      ),
    )
  }

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, tracks: playlist.tracks.filter((track) => track.id !== trackId) }
          : playlist,
      ),
    )
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId))
  }

  const getPlaylist = (playlistId: string) => {
    return playlists.find((playlist) => playlist.id === playlistId)
  }

  const contextValue = {
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    getPlaylist,
  }

  return <PlaylistContext.Provider value={contextValue}>{children}</PlaylistContext.Provider>
}

export const usePlaylistContext = (): PlaylistContextType => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error("usePlaylistContext must be used within a PlaylistProvider")
  }
  return context
}
