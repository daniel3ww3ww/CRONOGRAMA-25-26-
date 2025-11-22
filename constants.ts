import { AppEvent, EventType } from './types';

export const INITIAL_EVENTS: AppEvent[] = [
  {
    id: '1',
    title: 'Corralitos 2025',
    date: new Date('2025-12-14T12:00:00'),
    description: '¡Apertura de temporada! El gran festejo del 14 de diciembre. Comida, baile y amigas.',
    type: EventType.PARTY,
    location: 'Corralitos',
    tags: ['Festejo', 'Verano'],
    // Illustration of a party/celebration with women
    image: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=1000&auto=format&fit=crop' 
  },
  {
    id: '2',
    title: 'Fondo Común',
    date: new Date('2026-01-02T10:00:00'),
    description: 'Empezamos el año organizadas. Inicio del fondo común "Salidas fin de semana" para disfrutar sin culpas.',
    type: EventType.FINANCE,
    tags: ['Ahorro', 'Organización'],
    // Colorful abstract/planning illustration style
    image: 'https://images.unsplash.com/photo-1565514020176-dbf2277cc1c7?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'La Juntada',
    date: new Date('2026-01-28T21:00:00'),
    description: 'Reencuentro oficial de enero. Prohibido faltar, hay mucho para charlar.',
    type: EventType.GATHERING,
    location: 'A confirmar',
    tags: ['Cena', 'Amigas'],
    // Illustration-like happy moment of friends
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Potrero de los Funes',
    date: new Date('2026-03-04T08:00:00'),
    endDate: new Date('2026-03-08T18:00:00'),
    description: '¡Nos vamos! Del 4 al 8 de marzo. Sierras, mates, paisajes y relax total.',
    type: EventType.TRIP,
    location: 'San Luis',
    tags: ['Viaje', 'Sierras'],
    // Travel illustration vibe
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Gran Viaje Septiembre',
    date: new Date('2026-09-13T08:00:00'),
    description: 'El momento más esperado del 2026. ¡A preparar las maletas chicas!',
    type: EventType.TRIP,
    tags: ['Turismo', 'Aventura'],
    // Vibrant travel artwork
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Salida (End of Year)',
    date: new Date('2026-11-14T21:00:00'), 
    description: 'Noche especial de noviembre. Brillos, tragos y despedida del año.',
    type: EventType.PARTY,
    tags: ['Noche', 'Fiesta'],
    // Disco/Party art style
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Expresión Gaitas',
    date: new Date('2026-12-12T20:00:00'),
    description: 'Cierre cultural y festivo. Con o sin muchachos, ¡nosotras festejamos igual!',
    type: EventType.PARTY,
    tags: ['Música', 'Tradición'],
    // Colorful music/celebration art
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop'
  }
];