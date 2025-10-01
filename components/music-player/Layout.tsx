"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"
import { Home, Music, Search, Settings, User, List, Plus } from "lucide-react"
import type { PageType } from "@/components/music-player/types"
import PlayerControl from "@/components/music-player/PlayerControl"
import FullScreenPlayer from "@/components/music-player/FullScreenPlayer"
import SearchPage from "@/components/music-player/pages/SearchPage"
import { useAudioPlayerContext } from "@/components/music-player/contexts/AudioPlayerContext"
import { usePlaylistContext } from "@/components/music-player/contexts/PlaylistContext"
import CreatePlaylist from "@/components/music-player/CreatePlaylist"

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  background-attachment: fixed;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #06b6d4, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
`

const SearchBar = styled.input`
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
  padding: 12px 20px;
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 24px;
  color: #f1f5f9;
  font-size: 14px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(148, 163, 184, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #06b6d4;
    background: rgba(30, 41, 59, 0.9);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &:hover {
    border-color: rgba(6, 182, 212, 0.5);
  }
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #06b6d4;
      transform: scale(1.1);
    }
  }
`

const CreatePlaylistHeaderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #06b6d4, #818cf8);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  }

  svg {
    color: white;
  }
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const Sidebar = styled.aside`
  width: 240px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(6, 182, 212, 0.2);
  padding: 24px 0;
`

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  margin: 4px 12px;
  border-radius: 8px;
  color: ${(props) => (props.$active ? "#f1f5f9" : "#94a3b8")};
  background: ${(props) => (props.$active ? "rgba(6, 182, 212, 0.15)" : "transparent")};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: linear-gradient(180deg, #06b6d4, #818cf8);
    transform: scaleY(${(props) => (props.$active ? 1 : 0)});
    transition: transform 0.25s ease;
  }

  &:hover {
    background: rgba(6, 182, 212, 0.12);
    color: #f1f5f9;
    transform: translateX(4px);

    &::before {
      transform: scaleY(1);
    }
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  svg {
    transition: transform 0.25s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`

const ContentArea = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`

const PlayerControlContainer = styled.footer`
  height: 80px;
  background: rgba(20, 20, 24, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(160, 160, 170, 0.2);
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
`

interface LayoutProps {
  children: React.ReactNode
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const audioPlayer = useAudioPlayerContext()
  const { createPlaylist } = usePlaylistContext()

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onPageChange("search")
    }
  }

  const handleCreatePlaylist = (playlist: { name: string; description: string }) => {
    createPlaylist(playlist.name, playlist.description)
  }

  const navItems = [
    { id: "home" as PageType, label: "Inicio", icon: Home },
    { id: "playlist" as PageType, label: "Playlists", icon: List },
    { id: "library" as PageType, label: "Mi Música", icon: Music },
    { id: "search" as PageType, label: "Buscar", icon: Search },
    { id: "settings" as PageType, label: "Ajustes", icon: Settings },
  ]

  return (
    <LayoutContainer>
      <Header>
        <Logo>🎵 Sonovibe</Logo>
        <SearchBar
          type="text"
          placeholder="Buscar canciones, artistas, álbumes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchSubmit}
        />
        <UserSection>
          <CreatePlaylistHeaderButton onClick={() => setIsCreatePlaylistOpen(true)}>
            <Plus size={16} />
            Nueva Playlist
          </CreatePlaylistHeaderButton>
          <User size={24} />
          <Settings size={24} onClick={() => onPageChange("settings")} />
        </UserSection>
      </Header>

      <MainContent>
        <Sidebar>
          {navItems.map(({ id, label, icon: Icon }) => (
            <NavItem key={id} $active={currentPage === id} onClick={() => onPageChange(id)}>
              <Icon size={20} />
              {label}
            </NavItem>
          ))}
        </Sidebar>

        <ContentArea>{currentPage === "search" ? <SearchPage searchQuery={searchQuery} /> : children}</ContentArea>
      </MainContent>

      <PlayerControl onExpand={() => setIsFullScreenOpen(true)} />
      <FullScreenPlayer isOpen={isFullScreenOpen} onClose={() => setIsFullScreenOpen(false)} />
      <CreatePlaylist
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </LayoutContainer>
  )
}

export default Layout
