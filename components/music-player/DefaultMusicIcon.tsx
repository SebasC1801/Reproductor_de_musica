import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const DefaultMusicIcon: React.FC = () => (
  <IconContainer>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Sombra externa */}
      <circle cx="24" cy="26" r="22" fill="rgba(0,0,0,0.2)" />

      {/* Círculo principal con gradiente mejorado */}
      <circle cx="24" cy="24" r="20" fill="url(#grad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Nota musical mejorada */}
      <g fill="#fff">
        {/* Cabeza de la nota */}
        <ellipse cx="24" cy="18" rx="3" ry="4" />

        {/* Pala de la nota */}
        <rect x="21" y="14" width="6" height="2" rx="1" />

        {/* Línea vertical */}
        <rect x="23.5" y="10" width="1" height="12" />

        {/* Ondas de sonido sutiles */}
        <path d="M30 16c0-1 .5-2 1-2s1 1 1 2c0 1-.5 2-1 2s-1-1-1-2z" opacity="0.6" />
        <path d="M32 16c0-1.5 .7-2.5 1.5-2.5s1.5 1 1.5 2.5c0 1.5-.7 2.5-1.5 2.5s-1.5-1-1.5-2.5z" opacity="0.4" />
      </g>

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#667eea"/>
          <stop offset="0.5" stopColor="#764ba2"/>
          <stop offset="1" stopColor="#f093fb"/>
        </linearGradient>
      </defs>
    </svg>
  </IconContainer>
);

export default DefaultMusicIcon;
