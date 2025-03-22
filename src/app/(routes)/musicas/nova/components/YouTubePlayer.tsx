'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  FastForward, 
  Rewind, 
  Volume2, 
  VolumeX
} from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  // Simplificamos para usar o iframe diretamente sem a biblioteca react-youtube
  // que está causando problemas de carregamento
  
  return (
    <div className="bg-gray-900 p-4 rounded-md border border-gray-800 mb-6">
      <div className="mb-4 aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="mt-2 text-center text-gray-400 text-sm">
        <span>Controles nativos do YouTube disponíveis no player acima</span>
      </div>
    </div>
  );
} 