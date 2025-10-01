export interface Track {
  id: string
  name: string
  artist: string
  album: string
  duration: number
  image_url?: string
  preview_url?: string
  source?: "itunes" | "local"
  thumbnail?: string
  title?: string
  genre?: string
  releaseDate?: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  tracks: Track[]
  created_at: Date
}

export interface User {
  id: string
  name: string
  email: string
  image_url?: string
}

export interface EqualizerSettings {
  bass: number
  mid: number
  treble: number
  customBands: number[]
}

export interface AudioSettings {
  volume: number
  quality: "low" | "medium" | "high"
  equalizer: EqualizerSettings
}

export type PageType = "home" | "search" | "library" | "playlist" | "settings"
