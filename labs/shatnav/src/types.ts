export interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  type: 'wee' | 'poo' | 'both';
  rating: number; // 1 to 5
  cleanlinessScore: number; // 1 to 5
  smellScore: number; // 1 to 5
  paperScore: number; // 1 to 5
  comment: string;
  hostReply?: string;
  verifiedVisit: boolean;
}

export interface BathroomListing {
  id: string;
  title: string;
  tagline: string;
  hostName: string;
  hostAvatar: string;
  hostBadge: 'SuperHost' | 'Throne Veteran' | 'Cleanliness Champion' | 'Porcelain Purist';
  address: string;
  neighborhood: string;
  city: 'London' | 'New York' | 'San Francisco' | 'Paris' | 'Tokyo';
  position: { lat: number; lng: number };
  weePrice: number; // default $1.00
  pooPrice: number; // default $2.00
  status: 'available' | 'in-use' | 'cleaning' | 'closed';
  inUseRemainingMins?: number;
  cleanlinessScore: number; // e.g. 4.9
  reviewCount: number;
  paperPly: 2 | 3 | 4;
  floorLevel: 'Ground Floor (Step-Free)' | '1st Floor' | '2nd Floor' | 'Basement';
  amenities: {
    bidet: boolean;
    heatedSeat: boolean;
    stepFree: boolean;
    wifi: boolean;
    scentedCandles: boolean;
    courtesyRadio: boolean;
    luxurySoaps: boolean;
    babyChange: boolean;
    wetWipes: boolean;
    privateEntrance: boolean;
  };
  image: string;
  gallery: string[];
  description: string;
  doorCodeInstructions: string;
  defaultDoorCode: string;
  recentReviews: Review[];
  totalVisits: number;
}

export interface ActiveBooking {
  id: string;
  bathroomId: string;
  bathroomTitle: string;
  hostName: string;
  address: string;
  serviceType: 'wee' | 'poo' | 'combo';
  baseCost: number;
  selectedAddons: { name: string; price: number }[];
  totalCost: number;
  status: 'navigating' | 'arrived' | 'in_throne' | 'completed';
  startTime: number;
  allocatedMinutes: number;
  doorCode: string;
  doorInstructions: string;
  courtesyFlushes: number;
  intercomMessages: { sender: 'host' | 'guest'; text: string; time: string }[];
}

export interface FilterState {
  serviceType: 'all' | 'wee' | 'poo';
  maxDistanceM: number;
  emergencyOnly: boolean;
  needBidet: boolean;
  stepFreeOnly: boolean;
  minCleanliness: number;
  searchQuery: string;
}

export interface HostStats {
  totalEarned: number;
  totalWees: number;
  totalPoos: number;
  averageRating: number;
  isOnline: boolean;
}
