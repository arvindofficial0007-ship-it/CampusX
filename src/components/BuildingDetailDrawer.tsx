import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building, RoomDetail, MapNode } from '../types';
import { 
  X, 
  Navigation, 
  MapPin, 
  Clock, 
  Phone, 
  Accessibility, 
  BookOpen, 
  Wifi, 
  Printer, 
  Coffee, 
  Layers, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface BuildingDetailDrawerProps {
  building: Building | null;
  onClose: () => void;
  selectedFloor: number;
  onSelectFloor: (floor: number) => void;
  onNavigateToBuilding: (building: Building, room?: RoomDetail) => void;
  onSetAsCurrentLocation: (building: Building) => void;
}

export const BuildingDetailDrawer: React.FC<BuildingDetailDrawerProps> = ({
  building,
  onClose,
  selectedFloor,
  onSelectFloor,
  onNavigateToBuilding,
  onSetAsCurrentLocation
}) => {
  if (!building) return null;

  const currentFloorRooms = building.rooms.filter(r => r.floor === selectedFloor);

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/98 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header with Banner */}
        <div className="relative p-5 pb-4 bg-slate-950/80 border-b border-slate-800">
          {/* Top accent bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: building.color }}
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-slate-950 shadow-lg"
                style={{ backgroundColor: building.color }}
              >
                {building.code}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {building.category.toUpperCase()} COMPLEX
                </span>
                <h3 className="text-base font-bold text-slate-100 leading-tight">
                  {building.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {building.description}
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              id="btn-navigate-to-building"
              onClick={() => onNavigateToBuilding(building)}
              className="py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>

            <button
              id="btn-set-as-start"
              onClick={() => onSetAsCurrentLocation(building)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>I'm Here Now</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Floor Level Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Floor Directory
              </span>
              <span className="text-[11px] text-slate-500">
                {building.floors.length} Levels Available
              </span>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {building.floors.map(floor => (
                <button
                  key={floor}
                  onClick={() => onSelectFloor(floor)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedFloor === floor
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {floor === 0 ? 'Ground' : `Floor ${floor}`}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms on Selected Floor */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Rooms on {selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`}
            </span>

            {currentFloorRooms.length > 0 ? (
              <div className="space-y-2">
                {currentFloorRooms.map(room => (
                  <div
                    key={room.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 px-1.5 py-0.5 bg-emerald-950/60 border border-emerald-800/40 rounded">
                          {room.roomNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                          {room.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        {room.headOrProfessor && (
                          <span>Lead: {room.headOrProfessor}</span>
                        )}
                        {room.capacity && (
                          <span>• Cap: {room.capacity} seats</span>
                        )}
                      </div>

                      {room.occupancyStatus && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            room.occupancyStatus === 'Available' ? 'bg-emerald-400' :
                            room.occupancyStatus === 'Quiet Study' ? 'bg-teal-400' :
                            'bg-amber-400'
                          }`} />
                          <span className="text-[10px] font-semibold text-slate-300">
                            {room.occupancyStatus}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigateToBuilding(building, room)}
                      className="p-2 bg-slate-800 group-hover:bg-emerald-500 text-slate-300 group-hover:text-slate-950 rounded-lg transition-all shadow-sm"
                      title={`Route directly to Room ${room.roomNumber}`}
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                General lecture halls & offices on this level. Use main directory board at elevator entrance.
              </div>
            )}
          </div>

          {/* Building Amenities */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Building Amenities & Facilities
            </span>
            <div className="grid grid-cols-2 gap-2">
              {building.amenities.map(amenity => (
                <div
                  key={amenity.id}
                  className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    {amenity.type === 'wifi' ? <Wifi className="w-3.5 h-3.5" /> :
                     amenity.type === 'printer' ? <Printer className="w-3.5 h-3.5" /> :
                     amenity.type === 'cafe' ? <Coffee className="w-3.5 h-3.5" /> :
                     <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 text-[11px] leading-tight">{amenity.name}</p>
                    <p className="text-[10px] text-slate-500">{amenity.floor !== undefined ? `Floor ${amenity.floor}` : 'Building-wide'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments Directory */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Departments & Divisions
            </span>
            <div className="space-y-1.5">
              {building.departments.map((dept, dIdx) => (
                <div key={dIdx} className="px-3 py-1.5 bg-slate-950/50 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{dept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hours & Contact Information */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{building.openingHours}</span>
            </div>
            {building.emergencyContact && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Security / Desk: {building.emergencyContact}</span>
              </div>
            )}
          </div>

          {/* Accessibility Info */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Accessibility className="w-3.5 h-3.5 text-teal-400" />
              Accessibility Features
            </span>
            <div className="space-y-1.5">
              {building.accessibilityFeatures.map((feat, fIdx) => (
                <div key={fIdx} className="px-3 py-1.5 bg-teal-950/20 border border-teal-800/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Fact */}
          {building.historicalFact && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
              💡 <strong className="text-slate-300 not-italic">Campus Fact:</strong> {building.historicalFact}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
