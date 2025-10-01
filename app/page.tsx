"use client"

import { useState } from "react"
import Layout from "@/components/music-player/Layout"
import HomePage from "@/components/music-player/pages/HomePage"
import SettingsPage from "@/components/music-player/pages/SettingsPage"
import PlaylistPage from "@/components/music-player/pages/PlaylistPage"
import type { PageType } from "@/components/music-player/types"
import { AudioPlayerProvider } from "@/components/music-player/contexts/AudioPlayerContext"
import { PlaylistProvider, TracksProvider } from "@/components/music-player/contexts/PlaylistContext"

export default function MusicPlayerApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "playlist":
        return <PlaylistPage />
      case "settings":
        return <SettingsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <AudioPlayerProvider>
      <TracksProvider>
        <PlaylistProvider>
          <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
            {renderPage()}
          </Layout>
        </PlaylistProvider>
      </TracksProvider>
    </AudioPlayerProvider>
  )
}
