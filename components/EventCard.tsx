import React, { useState } from 'react';
import { AppEvent, EventType } from '../types';
import { Calendar, MapPin, Sparkles, ChevronDown, ChevronUp, PartyPopper, Users, PiggyBank, Plane } from 'lucide-react';
import { getEventRecommendations } from '../services/geminiService';

interface EventCardProps {
  event: AppEvent;
  isNext: boolean;
  colorTheme: 'indigo' | 'pink' | 'orange' | 'teal';
}

export const EventCard: React.FC<EventCardProps> = ({ event, isNext, colorTheme }) => {
  const [expanded, setExpanded] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleExpand = async () => {
    setExpanded(!expanded);
    if (!expanded && !aiContent && process.env.API_KEY) {
      setLoadingAi(true);
      const tips = await getEventRecommendations(event);
      setAiContent(tips);
      setLoadingAi(false);
    }
  };

  const getIcon = (type: EventType) => {
    switch (type) {
      case EventType.TRIP: return <Plane className="w-6 h-6 text-blue-500" />;
      case EventType.PARTY: return <PartyPopper className="w-6 h-6 text-pink-500" />;
      case EventType.GATHERING: return <Users className="w-6 h-6 text-green-500" />;
      case EventType.FINANCE: return <PiggyBank className="w-6 h-6 text-yellow-500" />;
      default: return <Calendar className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: EventType) => {
     switch (type) {
      case EventType.TRIP: return 'Viaje';
      case EventType.PARTY: return 'Fiesta';
      case EventType.GATHERING: return 'Juntada';
      case EventType.FINANCE: return 'Finanzas';
      default: return 'Evento';
    }
  }

  const getThemeColor = () => {
      switch(colorTheme) {
          case 'pink': return 'ring-pink-200 text-pink-600 bg-pink-600';
          case 'orange': return 'ring-orange-200 text-orange-600 bg-orange-600';
          case 'teal': return 'ring-teal-200 text-teal-600 bg-teal-600';
          default: return 'ring-indigo-200 text-indigo-600 bg-indigo-600';
      }
  }

  return (
    <div className={`relative group rounded-2xl bg-white border transition-all duration-300 ${isNext ? `ring-4 shadow-xl scale-[1.01] border-transparent ${getThemeColor().split(' ')[0]}` : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
      {isNext && (
        <div className={`absolute -top-3 -right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 ${getThemeColor().split(' ')[2]}`}>
          PRÓXIMO
        </div>
      )}
      
      <div className="p-5 cursor-pointer" onClick={handleExpand}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 shadow-inner`}>
              {getIcon(event.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{getTypeLabel(event.type)}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-medium text-gray-500">{event.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{event.title}</h3>
              {event.location && (
                <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
          <button className={`transition-colors ${expanded ? getThemeColor().split(' ')[1] : 'text-gray-400 hover:text-gray-600'}`}>
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
            <div className="flex gap-4">
               {/* Thumbnail in description */}
               {event.image && (
                   <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover shadow-sm hidden sm:block" />
               )}
               <div>
                 <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                 {event.endDate && (
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">
                        Hasta el {event.endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </div>
                 )}
               </div>
            </div>

            <div className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border shadow-sm ${colorTheme === 'pink' ? 'border-pink-100' : 'border-indigo-100'}`}>
              <div className={`flex items-center gap-2 mb-3 ${getThemeColor().split(' ')[1]}`}>
                <Sparkles className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase">Gemini AI Tips</h4>
              </div>
              
              {loadingAi ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                  <span>Pensando sugerencias divertidas...</span>
                </div>
              ) : aiContent ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line italic">
                  "{aiContent}"
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {process.env.API_KEY ? "Toca para ver tips de IA..." : "Configura tu API Key para ver sugerencias."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};