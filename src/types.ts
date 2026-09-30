export type TransportMode = 'walk' | 'wheelchair' | 'bicycle' | 'indoor_safe';

export interface Amenity {
  id: string;
  name: string;
  type: 'wifi' | 'power_outlet' | 'printer' | 'water_station' | 'restroom' | 'atm' | 'cafe' | 'elevator' | 'emergency_call' | 'microwaves' | 'quiet_zone';
  icon?: string;
  floor?: number;
  description?: string;
}

export interface RoomDetail {
  id: string;
  roomNumber: string;
  name: string;
  type: 'lecture_hall' | 'lab' | 'faculty_office' | 'study_room' | 'admin' | 'restroom' | 'cafe' | 'auditorium';
  floor: number;
  capacity?: number;
  occupancyStatus?: 'Available' | 'In Class' | 'Quiet Study' | 'Reserved';
  features?: string[];
  headOrProfessor?: string;
  hours?: string;
}

export interface Building {
  id: string;
  name: string;
  shortName: string;
  code: string;
  category: 'academic' | 'library' | 'dining' | 'sports' | 'admin' | 'residential' | 'health' | 'transit' | 'arts';
  x: number; // 0 - 1000 coordinate system
  y: number;
  width: number;
  height: number;
  color: string;
  accentColor: string;
  floors: number[];
  entranceNodeId: string;
  description: string;
  fullOverview: string;
  departments: string[];
  rooms: RoomDetail[];
  amenities: Amenity[];
  openingHours: string;
  accessibilityFeatures: string[];
  emergencyContact?: string;
  image?: string;
  historicalFact?: string;
}

export interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  floor?: number;
  buildingId?: string;
  type: 'junction' | 'building_entrance' | 'gate' | 'plaza' | 'stairs' | 'elevator' | 'ramp' | 'bus_stop';
  accessible: boolean;
  indoor: boolean;
  connections: Array<{
    targetNodeId: string;
    distanceMeters: number;
    accessible: boolean;
    indoor: boolean;
    stairs?: boolean;
    elevator?: boolean;
    pathType: 'walkway' | 'corridor' | 'ramp' | 'stairs' | 'elevator' | 'road' | 'garden_path' | 'skybridge';
  }>;
}

export interface RouteStep {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  pathType: 'walkway' | 'corridor' | 'ramp' | 'stairs' | 'elevator' | 'road' | 'garden_path' | 'skybridge';
  nodeId: string;
  waypointName: string;
  floorLevel?: number;
  isAccessible: boolean;
  landmarkHint?: string;
}

export interface NavigationRoute {
  fromPOI: Building | MapNode;
  toPOI: Building | MapNode;
  startRoom?: RoomDetail;
  destinationRoom?: RoomDetail;
  mode: TransportMode;
  pathNodeIds: string[];
  pathCoordinates: Array<{ x: number; y: number; floor?: number; name?: string }>;
  totalDistanceMeters: number;
  estimatedTimeMinutes: number;
  estimatedCalories: number;
  steps: RouteStep[];
  accessibilityScore: number; // 100 is fully accessible
  warnings: string[];
  isWeatherSafe: boolean;
}

export interface AgentActionCard {
  type: 'navigate' | 'building_info' | 'room_info' | 'schedule_plan' | 'emergency' | 'study_recommendation' | 'dining_recommendation';
  buildingId?: string;
  roomId?: string;
  fromId?: string;
  toId?: string;
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  actionCard?: AgentActionCard;
  suggestedFollowUps?: string[];
  isAudioPlaying?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  buildingId: string;
  roomName: string;
  time: string;
  category: 'academic' | 'workshop' | 'cultural' | 'sports' | 'career';
  description: string;
}

export interface StudentScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  buildingId: string;
  roomNumber: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

export interface CampusPreset {
  id: string;
  name: string;
  shortName: string;
  motto: string;
  location: string;
  buildings: Building[];
  nodes: MapNode[];
  events: CampusEvent[];
  shuttleSchedule: Array<{ routeName: string; nextArrivalMins: number; stops: string[] }>;
}
