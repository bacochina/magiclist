'use client';

import { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Play, Square } from 'lucide-react';

// Definindo os compassos disponíveis
const TIME_SIGNATURES = [
  { beats: 2, value: 4, label: '2/4' },
  { beats: 3, value: 4, label: '3/4' },
  { beats: 4, value: 4, label: '4/4' },
  { beats: 6, value: 8, label: '6/8' },
];

interface MetronomeProps {
  initialBpm: string;
}

export default function Metronome({ initialBpm }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm ? parseInt(initialBpm) : 120);
  const [volume, setVolume] = useState(0.5);
  const [frequency, setFrequency] = useState(800);
  const [timeSignature, setTimeSignature] = useState({ beats: 4, value: 4 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatCountRef = useRef(0);

  // Inicializa o AudioContext apenas quando necessário (ação do usuário)
  const initAudioContext = () => {
    if (audioContextRef.current === null) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Função para reproduzir o som do metrônomo
  const playSound = (isAccented = false) => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Frequência diferente para o primeiro tempo (acento)
    oscillator.frequency.value = isAccented ? frequency + 200 : frequency;
    
    // Volume
    gainNode.gain.value = volume;

    // Duração do som
    const now = audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.05);

    // Envelope para evitar cliques
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
  };

  // Inicia/para o metrônomo
  const toggleMetronome = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      initAudioContext();
      beatCountRef.current = 0;
      
      const interval = 60000 / bpm;
      intervalRef.current = setInterval(() => {
        const isFirstBeat = beatCountRef.current % timeSignature.beats === 0;
        playSound(isFirstBeat);
        beatCountRef.current = (beatCountRef.current + 1) % timeSignature.beats;
      }, interval);
      
      setIsPlaying(true);
    }
  };

  // Limpa o intervalo quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Atualiza o intervalo quando o BPM muda
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const interval = 60000 / bpm;
      intervalRef.current = setInterval(() => {
        const isFirstBeat = beatCountRef.current % timeSignature.beats === 0;
        playSound(isFirstBeat);
        beatCountRef.current = (beatCountRef.current + 1) % timeSignature.beats;
      }, interval);
    }
  }, [bpm, volume, frequency, timeSignature]);

  return (
    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">Metrônomo</h3>
      
      <div className="flex flex-col space-y-4">
        {/* Controles de BPM */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm w-24">BPM:</span>
          <button 
            onClick={() => setBpm(Math.max(40, bpm - 1))}
            className="flex-none w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-orange-500"
          >
            <Minus size={16} />
          </button>
          
          <div className="flex-grow text-center">
            <span className="text-lg font-bold text-orange-500">{bpm}</span>
          </div>
          
          <button 
            onClick={() => setBpm(Math.min(240, bpm + 1))}
            className="flex-none w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-orange-500"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Controle de compasso */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm w-24">Compasso:</span>
          <div className="flex-grow">
            <div className="flex space-x-2 justify-center">
              {TIME_SIGNATURES.map((ts) => (
                <button 
                  key={ts.label}
                  onClick={() => setTimeSignature({ beats: ts.beats, value: ts.value })}
                  className={`px-3 py-1 rounded ${
                    timeSignature.beats === ts.beats && timeSignature.value === ts.value 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {ts.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Controles de som */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm w-24">Volume:</span>
          <div className="flex-grow">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full volume-control"
              style={{
                height: '4px'
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm w-24">Frequência:</span>
          <div className="flex-grow">
            <input
              type="range"
              min="200"
              max="2000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="w-full freq-control"
              style={{
                height: '4px'
              }}
            />
          </div>
        </div>
        
        {/* Botão de play/pause */}
        <div className="flex justify-center mt-2">
          <button 
            onClick={toggleMetronome}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-black`}
          >
            {isPlaying ? <Square size={24} /> : <Play size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
} 