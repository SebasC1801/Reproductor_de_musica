"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Search, Clock, Heart } from "lucide-react"
import type { Track } from "@/components/music-player/types"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import { useTracksContext } from "@/components/music-player/contexts/PlaylistContext"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"
import { searchItunes } from "@/components/music-player/services/itunesService"

const SearchContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, #0f172a 300px);
`

const SearchHeader = styled.div`
  margin-bottom: 32px;
`

const SearchTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #06b6d4, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`

const ResultsSection = styled.div`
  margin-top: 32px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #f1f5f9;
  margin-bottom: 24px;
`

const TracksTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 100px;
  gap: 16px;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(160, 160, 170, 0.2);
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TrackRow = styled.div<{ $isPlaying?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 100px;
  gap: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isPlaying ? "rgba(6, 182, 212, 0.15)" : "transparent")};

  &:hover {
    background: rgba(6, 182, 212, 0.12);
    transform: translateX(2px);
  }

  &:active {
    transform: scale(0.99);
  }
`

const TrackNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
`

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TrackThumbnail = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const TrackName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackArtist = styled.div`
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackAlbum = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  font-size: 14px;
  color: #94a3b8;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 16px;
`

interface SearchPageProps {
  searchQuery: string
}

const SearchPage: React.FC<SearchPageProps> = ({ searchQuery }) => {
  const [results, setResults] = useState<Track[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const audioPlayer = useAudioPlayerContext()
  const { tracks, addTracks } = useTracksContext()

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const savedLikes = localStorage.getItem("likedTracks")
    if (savedLikes) {
      try {
        const parsed = JSON.parse(savedLikes)
        setLikedTracks(new Set(parsed))
      } catch (error) {
        console.error("Error loading liked tracks:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!searchQuery.trim()) {
      setResults([])
      setSearching(false)
      setError(null)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      console.log("[v0] Iniciando búsqueda para:", searchQuery)
      setSearching(true)
      setError(null)

      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      try {
        const localResults = tracks.filter(
          (track: Track) =>
            track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.album.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        console.log("[v0] Resultados locales:", localResults.length)

        let remoteResults: Track[] = []
        try {
          const itunesTracks = await searchItunes(searchQuery)

          if (signal.aborted) {
            console.log("[v0] Búsqueda cancelada")
            return
          }

          console.log("[v0] Resultados de iTunes:", itunesTracks.length)

          remoteResults = itunesTracks.map((track) => ({
            id: track.id,
            name: track.name,
            title: track.name,
            artist: track.artist,
            album: track.album,
            duration: track.duration,
            thumbnail: track.thumbnail,
            image_url: track.thumbnail,
            preview_url: track.preview_url,
            source: "itunes" as const,
            genre: track.genre,
            releaseDate: track.releaseDate,
          }))
        } catch (itunesError: any) {
          if (itunesError.name === "AbortError" || signal.aborted) {
            console.log("[v0] Búsqueda de iTunes cancelada")
            return
          }
          console.error("[v0] Error en iTunes API:", itunesError)
        }

        if (signal.aborted) {
          return
        }

        const combinedResults = [...localResults, ...remoteResults]
        const uniqueResults = Array.from(new Map(combinedResults.map((track) => [track.id, track])).values())

        console.log("[v0] Total de resultados únicos:", uniqueResults.length)

        setResults(uniqueResults)

        if (remoteResults.length > 0) {
          addTracks(remoteResults)
        }

        if (uniqueResults.length === 0) {
          setError("No se encontraron resultados para tu búsqueda")
        }
      } catch (error: any) {
        if (error.name === "AbortError" || signal.aborted) {
          return
        }

        console.error("[v0] Error general en la búsqueda:", error)
        setError("Hubo un problema con la búsqueda. Intenta nuevamente.")

        const localResults = tracks.filter(
          (track: Track) =>
            track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.album.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setResults(localResults)
      } finally {
        setSearching(false)
      }
    }, 800)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchQuery.trim() && results.length > 0) {
      const localResults = tracks.filter(
        (track: Track) =>
          track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      if (localResults.length > results.filter((r) => r.source !== "itunes").length) {
        const itunesResults = results.filter((r) => r.source === "itunes")
        const combinedResults = [...localResults, ...itunesResults]
        const uniqueResults = Array.from(new Map(combinedResults.map((track) => [track.id, track])).values())
        setResults(uniqueResults)
      }
    }
  }, [tracks])

  const handlePlayTrack = (track: Track) => {
    audioPlayer.playTrack(track)
  }

  const handleLikeTrack = (trackId: string) => {
    setLikedTracks((prev) => {
      const newLikes = new Set(prev)
      if (newLikes.has(trackId)) {
        newLikes.delete(trackId)
      } else {
        newLikes.add(trackId)
      }
      localStorage.setItem("likedTracks", JSON.stringify(Array.from(newLikes)))
      return newLikes
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Resultados de búsqueda</SearchTitle>
        {searchQuery && <p style={{ color: "#94a3b8", fontSize: "16px" }}>Buscando: "{searchQuery}"</p>}
        {error && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              color: "#fca5a5",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
      </SearchHeader>

      {searching ? (
        <LoadingState>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(6, 182, 212, 0.3)",
                borderTop: "3px solid #06b6d4",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p>Buscando música...</p>
          </div>
        </LoadingState>
      ) : results.length > 0 ? (
        <ResultsSection>
          <SectionTitle>Canciones ({results.length})</SectionTitle>
          <TracksTable>
            <TableHeader>
              <div>#</div>
              <div>Título</div>
              <div>Álbum</div>
              <div>
                <Clock size={16} />
              </div>
            </TableHeader>

            {results.map((track, index) => (
              <TrackRow
                key={`search-${track.id}-${index}`}
                $isPlaying={audioPlayer.currentTrack?.id === track.id}
                onClick={() => handlePlayTrack(track)}
              >
                <TrackNumber>{index + 1}</TrackNumber>
                <TrackInfo>
                  <TrackThumbnail>
                    {track.thumbnail || track.image_url ? (
                      <img src={track.thumbnail || track.image_url} alt={track.name} />
                    ) : (
                      <DefaultMusicIcon />
                    )}
                  </TrackThumbnail>
                  <TrackDetails>
                    <TrackName>{track.name}</TrackName>
                    <TrackArtist>{track.artist}</TrackArtist>
                  </TrackDetails>
                </TrackInfo>
                <TrackAlbum>{track.album}</TrackAlbum>
                <TrackDuration>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLikeTrack(track.id)
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: likedTracks.has(track.id) ? "#06b6d4" : "#94a3b8",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                  >
                    <Heart size={16} fill={likedTracks.has(track.id) ? "#06b6d4" : "none"} />
                  </button>
                  {formatDuration(track.duration)}
                </TrackDuration>
              </TrackRow>
            ))}
          </TracksTable>
        </ResultsSection>
      ) : (
        <EmptyState>
          <Search size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <p style={{ fontSize: "18px", marginBottom: "8px" }}>
            {searchQuery ? "No se encontraron resultados" : "Escribe algo para buscar"}
          </p>
          <p style={{ fontSize: "14px" }}>Intenta buscar por nombre de canción, artista o álbum</p>
        </EmptyState>
      )}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </SearchContainer>
  )
}

export default SearchPage
