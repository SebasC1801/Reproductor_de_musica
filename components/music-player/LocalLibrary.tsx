"use client"

import type React from "react"
import { useRef } from "react"
import type { Track } from "@/components/music-player/types"

interface LocalLibraryProps {
  onTracksAdded: (tracks: Track[]) => void
}

const LocalLibrary: React.FC<LocalLibraryProps> = ({ onTracksAdded }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handlePickFiles = () => {
    inputRef.current?.click()
  }

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const createdTracks: Track[] = []

    for (const file of Array.from(files)) {
      try {
        const objectUrl = URL.createObjectURL(file)
        const nameFromFile = file.name.replace(/\.[^.]+$/, "")
        const audio = document.createElement("audio")
        audio.src = objectUrl

        // Leer duración si es posible
        const duration = await new Promise<number>((resolve) => {
          const onLoaded = () => {
            resolve(isFinite(audio.duration) ? Math.floor(audio.duration) : 0)
            cleanup()
          }
          const onError = () => {
            resolve(0)
            cleanup()
          }
          const cleanup = () => {
            audio.removeEventListener("loadedmetadata", onLoaded)
            audio.removeEventListener("error", onError)
          }
          audio.addEventListener("loadedmetadata", onLoaded, { once: true })
          audio.addEventListener("error", onError, { once: true })
        })

        createdTracks.push({
          id: `local-${crypto.randomUUID()}`,
          name: nameFromFile,
          artist: "Archivo local",
          album: nameFromFile,
          duration,
          image_url: undefined,
          preview_url: objectUrl,
          source: "local",
          thumbnail: undefined,
          title: nameFromFile,
        })
      } catch (e) {
        // Ignorar archivo con error
        // No interrumpe la carga de otros archivos
      }
    }

    if (createdTracks.length > 0) {
      onTracksAdded(createdTracks)
    }

    // Limpiar para permitir volver a seleccionar los mismos archivos si se desea
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div
      style={{
        marginBottom: 32,
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <button
        onClick={handlePickFiles}
        style={{
          background: "linear-gradient(135deg, #4ECDC4, #44A08D)",
          border: "none",
          color: "white",
          padding: "16px 32px",
          borderRadius: 16,
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 8px 20px rgba(78, 205, 196, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(78, 205, 196, 0.4)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)"
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(78, 205, 196, 0.3)"
        }}
      >
        🎵 Agregar canciones locales
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFilesSelected}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default LocalLibrary
