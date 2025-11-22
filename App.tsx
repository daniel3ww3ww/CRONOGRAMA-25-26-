import React, { useState, useMemo } from 'react';
import { INITIAL_EVENTS } from './constants';
import { AppEvent, EventType } from './types';
import { EventCard } from './components/EventCard';
import { Countdown } from './components/Countdown';
import { StoryMode } from './components/StoryMode';
import { CalendarDays, Filter, PlayCircle, Palette, QrCode, X } from 'lucide-react';

// Theme definition
type ColorTheme = 'indigo' | 'pink' | 'orange' | 'teal';

const THEMES: Record<ColorTheme, { primary: string, secondary: string, gradient: string, button: string }> = {
  indigo: {
    primary: 'text-indigo-600',
    secondary: 'bg-indigo-50',
    gradient: 'from-indigo-900 to-indigo-800',
    button: 'bg-indigo-600'
  },
  pink: {
    primary: 'text-pink-600',
    secondary: 'bg-pink-50',
    gradient: 'from-pink-900 to-pink-800',
    button: 'bg-pink-600'
  },
  orange: {
    primary: 'text-orange-600',
    secondary: 'bg-orange-50',
    gradient: 'from-orange-900 to-orange-800',
    button: 'bg-orange-600'
  },
  teal: {
    primary: 'text-teal-600',
    secondary: 'bg-teal-50',
    gradient: 'from-teal-900 to-teal-800',
    button: 'bg-teal-600'
  }
};

const App: React.FC = () => {
  const [events] = useState<AppEvent[]>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<EventType | 'ALL'>('ALL');
  const [showPresentation, setShowPresentation] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('pink'); // Default to pink for festive vibe

  // Sort events chronologically
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  // Find next upcoming event
  const nextEvent = useMemo(() => {
    const now = new Date();
    return sortedEvents.find(event => event.date > now) || sortedEvents[sortedEvents.length - 1];
  }, [sortedEvents]);

  // Filtered list for display
  const displayedEvents = useMemo(() => {
    if (filter === 'ALL') return sortedEvents;
    return sortedEvents.filter(event => event.type === filter);
  }, [sortedEvents, filter]);

  const currentTheme = THEMES[colorTheme];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      
      {/* Story Mode Overlay */}
      {showPresentation && (
        <StoryMode 
          events={sortedEvents} 
          onClose={() => setShowPresentation(false)} 
        />
      )}

      {/* QR Modal Overlay */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQr(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${currentTheme.secondary}`}>
              <QrCode className={`w-8 h-8 ${currentTheme.primary}`} />
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-900">¡Invitá al grupo!</h3>
            <p className="text-gray-500 text-sm mb-6">Escaneá este código para abrir el cronograma en otro celular.</p>
            
            <div className="bg-white p-2 border-2 border-dashed border-gray-200 rounded-xl inline-block mb-4">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&color=000000&bgcolor=ffffff`} 
                 alt="QR Code" 
                 className="w-48 h-48 object-contain rounded-lg"
               />
            </div>
            
            <button 
              onClick={() => setShowQr(false)}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${currentTheme.button}`}
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* Header Section with Image Background */}
      <div className={`relative bg-gray-900 text-white overflow-hidden transition-colors duration-500`}>
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop" 
             alt="Background Party" 
             className="w-full h-full object-cover animate-pulse"
             style={{ animationDuration: '10s' }}
           />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-b ${currentTheme.gradient} opacity-90`}></div>
        
        {/* Top Controls: QR & Color Picker */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          {/* QR Button */}
          <button 
            onClick={() => setShowQr(true)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/20 transition-all shadow-sm"
            title="Compartir App"
          >
            <QrCode size={18} />
            <span className="text-xs font-bold hidden sm:inline">COMPARTIR</span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20"></div>

          {/* Color Picker */}
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            <Palette size={14} className="text-white/70 ml-2" />
            <div className="flex gap-1">
              {(Object.keys(THEMES) as ColorTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setColorTheme(theme)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${colorTheme === theme ? 'border-white scale-110' : 'border-transparent opacity-70'}
                  ${theme === 'indigo' ? 'bg-indigo-500' : ''}
                  ${theme === 'pink' ? 'bg-pink-500' : ''}
                  ${theme === 'orange' ? 'bg-orange-500' : ''}
                  ${theme === 'teal' ? 'bg-teal-500' : ''}
                  `}
                  title={`Tema ${theme}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 pt-20 pb-28 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20 shadow-lg">
            <CalendarDays className="w-4 h-4" />
            <span>Cronograma Oficial 2025 — 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-xl font-serif">
            Festejos & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-300">Viajes</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto mb-10 font-light leading-relaxed">
            La agenda definitiva para no perderse nada. Organiza tus finanzas, prepara las maletas y prepárate para festejar con las chicas.
          </p>
          
          <button 
            onClick={() => setShowPresentation(true)}
            className="group relative inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-white/50"
          >
            <PlayCircle className={`w-6 h-6 ${currentTheme.primary}`} />
            <span className="tracking-wide">VER PRESENTACIÓN VISTOSA</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 -mt-20 max-w-3xl relative z-10">
        
        {/* Countdown Card */}
        {nextEvent && (
          <div className="mb-10">
            <Countdown 
              targetDate={nextEvent.date} 
              eventName={nextEvent.title} 
              colorTheme={colorTheme}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter(EventType.TRIP)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === EventType.TRIP ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-blue-50'}`}
          >
            ✈️ Viajes
          </button>
          <button 
            onClick={() => setFilter(EventType.PARTY)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === EventType.PARTY ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500 hover:bg-pink-50'}`}
          >
            🎉 Fiestas
          </button>
          <button 
            onClick={() => setFilter(EventType.FINANCE)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === EventType.FINANCE ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-500 hover:bg-yellow-50'}`}
          >
            💰 $$
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-6 relative">
          {/* Vertical Line (Decoration) */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block -z-10"></div>

          {displayedEvents.map((event) => (
            <div key={event.id} className="md:pl-10 relative">
              {/* Timeline Dot (Desktop only) */}
              <div className={`hidden md:block absolute left-[30px] top-10 w-4 h-4 rounded-full border-4 border-white shadow-sm transform -translate-x-1/2 transition-colors duration-300 ${
                event.id === nextEvent?.id ? currentTheme.button : 'bg-gray-300'
              }`}></div>
              
              <EventCard 
                event={event} 
                isNext={event.id === nextEvent?.id} 
                colorTheme={colorTheme}
              />
            </div>
          ))}

          {displayedEvents.length === 0 && (
             <div className="text-center py-12 text-gray-400">
               <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>No hay eventos en esta categoría.</p>
             </div>
          )}
        </div>
      </div>
      
      <footer className="text-center text-gray-400 text-sm py-10 mt-10 border-t border-gray-200">
        <p className="font-semibold">© 2025-2026 Grupo Amigas</p>
        <p className="text-xs mt-1 opacity-60">Hecho con cariño para el grupo</p>
      </footer>
    </div>
  );
};

export default App;