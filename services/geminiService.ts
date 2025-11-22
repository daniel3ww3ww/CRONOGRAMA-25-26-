import { GoogleGenAI, Type } from "@google/genai";
import { AppEvent } from '../types';

export const getEventRecommendations = async (event: AppEvent): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning mock data or empty string.");
    return "Please provide a valid API Key to get AI insights.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Actúa como un organizador de eventos experto y agente de viajes.
    Tengo un evento planificado:
    - Título: ${event.title}
    - Descripción: ${event.description}
    - Fecha: ${event.date.toLocaleDateString()}
    ${event.location ? `- Ubicación: ${event.location}` : ''}
    
    Proporciona una respuesta breve, útil y divertida (máximo 150 palabras) que incluya:
    1. Una idea divertida o recomendación para este evento.
    2. Si es un viaje, qué no puede faltar en la maleta.
    3. Si es una fiesta, una sugerencia de tema o actividad.
    
    Formato: Texto plano con emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster, simpler response
      }
    });
    return response.text || "No se pudieron generar recomendaciones en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini recommendations:", error);
    return "Hubo un error consultando a tu asistente IA. Intenta más tarde.";
  }
};