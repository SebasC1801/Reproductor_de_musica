import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Music, Plus } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const Modal = styled.div`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: rgba(255, 107, 107, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 107, 1);
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(78, 205, 196, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(78, 205, 196, 0.8);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(78, 205, 196, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: rgba(78, 205, 196, 0.8);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$variant === 'primary' ? `
    background: rgba(78, 205, 196, 0.9);
    border-color: rgba(78, 205, 196, 0.8);
    color: white;
    
    &:hover {
      background: rgba(78, 205, 196, 1);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(78, 205, 196, 0.3);
    }
  ` : `
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
    }
  `}
`;

interface CreatePlaylistProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (playlist: { name: string; description: string }) => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({ isOpen, onClose, onCreatePlaylist }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreatePlaylist({
        name: name.trim(),
        description: description.trim()
      });
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Music size={24} />
            Crear Nueva Playlist
          </Title>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="playlist-name">Nombre de la Playlist</Label>
            <Input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi nueva playlist..."
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="playlist-description">Descripción (opcional)</Label>
            <TextArea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu playlist..."
            />
          </InputGroup>

          <ButtonGroup>
            <Button type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" $variant="primary">
              <Plus size={16} />
              Crear Playlist
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default CreatePlaylist;
