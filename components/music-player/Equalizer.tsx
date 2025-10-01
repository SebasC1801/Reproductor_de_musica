"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"
import { RotateCcw, Music } from "lucide-react"
import type { EqualizerSettings } from "@/components/music-player/types"

const EqualizerContainer = styled.div`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
`

const EqualizerTitle = styled.h3`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const PresetsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const PresetButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$active ? "rgba(78, 205, 196, 0.8)" : "rgba(255, 255, 255, 0.3)")};
  background: ${(props) => (props.$active ? "rgba(78, 205, 196, 0.2)" : "rgba(255, 255, 255, 0.1)")};
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "rgba(78, 205, 196, 0.3)" : "rgba(255, 255, 255, 0.2)")};
    border-color: rgba(78, 205, 196, 0.6);
  }
`

const EqualizerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`

const BandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const BandLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 500;
`

const BandSlider = styled.input`
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  width: 8px;
  height: 120px;
  background: linear-gradient(to top, rgba(78, 205, 196, 0.3), rgba(255, 255, 255, 0.1));
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    width: 10px;
    background: linear-gradient(to top, rgba(78, 205, 196, 0.5), rgba(255, 255, 255, 0.2));
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #44A08D);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.4);
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.6);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #44A08D);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.4);
    transition: all 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.6);
  }
`

const BandValue = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
`

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  background: rgba(255, 107, 107, 0.1);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
  }
`

const BassMidTrebleContainer = styled.div`
  display: flex;
  gap: 12px;
`

const BMTSlider = styled.input`
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(78, 205, 196, 0.3), rgba(255, 255, 255, 0.1));
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    height: 6px;
    background: linear-gradient(90deg, rgba(78, 205, 196, 0.5), rgba(255, 255, 255, 0.2));
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #44A08D);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(78, 205, 196, 0.4);
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 10px rgba(78, 205, 196, 0.6);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #44A08D);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(78, 205, 196, 0.4);
    transition: all 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 10px rgba(78, 205, 196, 0.6);
  }
`

const BMTLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  text-align: center;
  margin-top: 4px;
`

const BMTContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface EqualizerProps {
  settings: EqualizerSettings
  onSettingsChange: (settings: EqualizerSettings) => void
}

const Equalizer: React.FC<EqualizerProps> = ({ settings, onSettingsChange }) => {
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const presets = {
    Flat: { bass: 0, mid: 0, treble: 0, customBands: [0, 0, 0, 0, 0] },
    Rock: { bass: 8, mid: 2, treble: 6, customBands: [8, 4, 2, 4, 6] },
    Pop: { bass: 4, mid: 6, treble: 8, customBands: [4, 6, 8, 6, 4] },
    Jazz: { bass: 6, mid: 4, treble: 4, customBands: [6, 4, 4, 4, 4] },
    Classical: { bass: 2, mid: 4, treble: 8, customBands: [2, 4, 6, 8, 6] },
    Electronic: { bass: 10, mid: 2, treble: 8, customBands: [10, 6, 2, 6, 8] },
    Vocal: { bass: 2, mid: 8, treble: 6, customBands: [2, 6, 8, 6, 4] },
  }

  const bandLabels = ["60Hz", "170Hz", "310Hz", "600Hz", "1kHz", "3kHz", "6kHz", "12kHz", "14kHz", "16kHz"]

  const handlePresetSelect = (presetName: string) => {
    const preset = presets[presetName as keyof typeof presets]
    onSettingsChange(preset)
    setActivePreset(presetName)
  }

  const handleBandChange = (index: number, value: number) => {
    const newBands = [...settings.customBands]
    newBands[index] = value
    onSettingsChange({
      ...settings,
      customBands: newBands,
    })
    setActivePreset(null) // Clear preset when manually adjusting
  }

  const handleBassChange = (value: number) => {
    onSettingsChange({
      ...settings,
      bass: value,
    })
    setActivePreset(null)
  }

  const handleMidChange = (value: number) => {
    onSettingsChange({
      ...settings,
      mid: value,
    })
    setActivePreset(null)
  }

  const handleTrebleChange = (value: number) => {
    onSettingsChange({
      ...settings,
      treble: value,
    })
    setActivePreset(null)
  }

  const resetEqualizer = () => {
    const flatPreset = presets.Flat
    onSettingsChange(flatPreset)
    setActivePreset("Flat")
  }

  return (
    <EqualizerContainer>
      <EqualizerTitle>
        <Music size={18} />
        Ecualizador
      </EqualizerTitle>

      <PresetsContainer>
        {Object.keys(presets).map((presetName) => (
          <PresetButton
            key={presetName}
            $active={activePreset === presetName}
            onClick={() => handlePresetSelect(presetName)}
          >
            {presetName}
          </PresetButton>
        ))}
      </PresetsContainer>

      <EqualizerGrid>
        {settings.customBands.map((value, index) => (
          <BandContainer key={index}>
            <BandLabel>{bandLabels[index]}</BandLabel>
            <BandSlider
              type="range"
              min="-12"
              max="12"
              value={value}
              onChange={(e) => handleBandChange(index, Number.parseInt(e.target.value))}
            />
            <BandValue>{value > 0 ? `+${value}` : value}</BandValue>
          </BandContainer>
        ))}
      </EqualizerGrid>

      <ControlsContainer>
        <ResetButton onClick={resetEqualizer}>
          <RotateCcw size={12} />
          Resetear
        </ResetButton>

        <BassMidTrebleContainer>
          <BMTContainer>
            <BMTSlider
              type="range"
              min="-12"
              max="12"
              value={settings.bass}
              onChange={(e) => handleBassChange(Number.parseInt(e.target.value))}
            />
            <BMTLabel>Bass</BMTLabel>
          </BMTContainer>

          <BMTContainer>
            <BMTSlider
              type="range"
              min="-12"
              max="12"
              value={settings.mid}
              onChange={(e) => handleMidChange(Number.parseInt(e.target.value))}
            />
            <BMTLabel>Mid</BMTLabel>
          </BMTContainer>

          <BMTContainer>
            <BMTSlider
              type="range"
              min="-12"
              max="12"
              value={settings.treble}
              onChange={(e) => handleTrebleChange(Number.parseInt(e.target.value))}
            />
            <BMTLabel>Treble</BMTLabel>
          </BMTContainer>
        </BassMidTrebleContainer>
      </ControlsContainer>
    </EqualizerContainer>
  )
}

export default Equalizer
