import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  eventName: string;
  colorTheme: 'indigo' | 'pink' | 'orange' | 'teal';
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, eventName, colorTheme }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const getGradient = () => {
    switch(colorTheme) {
        case 'pink': return 'from-pink-600 to-rose-500';
        case 'orange': return 'from-orange-500 to-red-500';
        case 'teal': return 'from-teal-500 to-emerald-500';
        default: return 'from-indigo-600 to-purple-600';
    }
  };

  const getHighlight = () => {
     switch(colorTheme) {
        case 'pink': return 'text-pink-200';
        case 'orange': return 'text-yellow-200';
        case 'teal': return 'text-teal-200';
        default: return 'text-indigo-200';
    }
  }

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center p-6 bg-gray-100 rounded-xl shadow-inner">
        <h3 className="text-lg font-semibold text-gray-500">¡El evento ha comenzado o ya pasó!</h3>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${getGradient()} rounded-2xl p-6 md:p-8 text-white shadow-xl transform hover:scale-[1.02] transition-all duration-300 ring-4 ring-white/50`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className={`inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider font-bold mb-2 ${getHighlight()}`}>
            No falta nada
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-1">{eventName}</h2>
          <p className="opacity-90 text-lg font-medium">{targetDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex gap-3 md:gap-4">
          <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-xl p-3 w-16 md:w-20 border border-white/10">
            <span className="text-2xl md:text-3xl font-bold">{timeLeft.days}</span>
            <span className="text-[10px] md:text-xs uppercase opacity-70">Días</span>
          </div>
          <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-xl p-3 w-16 md:w-20 border border-white/10">
            <span className="text-2xl md:text-3xl font-bold">{timeLeft.hours}</span>
            <span className="text-[10px] md:text-xs uppercase opacity-70">Hs</span>
          </div>
          <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-xl p-3 w-16 md:w-20 border border-white/10">
            <span className="text-2xl md:text-3xl font-bold">{timeLeft.minutes}</span>
            <span className="text-[10px] md:text-xs uppercase opacity-70">Min</span>
          </div>
          <div className="flex flex-col items-center bg-white text-gray-900 rounded-xl p-3 w-16 md:w-20 shadow-lg animate-pulse">
            <span className="text-2xl md:text-3xl font-bold">{timeLeft.seconds}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold text-gray-500">Seg</span>
          </div>
        </div>
      </div>
    </div>
  );
};