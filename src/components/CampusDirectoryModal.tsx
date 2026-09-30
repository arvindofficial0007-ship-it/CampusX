import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building, RoomDetail } from '../types';
import { 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  GraduationCap, 
  BookOpen, 
  Coffee, 
  Activity, 
  ShieldAlert, 
  Home, 
  Palette, 
  Bus, 
  ArrowRight,
  Layers
} from 'lucide-react';

interface CampusDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Building[];
  onSelectBuilding: (building: Building) => void;
  onRouteToBuilding: (building: Building, room?: RoomDetail) => void;
}

export const CampusDirectoryModal: React.FC<CampusDirectoryModalProps> = ({
  isOpen,
  onClose,
  buildings,
  onSelectBuilding,
  onRouteToBuilding
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Buildings', icon: '🏛️' },
    { id: 'academic', label: 'Academic & Labs', icon: '💻' },
    { id: 'library', label: 'Libraries & Study', icon: '📚' },
    { id: 'dining', label: 'Dining & Cafes', icon: '🍔' },
    { id: 'sports', label: 'Sports & Rec', icon: '⚽' },
    { id: 'health', label: 'Health & Clinic', icon: '🏥' },
    { id: 'residential', label: 'Dorms & Housing', icon: '🛏️' },
    { id: 'arts', label: 'Arts & Media', icon: '🎨' },
    { id: 'transit', label: 'Transit & Parking', icon: '🚌' }
  ];

  const filteredBuildings = useMemo(() => {
    return buildings.filter(bldg => {
      const matchesCategory = activeCategory === 'all' || bldg.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = bldg.name.toLowerCase().includes(q) || bldg.shortName.toLowerCase().includes(q) || bldg.code.toLowerCase().includes(q);
      const matchesDepts = bldg.departments.some(d => d.toLowerCase().includes(q));
      const matchesRooms = bldg.rooms.some(r => r.name.toLowerCase().includes(q) || r.roomNumber.toLowerCase().includes(q) || (r.headOrProfessor && r.headOrProfessor.toLowerCase().includes(q)));
      const matchesAmenities = bldg.amenities.some(a => a.name.toLowerCase().includes(q));

      return matchesCategory && (matchesName || matchesDepts || matchesRooms || matchesAmenities);
    });
  }, [buildings, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Campus Directory & Room Finder</h3>
                <p className="text-xs text-slate-400">Search all buildings, classrooms, research labs, and amenities</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input & Category Filter Chips */}
          <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by building name, code (e.g. CS, ADM), professor, room number (e.g. 101), or lab..."
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            {/* Category scroll row */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buildings Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map(bldg => (
                <div
                  key={bldg.id}
                  className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-0.5 text-xs font-bold font-mono rounded text-slate-950"
                        style={{ backgroundColor: bldg.color }}
                      >
                        {bldg.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {bldg.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {bldg.floors.length} Floors
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {bldg.description}
                    </p>

                    {/* Matching rooms list preview */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {bldg.rooms.slice(0, 3).map(room => (
                        <button
                          key={room.id}
                          onClick={() => {
                            onRouteToBuilding(bldg, room);
                            onClose();
                          }}
                          className="px-2 py-0.5 bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 rounded text-[11px] font-mono transition-colors"
                        >
                          Room {room.roomNumber}: {room.name}
                        </button>
                      ))}
                      {bldg.rooms.length > 3 && (
                        <span className="text-[11px] text-slate-500 self-center">
                          +{bldg.rooms.length - 3} more rooms
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectBuilding(bldg);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Floors
                    </button>
                    <button
                      onClick={() => {
                        onRouteToBuilding(bldg);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <p className="text-sm">No buildings or classrooms found matching "{searchQuery}".</p>
                <p className="text-xs">Try searching by building code (CS, LIB, ADM) or department name.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
