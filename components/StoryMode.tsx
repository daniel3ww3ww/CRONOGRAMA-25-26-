import React, { useState, useEffect, useRef } from 'react';
import { AppEvent } from '../types';
import { X, Volume2, VolumeX, Share2, Play, Music2, Sparkles } from 'lucide-react';

interface StoryModeProps {
  events: AppEvent[];
  onClose: () => void;
}

// TEMA: Luck Ra, BM - La Morocha 
// Usamos el endpoint 'download' que suele ser más directo y rápido que 'items'
const MUSIC_URL = "https://archive.org/download/luck-ra-bm-la-morocha/Luck%20Ra%2C%20BM%20-%20LA%20MOROCHA.mp3";

export const StoryMode: React.FC<StoryModeProps> = ({ events, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slideDuration = 5000; 

  const startPresentation = () => {
    // 1. Play audio FIRST while we are inside the user interaction event (click)
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.muted = false;
      
      // Reset time to ensure clean start
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("La Morocha started successfully");
          })
          .catch(error => {
            console.error("Audio playback failed/prevented:", error);
            alert("No se pudo reproducir el audio automáticamente. Verificá el volumen de tu celular.");
          });
      }
    }

    // 2. Then update state to show the slideshow
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused || !hasStarted) return;

    const startTime = Date.now();
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (100 / (slideDuration / 50));
      });
    }, 50);

    const timeout = setTimeout(() => {
        if (currentIndex < events.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0); // Loop
        }
    }, slideDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentIndex, isPaused, hasStarted, events.length]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `💃 *Cronograma de Amigas 2025-2026* 🥂\n\n${events.map(e => `🗓️ ${e.date.toLocaleDateString()} - ${e.title}`).join('\n')}\n\n¡Miren la agenda!`;
    
    const fallbackShare = () => {
        navigator.clipboard.writeText(text)
          .then(() => alert('¡Texto copiado! Pegalo en WhatsApp.'))
          .catch(() => alert('No se pudo compartir.'));
    };

    if (navigator.share) {
      try {
        const urlToShare = window.location.href.startsWith('http') ? window.location.href : undefined;
        await navigator.share({
          title: 'Festejos & Viajes',
          text: text,
          url: urlToShare,
        });
      } catch (error) {
        console.warn('Share failed or cancelled:', error);
        if (error instanceof Error && error.name !== 'AbortError') {
            fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <>
      {/* AUDIO ELEMENT 
          - Removed crossOrigin to prevent CORS blocking on some mobile browsers 
          - Added playsInline for iOS compatibility 
      */}
      <audio 
        ref={audioRef} 
        src={MUSIC_URL} 
        loop 
        preload="auto"
        playsInline
      />

      {!hasStarted ? (
        // START SCREEN
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="relative z-10 text-center animate-in zoom-in duration-500 bg-white/95 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 backdrop-blur-md max-w-lg w-full">
              <div className="inline-block p-5 rounded-full bg-yellow-100 mb-6 animate-bounce shadow-lg">
                  <Music2 size={52} className="text-yellow-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 drop-shadow-sm">
                ¡HOLA CHICAS!
              </h1>
              <p className="text-xl mb-8 text-gray-700 font-bold">El cronograma de festejos y viajes</p>
              
              <button 
                  onClick={startPresentation}
                  className="group relative w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-2xl font-black py-6 px-10 rounded-2xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] transform hover:scale-105 transition-all border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
              >
                  <span className="flex items-center justify-center gap-3 drop-shadow-md">
                      <Play fill="currentColor" size={32} />
                      PONÉ LA MOROCHA
                  </span>
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-pink-600 bg-pink-50 py-2 px-4 rounded-full mx-auto w-fit">
                <Volume2 size={18} className="animate-pulse" />
                <span className="text-sm font-bold">Suban el volumen al máximo</span>
              </div>
              
              <button onClick={onClose} className="mt-8 text-gray-400 hover:text-gray-600 text-sm underline font-medium">
                  Volver sin música
              </button>
          </div>
        </div>
      ) : (
        // SLIDESHOW SCREEN
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col animate-in fade-in duration-300 font-sans">
          
          {/* Progress Bars - High Visibility */}
          <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 p-2 bg-gradient-to-b from-black/80 to-transparent pt-4 pb-8">
            {events.map((_, idx) => (
              <div key={idx} className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden shadow-sm backdrop-blur-sm">
                <div 
                  className={`h-full bg-yellow-400 transition-all duration-100 ease-linear ${idx === currentIndex ? '' : 'opacity-0'}`}
                  style={{ 
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                    opacity: idx < currentIndex ? 1 : undefined
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header Controls */}
          <div className="absolute top-6 left-0 right-0 z-40 px-4 flex justify-between items-center pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
                 <span className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-yellow-300 border border-yellow-500/30 animate-pulse">
                    <Sparkles size={12} />
                    SONANDO: LA MOROCHA
                 </span>
            </div>
            <div className="flex gap-3 pointer-events-auto">
              <button onClick={toggleMute} className="p-3 bg-black/40 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-white/20 transition-colors border border-white/10">
                {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-red-500/80 transition-colors border border-white/10">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div 
            className="flex-1 relative w-full h-full overflow-hidden bg-gray-900"
            onClick={() => setIsPaused(!isPaused)}
          >
            {/* Image Container */}
            <div className="absolute inset-0 z-0">
                {currentEvent.image && (
                    <img 
                    key={currentEvent.id}
                    src={currentEvent.image} 
                    alt={currentEvent.title}
                    className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear transform ${isPaused ? '' : 'scale-110'}`}
                    />
                )}
                {/* Dark Overlay for better contrast with white text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
            </div>

            {/* Center Pause Indicator */}
            {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <Play className="w-24 h-24 text-white drop-shadow-lg bg-white/20 rounded-full p-6 shadow-2xl border-2 border-white/50" fill="currentColor" />
                </div>
            )}

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 pb-32 px-6 z-20 flex flex-col items-center text-center">
              
              {/* Tag */}
              <div className="mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                <span className={`
                  px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/30 text-white
                  ${currentEvent.type === 'TRIP' ? 'bg-blue-600' : currentEvent.type === 'FINANCE' ? 'bg-yellow-600' : 'bg-pink-600'}
                `}>
                  {currentEvent.type === 'TRIP' ? '✈️ EL VIAJE' : currentEvent.type === 'PARTY' ? '💃 FIESTA' : currentEvent.type === 'FINANCE' ? '💰 AHORRO' : '🍷 JUNTADA'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-7xl font-black mb-4 leading-none tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {currentEvent.title}
              </h1>

              {/* Date Card */}
              <div className="bg-white/90 text-gray-900 px-8 py-3 rounded-xl shadow-xl mb-6 transform -rotate-1 backdrop-blur-md">
                 <p className="text-xl md:text-3xl font-extrabold uppercase tracking-wide">
                    {currentEvent.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                 </p>
              </div>

              {/* Description */}
              <div className="bg-black/40 p-6 rounded-3xl shadow-xl backdrop-blur-md border border-white/10 max-w-xl mx-auto">
                <p className="text-xl md:text-2xl text-white font-medium leading-snug drop-shadow-md">
                    {currentEvent.description}
                </p>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-8 w-full flex justify-center gap-4 z-30 px-4">
             <button 
                onClick={handleShare}
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-900/50 transition-all transform active:scale-95 border border-white/20"
             >
                <Share2 size={24} fill="currentColor" />
                <span className="text-lg tracking-wide">COMPARTIR EN EL GRUPO</span>
             </button>
          </div>
        </div>
      )}
    </>
  );
};