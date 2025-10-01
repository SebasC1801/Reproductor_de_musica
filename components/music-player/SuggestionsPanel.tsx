"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { Play, Plus, Heart } from "lucide-react"
import type { Track } from "@/components/music-player/types"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"

const SuggestionsContainer = styled.div`
  width: 300px;
  height: 100%;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(78, 205, 196, 0.3);
  padding: 20px;
  overflow-y: auto;
`

const SuggestionsTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: center;
`

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.5);
    transform: translateX(4px);
  }
`

const SuggestionImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`

const SuggestionInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SuggestionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SuggestionArtist = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SuggestionActions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(78, 205, 196, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(78, 205, 196, 1);
    transform: scale(1.1);
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`

interface SuggestionsPanelProps {
  currentTrack: Track | null
  onPlayTrack: (track: Track) => void
  availableTracks?: Track[]
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ currentTrack, onPlayTrack, availableTracks = [] }) => {
  const [suggestions, setSuggestions] = useState<Track[]>([])

  // Generar sugerencias basadas en las canciones disponibles
  useEffect(() => {
    if (availableTracks.length > 0) {
      const filteredSuggestions = availableTracks.filter((track: Track) => track.id !== currentTrack?.id).slice(0, 8)
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [currentTrack, availableTracks])

  const handlePlaySuggestion = (track: Track) => {
    onPlayTrack(track)
  }

  const handleAddToQueue = (track: Track) => {
    console.log("Agregando a cola:", track.name)
    // Aquí implementarías la lógica para agregar a la cola
  }

  const handleLikeTrack = (track: Track) => {
    console.log("Me gusta:", track.name)
    // Aquí implementarías la lógica de favoritos
  }

  if (suggestions.length === 0) {
    return (
      <SuggestionsContainer>
        <SuggestionsTitle>🎵 Sugerencias</SuggestionsTitle>
        <LoadingSpinner>Agrega canciones para ver sugerencias</LoadingSpinner>
      </SuggestionsContainer>
    )
  }

  return (
    <SuggestionsContainer>
      <SuggestionsTitle>🎵 Sugerencias</SuggestionsTitle>

      {suggestions.map((track) => (
        <SuggestionItem key={track.id} onClick={() => handlePlaySuggestion(track)}>
          <div className="suggestion-image">
            {track.image_url ? (
              <SuggestionImage
                src={track.image_url}
                alt={track.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/default-album.png"
                }}
              />
            ) : (
              <DefaultMusicIcon />
            )}
          </div>

          <SuggestionInfo>
            <SuggestionTitle>{track.name}</SuggestionTitle>
            <SuggestionArtist>{track.artist}</SuggestionArtist>
          </SuggestionInfo>

          <SuggestionActions>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation()
                handlePlaySuggestion(track)
              }}
              title="Reproducir"
            >
              <Play size={16} />
            </ActionButton>

            <ActionButton
              onClick={(e) => {
                e.stopPropagation()
                handleAddToQueue(track)
              }}
              title="Agregar a cola"
            >
              <Plus size={16} />
            </ActionButton>

            <ActionButton
              onClick={(e) => {
                e.stopPropagation()
                handleLikeTrack(track)
              }}
              title="Me gusta"
            >
              <Heart size={16} />
            </ActionButton>
          </SuggestionActions>
        </SuggestionItem>
      ))}
    </SuggestionsContainer>
  )
}

export default SuggestionsPanel
