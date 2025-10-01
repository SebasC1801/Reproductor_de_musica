"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { Play, ChevronRight, Heart, Clock, Mic2, Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Track } from "@/components/music-player/types"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import { useTracksContext, usePlaylistContext } from "@/components/music-player/contexts/PlaylistContext"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"
import { searchItunes } from "@/components/music-player/services/itunesService"
import SuggestionsPanel from "@/components/music-player/SuggestionsPanel"
import CreatePlaylist from "@/components/music-player/CreatePlaylist"
import LocalLibrary from "@/components/music-player/LocalLibrary"

const ContentArea = styled.div`
  width: 100%;
  background: linear-gradient(180deg, rgba(83, 52, 131, 0.3) 0%, #121212 300px);
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`

const FeaturedSection = styled.div`
  margin-bottom: 48px;
`

const FeaturedCard = styled.div`
  display: flex;
  gap: 32px;
  background: linear-gradient(135deg, rgba(83, 52, 131, 0.4) 0%, rgba(18, 18, 18, 0.8) 100%);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const FeaturedImage = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const FeaturedInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #1DB954;
  font-weight: 600;
`

const FeaturedTitle = styled.h1`
  font-size: 72px;
  font-weight: bold;
  color: white;
  margin: 0;
  line-height: 1;
`

const FeaturedStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`

const FeaturedActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1DB954;
  border: none;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 24px rgba(29, 185, 84, 0.4);

  &:hover {
    transform: scale(1.05);
    background: #1ed760;
  }
`

const FollowButton = styled.button`
  padding: 12px 32px;
  border-radius: 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: white;
    transform: scale(1.02);
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
`

const SeeAllButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: white;
  }
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
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
  background: ${(props) => (props.$isPlaying ? "rgba(29, 185, 84, 0.1)" : "transparent")};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const TrackNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
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
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackArtist = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackAlbum = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
`

const MainContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
`

const ContentWithSuggestions = styled.div`
  flex: 1;
  min-width: 0;
`

const CreatePlaylistButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(78, 205, 196, 0.6);
  }

  &:active {
    transform: scale(1.05);
  }
`

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [featuredArtist, setFeaturedArtist] = useState<any>(null)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)

  const audioPlayer = useAudioPlayerContext()
  const { tracks, addTracks, removeTrack } = useTracksContext()
  const { createPlaylist, removeTrackFromAllPlaylists } = usePlaylistContext()

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
    const loadInitialTracks = async () => {
      setLoading(true)
      try {
        const artists = ["The Weeknd", "Daft Punk", "Billie Eilish"]
        const allTracks = []

        for (const artist of artists) {
          const itunesTracks = await searchItunes(artist)
          const appTracks = itunesTracks.slice(0, 10).map((track) => ({
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
          allTracks.push(...appTracks)
        }

        if (allTracks.length > 0) {
          addTracks(allTracks)
          setFeaturedArtist({
            name: "The Weeknd",
            image: allTracks[0]?.image_url,
            listeners: "106,764,244",
            verified: true,
          })
        }
      } catch (error) {
        console.error("Error cargando canciones:", error)
      } finally {
        setLoading(false)
      }
    }

    if (tracks.length === 0) {
      loadInitialTracks()
    } else {
      setLoading(false)
      if (tracks.length > 0) {
        setFeaturedArtist({
          name: tracks[0].artist,
          image: tracks[0].image_url,
          listeners: "106,764,244",
          verified: true,
        })
      }
    }
  }, [])

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

  const handleCreatePlaylist = (playlist: { name: string; description: string }) => {
    createPlaylist(playlist.name, playlist.description)
  }

  const handleLocalTracksAdded = (newTracks: Track[]) => {
    addTracks(newTracks)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleDeleteTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm("¿Eliminar esta canción de tu biblioteca y playlists?")) return
    if (audioPlayer.currentTrack?.id === trackId) {
      audioPlayer.pause()
    }
    removeTrackFromAllPlaylists(trackId)
    removeTrack(trackId)
    toast({ title: "Canción eliminada", description: "Se eliminó de tu biblioteca y playlists." })
  }

  return (
    <>
      <MainContentWrapper>
        <ContentArea>
          {loading ? (
            <LoadingSpinner>Cargando música...</LoadingSpinner>
          ) : (
            <>
              <LocalLibrary onTracksAdded={handleLocalTracksAdded} />

              {featuredArtist && (
                <FeaturedSection>
                  <Breadcrumb>
                    <span>Home</span>
                    <ChevronRight size={16} />
                    <span>Artista Popular</span>
                  </Breadcrumb>

                  <FeaturedCard>
                    <FeaturedImage>
                      <img
                        src={featuredArtist.image || "/placeholder.svg?height=280&width=280"}
                        alt={featuredArtist.name}
                      />
                    </FeaturedImage>
                    <FeaturedInfo>
                      {featuredArtist.verified && (
                        <VerifiedBadge>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                          Artista Verificado
                        </VerifiedBadge>
                      )}
                      <FeaturedTitle>{featuredArtist.name}</FeaturedTitle>
                      <FeaturedStats>
                        <Mic2 size={16} />
                        {featuredArtist.listeners} oyentes mensuales
                      </FeaturedStats>
                      <FeaturedActions>
                        <PlayButton onClick={() => tracks.length > 0 && handlePlayTrack(tracks[0])}>
                          <Play size={24} fill="black" />
                        </PlayButton>
                        <FollowButton>Seguir</FollowButton>
                      </FeaturedActions>
                    </FeaturedInfo>
                  </FeaturedCard>
                </FeaturedSection>
              )}

              <div>
                <SectionHeader>
                  <SectionTitle>Popular</SectionTitle>
                  <SeeAllButton>
                    Ver todo
                    <ChevronRight size={16} />
                  </SeeAllButton>
                </SectionHeader>

                <TracksTable>
                  <TableHeader>
                    <div>#</div>
                    <div>Título</div>
                    <div>Álbum</div>
                    <div>
                      <Clock size={16} />
                    </div>
                  </TableHeader>

                  {tracks.slice(0, 20).map((track, index) => (
                    <TrackRow
                      key={`home-${track.id}-${index}`}
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
                            marginRight: "16px",
                            color: likedTracks.has(track.id) ? "#1DB954" : "rgba(255, 255, 255, 0.5)",
                            transition: "color 0.2s ease",
                          }}
                        >
                          <Heart size={16} fill={likedTracks.has(track.id) ? "#1DB954" : "none"} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTrack(track.id, e)}
                          title="Eliminar"
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginRight: "16px",
                            color: "#ef4444",
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                        {formatDuration(track.duration)}
                      </TrackDuration>
                    </TrackRow>
                  ))}
                </TracksTable>
              </div>
            </>
          )}
        </ContentArea>

        {!loading && (
          <SuggestionsPanel
            currentTrack={audioPlayer.currentTrack}
            onPlayTrack={handlePlayTrack}
            availableTracks={tracks}
          />
        )}
      </MainContentWrapper>

      <CreatePlaylistButton onClick={() => setIsCreatePlaylistOpen(true)} title="Crear Playlist">
        <Plus size={24} />
      </CreatePlaylistButton>

      <CreatePlaylist
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </>
  )
}

export default HomePage
