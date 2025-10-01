"use client"

import type React from "react"
import styled from "styled-components"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, X, MoreHorizontal, Heart } from "lucide-react"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import { useTracksContext } from "@/components/music-player/contexts/PlaylistContext"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`

const HeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  padding: 40px;
  gap: 60px;
  overflow: hidden;
`

const LeftSection = styled.div`
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`

const AlbumArtwork = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
  background: linear-gradient(135deg, #667eea, #764ba2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const TrackInfoSection = styled.div`
  text-align: center;
  width: 100%;
`

const CurrentTrackTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin: 0 0 8px 0;
`

const CurrentTrackArtist = styled.h2`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 400;
`

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const PlaylistHeader = styled.div`
  margin-bottom: 24px;
`

const PlaylistTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0 0 8px 0;
`

const PlaylistInfo = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`

const TracksList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

const TrackItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isActive ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const TrackNumber = styled.div`
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
`

const TrackItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TrackItemTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`

const TrackItemArtist = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackDuration = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-left: auto;
`

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${TrackItem}:hover & {
    opacity: 1;
  }
`

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`

const ControlsSection = styled.div`
  padding: 32px 40px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
`

const MainControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.7)")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    transform: scale(1.1);
  }
`

const PlayPauseButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: none;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  }
`

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TimeLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  text-align: center;
`

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`

const BottomControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 150px;
`

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
  }
`

interface FullScreenPlayerProps {
  isOpen: boolean
  onClose: () => void
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({ isOpen, onClose }) => {
  const playerState = useAudioPlayerContext()
  const { tracks } = useTracksContext()

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    playerState.seekTo(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    playerState.setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen || !playerState.currentTrack) {
    return null
  }

  return (
    <Overlay>
      <Header>
        <HeaderTitle>Reproduciendo ahora</HeaderTitle>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </Header>

      <MainContent>
        <LeftSection>
          <AlbumArtwork>
            {playerState.currentTrack.image_url || playerState.currentTrack.thumbnail ? (
              <img
                src={playerState.currentTrack.image_url || playerState.currentTrack.thumbnail}
                alt={playerState.currentTrack.title || playerState.currentTrack.name}
              />
            ) : (
              <DefaultMusicIcon />
            )}
          </AlbumArtwork>

          <TrackInfoSection>
            <CurrentTrackTitle>{playerState.currentTrack.title || playerState.currentTrack.name}</CurrentTrackTitle>
            <CurrentTrackArtist>{playerState.currentTrack.artist}</CurrentTrackArtist>
          </TrackInfoSection>
        </LeftSection>

        <RightSection>
          <PlaylistHeader>
            <PlaylistTitle>{playerState.currentTrack.album || "Random Access Memories"}</PlaylistTitle>
            <PlaylistInfo>{tracks.length} canciones</PlaylistInfo>
          </PlaylistHeader>

          <TracksList>
            {tracks.map((track, index) => {
              const isActive = playerState.currentTrack?.id === track.id

              return (
                <TrackItem key={track.id} $isActive={isActive} onClick={() => playerState.playTrack(track)}>
                  <TrackNumber>{index + 1}</TrackNumber>
                  <TrackItemInfo>
                    <TrackItemTitle>{track.title || track.name}</TrackItemTitle>
                    <TrackItemArtist>{track.artist}</TrackItemArtist>
                  </TrackItemInfo>
                  <TrackDuration>{formatTime(track.duration)}</TrackDuration>
                  <TrackActions>
                    <IconButton onClick={(e) => e.stopPropagation()}>
                      <Heart size={16} />
                    </IconButton>
                    <IconButton onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal size={16} />
                    </IconButton>
                  </TrackActions>
                </TrackItem>
              )
            })}
          </TracksList>
        </RightSection>
      </MainContent>

      <ControlsSection>
        <ControlsContainer>
          <MainControls>
            <ControlButton onClick={playerState.toggleShuffle} $active={playerState.shuffleMode}>
              <Shuffle size={20} />
            </ControlButton>
            <ControlButton onClick={playerState.previousTrack}>
              <SkipBack size={20} />
            </ControlButton>
            <PlayPauseButton onClick={playerState.togglePlayPause}>
              {playerState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </PlayPauseButton>
            <ControlButton onClick={playerState.nextTrack}>
              <SkipForward size={20} />
            </ControlButton>
            <ControlButton onClick={playerState.toggleRepeat} $active={playerState.repeatMode}>
              <Repeat size={20} />
            </ControlButton>
          </MainControls>

          <ProgressSection>
            <TimeLabel>{formatTime(playerState.currentTime)}</TimeLabel>
            <ProgressBar
              type="range"
              min="0"
              max={playerState.duration || 0}
              value={playerState.currentTime}
              onChange={handleProgressChange}
            />
            <TimeLabel>{formatTime(playerState.duration || 0)}</TimeLabel>
          </ProgressSection>

          <BottomControls>
            <div style={{ width: "150px" }} />
            <div />
            <VolumeControl>
              <Volume2 size={20} color="rgba(255, 255, 255, 0.7)" />
              <VolumeSlider type="range" min="0" max="100" value={playerState.volume} onChange={handleVolumeChange} />
            </VolumeControl>
          </BottomControls>
        </ControlsContainer>
      </ControlsSection>
    </Overlay>
  )
}

export default FullScreenPlayer
