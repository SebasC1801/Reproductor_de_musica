export interface iTunesTrack {
  id: string
  name: string
  artist: string
  album: string
  duration: number
  thumbnail: string
  preview_url: string
  genre?: string
  releaseDate?: string
}

export async function searchItunes(query: string): Promise<iTunesTrack[]> {
  try {
    const response = await fetch(`/api/itunes/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Failed to search iTunes")
    }

    const data = await response.json()
    return data.tracks || []
  } catch (error) {
    console.error("Error searching iTunes:", error)
    return []
  }
}
