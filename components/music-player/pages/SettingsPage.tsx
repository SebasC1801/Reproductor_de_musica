"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { Volume2, User, Sliders, Save } from "lucide-react"
import type { EqualizerSettings, User as UserType } from "@/components/music-player/types"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"

const SettingsContainer = styled.div`
  padding: 24px;
  max-width: 800px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: var(--text-white);
`

const SettingsSection = styled.div`
  background: var(--card-gray);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--border-gray);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--primary-blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionLabel = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-white);
`

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-gray);

  &:last-child {
    border-bottom: none;
  }
`

const SettingLabel = styled.label`
  font-size: 16px;
  color: var(--text-white);
`

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
`

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-gray);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-blue);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-blue);
    cursor: pointer;
    border: none;
  }
`

const SliderLabel = styled.span`
  font-size: 12px;
  color: var(--text-gray);
  text-align: center;
`

const Select = styled.select`
  background: var(--secondary-gray);
  border: 1px solid var(--border-gray);
  border-radius: 8px;
  color: var(--text-white);
  padding: 8px 12px;
  font-size: 14px;
`

const EqualizerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 16px;
`

const EqualizerBand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const BandLabel = styled.span`
  font-size: 12px;
  color: var(--text-gray);
`

const VerticalSlider = styled.input`
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  width: 6px;
  height: 120px;
  background: var(--border-gray);
  outline: none;
  border-radius: 3px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary-blue);
    cursor: pointer;
  }
`

const SettingsPage: React.FC = () => {
  const { audioSettings, updateAudioSettings } = useAudioPlayerContext()

  const [userProfile, setUserProfile] = useState<UserType>({
    id: "1",
    name: "",
    email: "",
    image_url: undefined,
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setUserProfile({
          ...parsed,
          name: parsed.name || "",
          email: parsed.email || "",
        })
      } catch (error) {
        console.error("Error loading user profile:", error)
      }
    }
  }, [])

  const handleVolumeChange = (value: number) => {
    updateAudioSettings({ volume: value })
  }

  const handleQualityChange = (quality: "low" | "medium" | "high") => {
    updateAudioSettings({ quality })
  }

  const handleEqualizerChange = (band: keyof EqualizerSettings, value: number) => {
    updateAudioSettings({
      equalizer: {
        ...audioSettings.equalizer,
        [band]: value,
      },
    })
  }

  const handleCustomBandChange = (index: number, value: number) => {
    updateAudioSettings({
      equalizer: {
        ...audioSettings.equalizer,
        customBands: audioSettings.equalizer.customBands.map((band, i) => (i === index ? value : band)),
      },
    })
  }

  const handleUserProfileChange = (field: keyof UserType, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Los ajustes de audio ya se guardan automáticamente en el contexto
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
    alert("Configuración guardada exitosamente!")
  }

  return (
    <SettingsContainer>
      <SectionTitle>⚙️ Ajustes</SectionTitle>

      {/* Configuración de Audio */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon>
            <Volume2 size={20} />
          </SectionIcon>
          <SectionLabel>Configuración de Audio</SectionLabel>
        </SectionHeader>

        <SettingItem>
          <SettingLabel>Volumen</SettingLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="0"
              max="100"
              value={audioSettings.volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
            />
            <SliderLabel>{audioSettings.volume}%</SliderLabel>
          </SliderContainer>
        </SettingItem>

        <SettingItem>
          <SettingLabel>Calidad de Descarga</SettingLabel>
          <Select
            value={audioSettings.quality}
            onChange={(e) => handleQualityChange(e.target.value as "low" | "medium" | "high")}
          >
            <option value="low">Baja (128 kbps)</option>
            <option value="medium">Media (256 kbps)</option>
            <option value="high">Alta (320 kbps)</option>
          </Select>
        </SettingItem>
      </SettingsSection>

      {/* Ecualizador */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon>
            <Sliders size={20} />
          </SectionIcon>
          <SectionLabel>Ecualizador</SectionLabel>
        </SectionHeader>

        <SettingItem>
          <SettingLabel>Graves</SettingLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="-12"
              max="12"
              value={audioSettings.equalizer.bass}
              onChange={(e) => handleEqualizerChange("bass", Number(e.target.value))}
            />
            <SliderLabel>{audioSettings.equalizer.bass} dB</SliderLabel>
          </SliderContainer>
        </SettingItem>

        <SettingItem>
          <SettingLabel>Medios</SettingLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="-12"
              max="12"
              value={audioSettings.equalizer.mid}
              onChange={(e) => handleEqualizerChange("mid", Number(e.target.value))}
            />
            <SliderLabel>{audioSettings.equalizer.mid} dB</SliderLabel>
          </SliderContainer>
        </SettingItem>

        <SettingItem>
          <SettingLabel>Agudos</SettingLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="-12"
              max="12"
              value={audioSettings.equalizer.treble}
              onChange={(e) => handleEqualizerChange("treble", Number(e.target.value))}
            />
            <SliderLabel>{audioSettings.equalizer.treble} dB</SliderLabel>
          </SliderContainer>
        </SettingItem>

        <div style={{ marginTop: "24px" }}>
          <SettingLabel style={{ marginBottom: "16px", display: "block" }}>Ecualizador Personalizado</SettingLabel>
          <EqualizerGrid>
            {audioSettings.equalizer.customBands.map((band, index) => (
              <EqualizerBand key={index}>
                <BandLabel>
                  {index === 0
                    ? "60Hz"
                    : index === 1
                      ? "170Hz"
                      : index === 2
                        ? "310Hz"
                        : index === 3
                          ? "600Hz"
                          : "1kHz"}
                </BandLabel>
                <VerticalSlider
                  type="range"
                  min="-12"
                  max="12"
                  value={band}
                  onChange={(e) => handleCustomBandChange(index, Number(e.target.value))}
                />
                <BandLabel>{band} dB</BandLabel>
              </EqualizerBand>
            ))}
          </EqualizerGrid>
        </div>
      </SettingsSection>

      {/* Perfil de Usuario */}
      <SettingsSection>
        <SectionHeader>
          <SectionIcon>
            <User size={20} />
          </SectionIcon>
          <SectionLabel>Perfil de Usuario</SectionLabel>
        </SectionHeader>

        <SettingItem>
          <SettingLabel>Nombre de Usuario</SettingLabel>
          <input
            type="text"
            value={userProfile.name || ""}
            onChange={(e) => handleUserProfileChange("name", e.target.value)}
            placeholder="Tu nombre de usuario"
            style={{
              width: "200px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-gray)",
              background: "var(--secondary-gray)",
              color: "var(--text-white)",
              fontSize: "14px",
            }}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>Email</SettingLabel>
          <input
            type="email"
            value={userProfile.email || ""}
            onChange={(e) => handleUserProfileChange("email", e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: "200px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-gray)",
              background: "var(--secondary-gray)",
              color: "var(--text-white)",
              fontSize: "14px",
            }}
          />
        </SettingItem>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={handleSaveSettings}
            style={{
              background: "var(--primary-blue)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--primary-blue-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "var(--primary-blue)")}
          >
            <Save size={20} />
            Guardar Configuración
          </button>
        </div>
      </SettingsSection>
    </SettingsContainer>
  )
}

export default SettingsPage
