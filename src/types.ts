export interface Track {
  id: string;
  title: string;
  album: string;
  duration: string;
  plays: number;
  releaseDate: string;
  coverUrl: string;
  genre: string;
}

export interface TourDate {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketStatus: 'available' | 'low_tickets' | 'sold_out';
  ticketPrice: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: 'general' | 'booking' | 'collaboration' | 'press';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'performance' | 'studio' | 'backstage';
}
