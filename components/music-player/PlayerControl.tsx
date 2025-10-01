"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ChevronUp, Heart } from "lucide-react"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import DefaultMusicIcon from "@/components/music-player/DefaultMusicIcon"

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(6, 182, 212, 0.2);
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 1000;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`

const TrackImage = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`

const TrackTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const TrackArtist = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
    color: white;
  }
`

const LikeButton = styled.button<{ $liked?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: ${(props) => (props.$liked ? "#06b6d4" : "#94a3b8")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    color: ${(props) => (props.$liked ? "#818cf8" : "#06b6d4")};
    transform: scale(1.1);
  }
`

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 722px;
  margin: 0 auto;
`

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: ${(props) => (props.$active ? "#06b6d4" : "#94a3b8")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #06b6d4;
    transform: scale(1.06);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const PlayButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #818cf8);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  
  &:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
  }
`

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const TimeLabel = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
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
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::-webkit-slider-thumb {
    opacity: 1;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::-moz-range-thumb {
    opacity: 1;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 125px;
`

const VolumeSlider = styled.input`
  width: 93px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
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
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::-webkit-slider-thumb {
    opacity: 1;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::-moz-range-thumb {
    opacity: 1;
  }
`

const ExpandButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: white;
    color: white;
  }
`

interface PlayerControlProps {
  onExpand: () => void
}

const PlayerControl: React.FC<PlayerControlProps> = ({ onExpand }) => {
  const playerState = useAudioPlayerContext()
  const [liked, setLiked] = useState(false)

  const handlePlayPause = () => {
    playerState.togglePlayPause()
  }

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

  if (!playerState.currentTrack) {
    return null
  }

  return (
    <PlayerContainer>
      <LeftSection>
        <TrackImage>
          {playerState.currentTrack.image_url || playerState.currentTrack.thumbnail ? (
            <img
              src={playerState.currentTrack.image_url || playerState.currentTrack.thumbnail}
              alt={playerState.currentTrack.title || playerState.currentTrack.name}
            />
          ) : (
            <DefaultMusicIcon />
          )}
        </TrackImage>
        <TrackInfo>
          <TrackTitle>{playerState.currentTrack.title || playerState.currentTrack.name}</TrackTitle>
          <TrackArtist>{playerState.currentTrack.artist}</TrackArtist>
        </TrackInfo>
        <LikeButton
          $liked={liked}
          onClick={() => setLiked(!liked)}
          title={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </LikeButton>
      </LeftSection>

      <CenterSection>
        <ControlsRow>
          <ControlButton onClick={playerState.toggleShuffle} $active={playerState.shuffleMode} title="Aleatorio">
            <Shuffle size={16} />
          </ControlButton>
          <ControlButton onClick={playerState.previousTrack} title="Anterior">
            <SkipBack size={16} />
          </ControlButton>
          <PlayButton onClick={handlePlayPause} title={playerState.isPlaying ? "Pausar" : "Reproducir"}>
            {playerState.isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
          </PlayButton>
          <ControlButton onClick={playerState.nextTrack} title="Siguiente">
            <SkipForward size={16} />
          </ControlButton>
          <ControlButton onClick={playerState.toggleRepeat} $active={playerState.repeatMode} title="Repetir">
            <Repeat size={16} />
          </ControlButton>
        </ControlsRow>

        <ProgressRow>
          <TimeLabel>{formatTime(playerState.currentTime)}</TimeLabel>
          <ProgressBar
            type="range"
            min="0"
            max={playerState.duration || 0}
            value={playerState.currentTime}
            onChange={handleProgressChange}
          />
          <TimeLabel>{formatTime(playerState.duration || 0)}</TimeLabel>
        </ProgressRow>
      </CenterSection>

      <RightSection>
        <VolumeContainer>
          <ControlButton title="Volumen">
            <Volume2 size={16} />
          </ControlButton>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={playerState.volume}
            onChange={handleVolumeChange}
            title={`Volumen: ${playerState.volume}%`}
          />
        </VolumeContainer>
        <ExpandButton onClick={onExpand} title="Pantalla completa">
          <ChevronUp size={16} />
        </ExpandButton>
      </RightSection>
    </PlayerContainer>
  )
}

export default PlayerControl
