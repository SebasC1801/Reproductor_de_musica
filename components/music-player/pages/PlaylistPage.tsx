"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { Play, Trash2, ArrowLeft } from "lucide-react"
import type { Track } from "@/components/music-player/types"
import { usePlaylistContext, useTracksContext } from "@/components/music-player/contexts/PlaylistContext"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"

const PlaylistContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F0F23 0%, #1a1a2e 50%, #16213e 100%);
`

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 32px;
  color: white;
  text-align: center;
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(78, 205, 196, 0.3);
`

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`

const PlaylistCard = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(78, 205, 196, 0.2);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(68, 160, 141, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(26, 26, 46, 0.95);
    border-color: rgba(78, 205, 196, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2);

    &::before {
      opacity: 1;
    }
  }
`

const PlaylistImage = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #4ECDC4, #44A08D, #2C3E50);
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
`

const CardPlaylistInfo = styled.div`
  margin-bottom: 16px;
`

const CardPlaylistName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
  line-height: 1.3;
`

const CardPlaylistDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
`

const CardPlaylistStats = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
`

const PlaylistActions = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
`

const ActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(props) => (props.$variant === "danger" ? "rgba(255, 107, 107, 0.9)" : "rgba(78, 205, 196, 0.9)")};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${(props) => (props.$variant === "danger" ? "rgba(255, 107, 107, 1)" : "rgba(78, 205, 196, 1)")};
    transform: scale(1.15) translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(1.05);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
`

const EmptyText = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
`

const EmptySubtext = styled.p`
  font-size: 14px;
`

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(78, 205, 196, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(78, 205, 196, 1);
    transform: scale(1.1);
  }
`

const PlaylistDetailContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F0F23 0%, #1a1a2e 50%, #16213e 100%);
`

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`

const PlaylistCover = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4ECDC4, #44A08D, #2C3E50);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const PlaylistInfo = styled.div`
  flex: 1;
`

const PlaylistTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
`

const PlaylistDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
`

const PlaylistMeta = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`

const PlayAllButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
  }
`

const SongsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SongItem = styled.div<{ $isPlaying?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: ${(props) => (props.$isPlaying ? "rgba(78, 205, 196, 0.2)" : "rgba(26, 26, 46, 0.6)")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$isPlaying ? "rgba(78, 205, 196, 0.5)" : "transparent")};

  &:hover {
    background: ${(props) => (props.$isPlaying ? "rgba(78, 205, 196, 0.3)" : "rgba(26, 26, 46, 0.8)")};
    transform: translateX(4px);
  }
`

const SongNumber = styled.div`
  width: 30px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`

const SongImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const SongDetails = styled.div`
  flex: 1;
  min-width: 0;
`

const SongTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SongArtist = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SongDuration = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: auto;
`

const SongActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${SongItem}:hover & {
    opacity: 1;
  }
`

const SongActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`

const PlaylistPage: React.FC = () => {
  const { playlists, deletePlaylist, removeFromPlaylist } = usePlaylistContext()
  const { tracks } = useTracksContext()
  const audioPlayer = useAudioPlayerContext()
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)

  // Sincronizar playlists con tracks disponibles cuando cambien
  useEffect(() => {
    if (selectedPlaylist && tracks.length > 0) {
      // Actualizar las canciones de la playlist seleccionada con las versiones actualizadas
      const updatedTracks = selectedPlaylist.tracks.map((playlistTrack: Track) => {
        // Buscar la versión actualizada de la canción
        const currentTrack = tracks.find((t) => t.id === playlistTrack.id)
        return currentTrack || playlistTrack
      })

      if (JSON.stringify(updatedTracks) !== JSON.stringify(selectedPlaylist.tracks)) {
        setSelectedPlaylist({
          ...selectedPlaylist,
          tracks: updatedTracks,
        })
      }
    }
  }, [tracks, selectedPlaylist])

  const handlePlayPlaylist = (playlist: any) => {
    if (playlist.tracks.length > 0) {
      // Reproducir la primera canción de la playlist
      audioPlayer.playTrack(playlist.tracks[0])
      // Aquí podríamos implementar lógica para reproducir toda la playlist
    }
  }

  const handleViewPlaylist = (playlist: any) => {
    setSelectedPlaylist(playlist)
  }

  const handleBackToList = () => {
    setSelectedPlaylist(null)
  }

  const handlePlaySong = (track: any) => {
    audioPlayer.playTrack(track)
  }

  const handlePlayAll = () => {
    if (selectedPlaylist && selectedPlaylist.tracks.length > 0) {
      audioPlayer.playTrack(selectedPlaylist.tracks[0])
    }
  }

  const handleRemoveFromPlaylist = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedPlaylist) {
      removeFromPlaylist(selectedPlaylist.id, trackId)
    }
  }

  const handleDeletePlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("¿Estás seguro de que quieres eliminar esta playlist?")) {
      deletePlaylist(playlistId)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Si hay una playlist seleccionada, mostrar vista detallada
  if (selectedPlaylist) {
    return (
      <PlaylistDetailContainer>
        <BackButton onClick={handleBackToList}>
          <ArrowLeft size={20} />
        </BackButton>

        <PlaylistHeader>
          <PlaylistCover>
            <DefaultMusicIcon />
          </PlaylistCover>

          <PlaylistInfo>
            <PlaylistTitle>{selectedPlaylist.name}</PlaylistTitle>
            {selectedPlaylist.description && <PlaylistDescription>{selectedPlaylist.description}</PlaylistDescription>}
            <PlaylistMeta>
              {selectedPlaylist.tracks.length} canciones • Creada {formatDate(selectedPlaylist.created_at)}
            </PlaylistMeta>
            <PlayAllButton onClick={handlePlayAll}>
              <Play size={20} />
              Reproducir todo
            </PlayAllButton>
          </PlaylistInfo>
        </PlaylistHeader>

        <SongsList>
          {selectedPlaylist.tracks.map((track: Track, index: number) => {
            const isPlaying = audioPlayer.currentTrack?.id === track.id
            return (
              <SongItem key={track.id} $isPlaying={isPlaying}>
                <SongNumber>{index + 1}</SongNumber>
                <SongImage>
                  <DefaultMusicIcon />
                </SongImage>
                <SongDetails onClick={() => handlePlaySong(track)}>
                  <SongTitle>{track.name}</SongTitle>
                  <SongArtist>{track.artist}</SongArtist>
                </SongDetails>
                <SongDuration>
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                </SongDuration>
                <SongActions>
                  <SongActionButton onClick={() => handlePlaySong(track)}>
                    <Play size={16} />
                  </SongActionButton>
                  <SongActionButton onClick={(e) => handleRemoveFromPlaylist(track.id, e)}>
                    <Trash2 size={16} />
                  </SongActionButton>
                </SongActions>
              </SongItem>
            )
          })}
        </SongsList>
      </PlaylistDetailContainer>
    )
  }

  // Vista de lista de playlists
  return (
    <PlaylistContainer>
      <SectionTitle>🎵 Mis Playlists</SectionTitle>

      {playlists.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎵</EmptyIcon>
          <EmptyText>No tienes playlists aún</EmptyText>
          <EmptySubtext>Crea tu primera playlist desde la página principal</EmptySubtext>
        </EmptyState>
      ) : (
        <PlaylistsGrid>
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} onClick={() => handleViewPlaylist(playlist)}>
              <PlaylistImage>
                <DefaultMusicIcon />
              </PlaylistImage>

              <CardPlaylistInfo>
                <CardPlaylistName>{playlist.name}</CardPlaylistName>
                {playlist.description && <CardPlaylistDescription>{playlist.description}</CardPlaylistDescription>}
                <CardPlaylistStats>
                  {playlist.tracks.length} canciones • Creada {formatDate(playlist.created_at)}
                </CardPlaylistStats>
              </CardPlaylistInfo>

              <PlaylistActions>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayPlaylist(playlist)
                  }}
                  title="Reproducir playlist"
                >
                  <Play size={16} />
                </ActionButton>

                <ActionButton
                  $variant="danger"
                  onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                  title="Eliminar playlist"
                >
                  <Trash2 size={16} />
                </ActionButton>
              </PlaylistActions>
            </PlaylistCard>
          ))}
        </PlaylistsGrid>
      )}
    </PlaylistContainer>
  )
}

export default PlaylistPage
