import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapNode, 
  NavigationRoute, 
  TransportMode, 
  RoomDetail, 
  CampusPreset, 
  StudentScheduleItem,
  AgentActionCard
} from './types';
import { 
  DEFAULT_CAMPUS_PRESET, 
  SAMPLE_STUDENT_SCHEDULE, 
  ALTERNATIVE_CAMPUS_PRESETS 
} from './data/campusData';
import { buildCompleteNavigationRoute, calculateBearing } from './utils/pathfinding';
import { CampusMap } from './components/CampusMap';
import { NavigationAgentChat } from './components/NavigationAgentChat';
import { RoutePlannerBar } from './components/RoutePlannerBar';
import { BuildingDetailDrawer } from './components/BuildingDetailDrawer';
import { CampusDirectoryModal } from './components/CampusDirectoryModal';
import { ScheduleOptimizerModal } from './components/ScheduleOptimizerModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { CampusCustomizerModal } from './components/CampusCustomizerModal';

import { 
  Navigation, 
  Bot, 
  Search, 
  Calendar, 
  ShieldAlert, 
  Settings, 
  Layers, 
  Sparkles, 
  Compass, 
  Sun, 
  Footprints, 
  GraduationCap,
  MapPin,
  HelpCircle,
  Bus
} from 'lucide-react';

export default function App() {
  const [campusPreset, setCampusPreset] = useState<CampusPreset>(DEFAULT_CAMPUS_PRESET);
  const [schedule, setSchedule] = useState<StudentScheduleItem[]>(SAMPLE_STUDENT_SCHEDULE);
  
  // Navigation State
  const [currentLocationNodeId, setCurrentLocationNodeId] = useState<string>('node_north_gate');
  const [selectedStartPOI, setSelectedStartPOI] = useState<Building | MapNode>(
    campusPreset.nodes.find(n => n.id === 'node_north_gate') || campusPreset.nodes[0]
  );
  const [selectedDestinationPOI, setSelectedDestinationPOI] = useState<Building | MapNode | null>(
    campusPreset.buildings.find(b => b.id === 'bldg_cs_ai') || null
  );
  const [selectedStartRoom, setSelectedStartRoom] = useState<RoomDetail | undefined>(undefined);
  const [selectedDestRoom, setSelectedDestRoom] = useState<RoomDetail | undefined>(undefined);
  const [transportMode, setTransportMode] = useState<TransportMode>('walk');
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);

  // Inspector & Map Filter
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals & Panels
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState<boolean>(true);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // GPS Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [simulatedPosition, setSimulatedPosition] = useState<{
    x: number;
    y: number;
    angle: number;
    stepIndex: number;
  } | null>(null);

  const simulationIntervalRef = useRef<any>(null);

  // Recompute route when start, destination, mode, or rooms change
  useEffect(() => {
    if (selectedStartPOI && selectedDestinationPOI) {
      const route = buildCompleteNavigationRoute(
        selectedStartPOI,
        selectedDestinationPOI,
        campusPreset.nodes,
        transportMode,
        selectedStartRoom,
        selectedDestRoom
      );
      setActiveRoute(route);
    } else {
      setActiveRoute(null);
    }
  }, [selectedStartPOI, selectedDestinationPOI, transportMode, selectedStartRoom, selectedDestRoom, campusPreset]);

  // Handle GPS simulation walk loop
  useEffect(() => {
    if (!isSimulating || !activeRoute || activeRoute.pathCoordinates.length < 2) {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      return;
    }

    const coords = activeRoute.pathCoordinates;
    let currentIdx = simulatedPosition?.stepIndex || 0;
    let progress = 0; // 0 to 1 between nodes

    simulationIntervalRef.current = setInterval(() => {
      progress += 0.05 * simulationSpeed;
      if (progress >= 1) {
        progress = 0;
        currentIdx++;
      }

      if (currentIdx >= coords.length - 1) {
        // Arrived at destination!
        const lastNode = coords[coords.length - 1];
        setSimulatedPosition({
          x: lastNode.x,
          y: lastNode.y,
          angle: 0,
          stepIndex: coords.length - 1
        });
        setIsSimulating(false);
        clearInterval(simulationIntervalRef.current);
        return;
      }

      const p1 = coords[currentIdx];
      const p2 = coords[currentIdx + 1];
      const currentX = p1.x + (p2.x - p1.x) * progress;
      const currentY = p1.y + (p2.y - p1.y) * progress;
      const bearing = calculateBearing(p1.x, p1.y, p2.x, p2.y);

      setSimulatedPosition({
        x: currentX,
        y: currentY,
        angle: bearing,
        stepIndex: currentIdx
      });
    }, 50);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isSimulating, activeRoute, simulationSpeed]);

  const handleStartSimulation = () => {
    if (!activeRoute || activeRoute.pathCoordinates.length < 2) return;
    const firstPt = activeRoute.pathCoordinates[0];
    const secondPt = activeRoute.pathCoordinates[1];
    setSimulatedPosition({
      x: firstPt.x,
      y: firstPt.y,
      angle: calculateBearing(firstPt.x, firstPt.y, secondPt.x, secondPt.y),
      stepIndex: 0
    });
    setIsSimulating(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulatedPosition(null);
  };

  // Set user current location
  const handleSetCurrentLocationNode = (nodeId: string) => {
    setCurrentLocationNodeId(nodeId);
    const node = campusPreset.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedStartPOI(node);
      setSelectedStartRoom(undefined);
    }
  };

  // Route to building
  const handleRouteToBuilding = (building: Building, room?: RoomDetail) => {
    setSelectedDestinationPOI(building);
    setSelectedDestRoom(room);
    setSelectedFloor(room?.floor ?? 1);
    setIsSimulating(false);
    setSimulatedPosition(null);
  };

  const handleSelectBuilding = (building: Building | null) => {
    setSelectedBuilding(building);
    if (building) {
      setSelectedFloor(building.floors[0] ?? 0);
    }
  };

  // Handle Action Cards from AI Chat
  const handleExecuteActionCard = (card: AgentActionCard) => {
    if (card.buildingId) {
      const bldg = campusPreset.buildings.find(b => b.id === card.buildingId);
      if (bldg) {
        handleRouteToBuilding(bldg);
      }
    }
  };

  const currentUserNode = useMemo(() => {
    return campusPreset.nodes.find(n => n.id === currentLocationNodeId) || campusPreset.nodes[0];
  }, [campusPreset, currentLocationNodeId]);

  return (
    <div id="intelligent-college-navigator-root" className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Navbar */}
      <header id="top-navbar" className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-40">
        {/* Brand & College Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                {campusPreset.name}
              </h1>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                AI NAVIGATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>{campusPreset.location}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <Sun className="w-3 h-3 text-amber-400" />
                72°F Pleasant Walking Weather
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* AI Agent Chat Toggle */}
          <button
            id="btn-nav-agent"
            onClick={() => setIsAgentDrawerOpen(!isAgentDrawerOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isAgentDrawerOpen
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">NaviGenius AI</span>
          </button>

          {/* Directory & Room Finder */}
          <button
            id="btn-nav-directory"
            onClick={() => setIsDirectoryOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Directory</span>
          </button>

          {/* Schedule Route Planner */}
          <button
            id="btn-nav-schedule"
            onClick={() => setIsScheduleOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">My Schedule</span>
          </button>

          {/* Emergency SOS */}
          <button
            id="btn-nav-emergency"
            onClick={() => setIsEmergencyOpen(true)}
            className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Emergency SOS</span>
          </button>

          {/* Campus Switcher / Customizer */}
          <button
            id="btn-nav-customizer"
            onClick={() => setIsCustomizerOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-colors"
            title="Custom College Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Category Filter Pills Bar */}
      <div id="category-filters-bar" className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs z-30">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex-shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3 text-emerald-400" />
          FILTER MAP:
        </span>
        {[
          { id: 'all', label: 'All Highlights' },
          { id: 'academic', label: 'Academic & Labs' },
          { id: 'library', label: 'Libraries & Study' },
          { id: 'dining', label: 'Dining & Cafeteria' },
          { id: 'sports', label: 'Recreation & Gym' },
          { id: 'health', label: 'Health & Clinic' },
          { id: 'residential', label: 'Residence Halls' },
          { id: 'arts', label: 'Fine Arts & Media' },
          { id: 'transit', label: 'Transit & Shuttles' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              filterCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage & Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left / Center: Interactive Map Stage */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden p-3 pb-2 gap-3">
          {/* Top Route Planning Controls */}
          <RoutePlannerBar
            buildings={campusPreset.buildings}
            nodes={campusPreset.nodes}
            selectedStartPOI={selectedStartPOI}
            selectedDestinationPOI={selectedDestinationPOI}
            onSelectStartPOI={(poi) => {
              setSelectedStartPOI(poi);
              setSelectedStartRoom(undefined);
            }}
            onSelectDestinationPOI={(poi) => {
              setSelectedDestinationPOI(poi);
              setSelectedDestRoom(undefined);
            }}
            transportMode={transportMode}
            onSelectTransportMode={setTransportMode}
            activeRoute={activeRoute}
            onClearRoute={() => {
              setSelectedDestinationPOI(null);
              setSelectedDestRoom(undefined);
              setIsSimulating(false);
              setSimulatedPosition(null);
            }}
            simulatedPosition={simulatedPosition}
            onStartSimulation={handleStartSimulation}
            onPauseSimulation={handlePauseSimulation}
            onResetSimulation={handleResetSimulation}
            isSimulating={isSimulating}
            simulationSpeed={simulationSpeed}
            onSetSimulationSpeed={setSimulationSpeed}
            selectedStartRoom={selectedStartRoom}
            selectedDestRoom={selectedDestRoom}
          />

          {/* Interactive 2D Vector Map Canvas */}
          <div className="flex-1 w-full h-full relative rounded-2xl overflow-hidden shadow-inner">
            <CampusMap
              buildings={campusPreset.buildings}
              nodes={campusPreset.nodes}
              selectedBuilding={selectedBuilding}
              onSelectBuilding={handleSelectBuilding}
              activeRoute={activeRoute}
              currentLocationNodeId={currentLocationNodeId}
              onSetCurrentLocation={handleSetCurrentLocationNode}
              onRouteToBuilding={(bldg) => handleRouteToBuilding(bldg)}
              simulatedPosition={simulatedPosition}
              selectedFloor={selectedFloor}
              onSelectFloor={setSelectedFloor}
              highlightedRoom={selectedDestRoom || null}
              filterCategory={filterCategory}
            />
          </div>
        </div>

        {/* Right Drawer: AI Navigation Agent Assistant */}
        <AnimatePresence>
          {isAgentDrawerOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full z-30 flex-shrink-0 p-3 pl-0 overflow-hidden hidden md:block"
            >
              <NavigationAgentChat
                campusPreset={campusPreset}
                currentLocationNode={currentUserNode}
                onExecuteActionCard={handleExecuteActionCard}
                onNavigateToBuilding={(bldgId, roomId) => {
                  const bldg = campusPreset.buildings.find(b => b.id === bldgId);
                  const room = bldg?.rooms.find(r => r.id === roomId);
                  if (bldg) handleRouteToBuilding(bldg, room);
                }}
                onOpenBuildingDetail={(bldg) => handleSelectBuilding(bldg)}
                onOpenScheduleOptimizer={() => setIsScheduleOpen(true)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                buildings={campusPreset.buildings}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Full-Screen AI Agent Overlay when toggled on small screens */}
        <AnimatePresence>
          {isAgentDrawerOpen && (
            <div className="md:hidden fixed inset-0 z-50 p-3 pt-14 bg-slate-950/90 backdrop-blur-md">
              <div className="w-full h-full relative">
                <button
                  onClick={() => setIsAgentDrawerOpen(false)}
                  className="absolute top-2 right-2 z-50 p-2 bg-slate-800 text-slate-300 rounded-full"
                >
                  ✕
                </button>
                <NavigationAgentChat
                  campusPreset={campusPreset}
                  currentLocationNode={currentUserNode}
                  onExecuteActionCard={(card) => {
                    handleExecuteActionCard(card);
                    setIsAgentDrawerOpen(false);
                  }}
                  onNavigateToBuilding={(bldgId, roomId) => {
                    const bldg = campusPreset.buildings.find(b => b.id === bldgId);
                    const room = bldg?.rooms.find(r => r.id === roomId);
                    if (bldg) handleRouteToBuilding(bldg, room);
                    setIsAgentDrawerOpen(false);
                  }}
                  onOpenBuildingDetail={(bldg) => {
                    handleSelectBuilding(bldg);
                    setIsAgentDrawerOpen(false);
                  }}
                  onOpenScheduleOptimizer={() => {
                    setIsScheduleOpen(true);
                    setIsAgentDrawerOpen(false);
                  }}
                  onOpenEmergency={() => {
                    setIsEmergencyOpen(true);
                    setIsAgentDrawerOpen(false);
                  }}
                  buildings={campusPreset.buildings}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Building Details Slide-over Drawer */}
      <BuildingDetailDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        selectedFloor={selectedFloor}
        onSelectFloor={setSelectedFloor}
        onNavigateToBuilding={(bldg, room) => {
          handleRouteToBuilding(bldg, room);
          setSelectedBuilding(null);
        }}
        onSetAsCurrentLocation={(bldg) => {
          handleSetCurrentLocationNode(bldg.entranceNodeId);
          setSelectedBuilding(null);
        }}
      />

      {/* Campus Directory Modal */}
      <CampusDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        buildings={campusPreset.buildings}
        onSelectBuilding={(bldg) => handleSelectBuilding(bldg)}
        onRouteToBuilding={(bldg, room) => handleRouteToBuilding(bldg, room)}
      />

      {/* Schedule Optimizer Modal */}
      <ScheduleOptimizerModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedule={schedule}
        onUpdateSchedule={setSchedule}
        buildings={campusPreset.buildings}
        campusPreset={campusPreset}
        onPlotClassRoute={(bldgId) => {
          const bldg = campusPreset.buildings.find(b => b.id === bldgId);
          if (bldg) handleRouteToBuilding(bldg);
        }}
      />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onNavigateToHealth={() => {
          const healthBldg = campusPreset.buildings.find(b => b.id === 'bldg_health_wellness');
          if (healthBldg) handleRouteToBuilding(healthBldg);
        }}
        onNavigateToTransitEscort={() => {
          const transitBldg = campusPreset.buildings.find(b => b.id === 'bldg_transit_parking');
          if (transitBldg) handleRouteToBuilding(transitBldg);
        }}
      />

      {/* Campus Switcher / Customizer Modal */}
      <CampusCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentPreset={campusPreset}
        onSelectPreset={(newPreset) => {
          setCampusPreset(newPreset);
          setSelectedStartPOI(newPreset.nodes[0]);
          setSelectedDestinationPOI(newPreset.buildings[0]);
        }}
        onUpdateCustomName={(name, shortName, location) => {
          setCampusPreset(prev => ({
            ...prev,
            name,
            shortName,
            location
          }));
        }}
      />
    </div>
  );
}
