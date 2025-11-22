export enum EventType {
  PARTY = 'PARTY',
  TRIP = 'TRIP',
  GATHERING = 'GATHERING',
  FINANCE = 'FINANCE',
  OTHER = 'OTHER'
}

export interface AppEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  description: string;
  location?: string;
  type: EventType;
  tags: string[];
  image?: string; // Added for presentation mode
}

export interface AIRecommendation {
  tips: string[];
  weatherForecast?: string;
  packingList?: string[];
}