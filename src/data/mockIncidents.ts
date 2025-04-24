export interface Victim {
  id: string;
  name: string;
  age?: number;
  condition: 'critical' | 'stable' | 'minor';
  medicalNeeds?: string[];
  location: {
    lat: number;
    lng: number;
  };
  reportTime: string;
}

export interface Incident {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  totalVictims: number;
  criticalCases: number;
  type: 'flood' | 'fire' | 'storm' | 'other';
  status: 'active' | 'resolved' | 'pending';
  requiredResources: string[];
  lastUpdate: string;
  victims: Victim[];
}

// Helper function to generate random coordinates within a radius
const generateRandomLocation = (center: { lat: number; lng: number }, radiusKm: number) => {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert radius from kilometers to radians
  const radiusInRad = radiusKm / R;

  // Generate random angle
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Generate random radius (using square root to ensure uniform distribution)
  const randomRadius = Math.sqrt(Math.random()) * radiusInRad;

  // Calculate new position
  const lat = Math.asin(
    Math.sin(center.lat * Math.PI / 180) * Math.cos(randomRadius) +
    Math.cos(center.lat * Math.PI / 180) * Math.sin(randomRadius) * Math.cos(randomAngle)
  );

  const lng = center.lng * Math.PI / 180 +
    Math.atan2(
      Math.sin(randomAngle) * Math.sin(randomRadius) * Math.cos(center.lat * Math.PI / 180),
      Math.cos(randomRadius) - Math.sin(center.lat * Math.PI / 180) * Math.sin(lat)
    );

  return {
    lat: lat * 180 / Math.PI,
    lng: lng * 180 / Math.PI
  };
};

// Helper function to generate victim names
const generateVictimName = (index: number) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'William', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirst} ${randomLast} ${index + 1}`;
};

// Helper function to generate medical needs
const possibleMedicalNeeds = [
  'insulin',
  'oxygen',
  'heart medication',
  'dialysis',
  'asthma inhaler',
  'blood pressure medication',
  'wound care',
  'antibiotics',
  'pain management',
  'respiratory support'
];

const generateMedicalNeeds = () => {
  if (Math.random() < 0.4) { // 40% chance of having medical needs
    const numNeeds = Math.floor(Math.random() * 3) + 1; // 1-3 medical needs
    const needs = new Set<string>();
    while (needs.size < numNeeds) {
      needs.add(possibleMedicalNeeds[Math.floor(Math.random() * possibleMedicalNeeds.length)]);
    }
    return Array.from(needs);
  }
  return undefined;
};

// Base incidents data
const baseIncidents = [
  {
    id: 'INC-001',
    location: { lat: 27.9506, lng: -82.4572 },
    address: '400 N Ashley Dr, Tampa, FL 33602',
    type: 'flood' as const,
    status: 'active' as const,
    requiredResources: ['medical supplies', 'water pumps', 'boats', 'emergency shelter']
  },
  {
    id: 'INC-002',
    location: { lat: 27.9477, lng: -82.4598 },
    address: '2000 N Tampa St, Tampa, FL 33602',
    type: 'flood' as const,
    status: 'active' as const,
    requiredResources: ['food', 'water', 'medical supplies', 'generators']
  },
  {
    id: 'INC-003',
    location: { lat: 27.9697, lng: -82.4627 },
    address: '5800 N Central Ave, Tampa, FL 33604',
    type: 'storm' as const,
    status: 'pending' as const,
    requiredResources: ['shelter', 'food', 'medical teams', 'power restoration']
  },
  {
    id: 'INC-004',
    location: { lat: 27.9225, lng: -82.4531 },
    address: '200 Davis Blvd, Tampa, FL 33606',
    type: 'flood' as const,
    status: 'active' as const,
    requiredResources: ['medical teams', 'boats', 'emergency shelter', 'water pumps']
  },
  {
    id: 'INC-005',
    location: { lat: 27.9419, lng: -82.4643 },
    address: '1600 W Swann Ave, Tampa, FL 33606',
    type: 'fire' as const,
    status: 'active' as const,
    requiredResources: ['medical supplies', 'fire trucks', 'evacuation support']
  },
  {
    id: 'INC-006',
    location: { lat: 27.9651, lng: -82.4321 },
    address: '3000 E Hillsborough Ave, Tampa, FL 33610',
    type: 'storm' as const,
    status: 'active' as const,
    requiredResources: ['medical teams', 'power restoration', 'debris removal']
  },
  {
    id: 'INC-007',
    location: { lat: 27.9342, lng: -82.4895 },
    address: '2505 W Kennedy Blvd, Tampa, FL 33609',
    type: 'flood' as const,
    status: 'pending' as const,
    requiredResources: ['water pumps', 'food', 'medical supplies']
  },
  {
    id: 'INC-008',
    location: { lat: 27.9559, lng: -82.4454 },
    address: '1701 E 7th Ave, Tampa, FL 33605',
    type: 'fire' as const,
    status: 'active' as const,
    requiredResources: ['fire trucks', 'medical teams', 'evacuation support']
  },
  {
    id: 'INC-009',
    location: { lat: 27.9775, lng: -82.4632 },
    address: '8005 N Armenia Ave, Tampa, FL 33604',
    type: 'storm' as const,
    status: 'active' as const,
    requiredResources: ['shelter', 'medical supplies', 'power restoration']
  },
  {
    id: 'INC-010',
    location: { lat: 27.9383, lng: -82.4738 },
    address: '901 W Platt St, Tampa, FL 33606',
    type: 'flood' as const,
    status: 'pending' as const,
    requiredResources: ['boats', 'water pumps', 'medical teams']
  }
];

// Generate 300 victims distributed across incidents
let victimCounter = 0;
export const mockIncidents: Incident[] = baseIncidents.map(incident => {
  const numVictims = Math.floor(300 / baseIncidents.length) + (Math.random() < 0.5 ? 1 : 0);
  const victims: Victim[] = [];
  const criticalCases = Math.floor(numVictims * 0.4); // 40% critical cases

  for (let i = 0; i < numVictims; i++) {
    const condition = i < criticalCases ? 'critical' : (Math.random() < 0.5 ? 'stable' : 'minor');
    const location = generateRandomLocation(incident.location, 0.5); // 0.5 km radius
    const reportTime = new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(); // Random time in last 12 hours
    
    victims.push({
      id: `V${incident.id}-${++victimCounter}`,
      name: generateVictimName(victimCounter),
      age: Math.random() < 0.8 ? Math.floor(Math.random() * 80) + 5 : undefined, // 80% chance of having age
      condition,
      medicalNeeds: condition === 'critical' ? generateMedicalNeeds() : undefined,
      location,
      reportTime
    });
  }

  return {
    ...incident,
    totalVictims: numVictims,
    criticalCases,
    lastUpdate: new Date().toISOString(),
    victims
  };
}); 