import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Building, 
  MapNode, 
  NavigationRoute, 
  TransportMode, 
  RoomDetail 
} from '../types';
import { 
  Navigation, 
  Footprints, 
  Accessibility, 
  Bike, 
  CloudRain, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';

interface RoutePlannerBarProps {
  buildings: Building[];
  nodes: MapNode[];
  selectedStartPOI: Building | MapNode;
  selectedDestinationPOI: Building | MapNode | null;
  onSelectStartPOI: (poi: Building | MapNode) => void;
  onSelectDestinationPOI: (poi: Building | MapNode | null) => void;
  transportMode: TransportMode;
  onSelectTransportMode: (mode: TransportMode) => void;
  activeRoute: NavigationRoute | null;
  onClearRoute: () => void;
  simulatedPosition: { x: number; y: number; angle: number; stepIndex: number } | null;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  selectedStartRoom?: RoomDetail;
  selectedDestRoom?: RoomDetail;
}

export const RoutePlannerBar: React.FC<RoutePlannerBarProps> = ({
  buildings,
  nodes,
  selectedStartPOI,
  selectedDestinationPOI,
  onSelectStartPOI,
  onSelectDestinationPOI,
  transportMode,
  onSelectTransportMode,
  activeRoute,
  onClearRoute,
  simulatedPosition,
  onStartSimulation,
  onPauseSimulation,
  onResetSimulation,
  isSimulating,
  simulationSpeed,
  onSetSimulationSpeed,
  selectedStartRoom,
  selectedDestRoom
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Trigger confetti when arriving at last step during simulation
  useEffect(() => {
    if (activeRoute && simulatedPosition && simulatedPosition.stepIndex >= activeRoute.steps.length - 1) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [simulatedPosition, activeRoute]);

  const currentStep = activeRoute && simulatedPosition 
    ? activeRoute.steps[Math.min(simulatedPosition.stepIndex, activeRoute.steps.length - 1)] 
    : activeRoute?.steps[0];

  return (
    <div id="route-planner-bar" className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 transition-all">
      {/* Route Selector Top Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Origin / Start Selector */}
        <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <div className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">START POINT</span>
            <select
              id="select-start-location"
              value={'id' in selectedStartPOI ? selectedStartPOI.id : ''}
              onChange={(e) => {
                const bldg = buildings.find(b => b.id === e.target.value);
                if (bldg) {
                  onSelectStartPOI(bldg);
                } else {
                  const node = nodes.find(n => n.id === e.target.value);
                  if (node) onSelectStartPOI(node);
                }
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer truncate"
            >
              <optgroup label="Gates & Transit Entrances">
                {nodes.filter(n => n.type === 'gate' || n.type === 'bus_stop' || n.type === 'plaza').map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-slate-100">
                    📍 {n.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Campus Buildings">
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                    🏛️ {b.name} ({b.code})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Arrow divider */}
        <div className="hidden md:flex items-center justify-center text-slate-600">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Destination Selector */}
        <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <div className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DESTINATION</span>
            <select
              id="select-destination-location"
              value={selectedDestinationPOI ? ('id' in selectedDestinationPOI ? selectedDestinationPOI.id : '') : ''}
              onChange={(e) => {
                if (!e.target.value) {
                  onSelectDestinationPOI(null);
                  return;
                }
                const bldg = buildings.find(b => b.id === e.target.value);
                if (bldg) {
                  onSelectDestinationPOI(bldg);
                } else {
                  const node = nodes.find(n => n.id === e.target.value);
                  if (node) onSelectDestinationPOI(node);
                }
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer truncate"
            >
              <option value="" className="bg-slate-900 text-slate-500">Choose destination...</option>
              <optgroup label="Campus Buildings">
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                    🏁 {b.name} ({b.code})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Gates & Plazas">
                {nodes.filter(n => n.type === 'gate' || n.type === 'plaza').map(n => (
                  <option key={n.id} value={n.id} className="bg-slate-900 text-slate-100">
                    📍 {n.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {selectedDestinationPOI && (
            <button
              onClick={onClearRoute}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear Route"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Transport Modes Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="mode-walk"
            onClick={() => onSelectTransportMode('walk')}
            className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
              transportMode === 'walk'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Standard Pedestrian Walking"
          >
            <Footprints className="w-4 h-4" />
            <span className="hidden lg:inline">Walk</span>
          </button>

          <button
            id="mode-wheelchair"
            onClick={() => onSelectTransportMode('wheelchair')}
            className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
              transportMode === 'wheelchair'
                ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Wheelchair & ADA Accessible Ramps & Elevators"
          >
            <Accessibility className="w-4 h-4" />
            <span className="hidden lg:inline">Accessible</span>
          </button>

          <button
            id="mode-bicycle"
            onClick={() => onSelectTransportMode('bicycle')}
            className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
              transportMode === 'bicycle'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Bicycle / Scooter Wide Roadways"
          >
            <Bike className="w-4 h-4" />
            <span className="hidden lg:inline">Bike</span>
          </button>

          <button
            id="mode-indoor"
            onClick={() => onSelectTransportMode('indoor_safe')}
            className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
              transportMode === 'indoor_safe'
                ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-400/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Weather-Safe (Covered Skybridges & Corridors)"
          >
            <CloudRain className="w-4 h-4" />
            <span className="hidden lg:inline">Covered</span>
          </button>
        </div>
      </div>

      {/* Active Route Metrics & Live Step Guidance Bar */}
      {activeRoute && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-slate-800"
        >
          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-slate-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeRoute.estimatedTimeMinutes} min walk</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-slate-300 font-medium">
                {activeRoute.totalDistanceMeters} meters (~{Math.round(activeRoute.totalDistanceMeters * 3.28)} ft)
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeRoute.estimatedCalories} kcal</span>
              </div>
            </div>

            {/* Accessibility / Weather Tag */}
            <div className="flex items-center gap-2">
              {transportMode === 'wheelchair' && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  100% Step-Free ADA Verified
                </span>
              )}
              {activeRoute.isWeatherSafe && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  ☔ Rain-Protected Skybridge
                </span>
              )}
            </div>
          </div>

          {/* Live Turn By Turn Highlight Box */}
          <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                <Navigation className="w-5 h-5 transform -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                    STEP {currentStep?.stepNumber || 1} OF {activeRoute.steps.length}
                  </span>
                  {currentStep?.floorLevel !== undefined && currentStep.floorLevel > 0 && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      Floor {currentStep.floorLevel}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-100">
                  {currentStep?.instruction}
                </p>
                {currentStep?.landmarkHint && (
                  <p className="text-[11px] text-slate-400 mt-0.5 italic">
                    💡 {currentStep.landmarkHint}
                  </p>
                )}
              </div>
            </div>

            {/* GPS Simulation Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!isSimulating ? (
                <button
                  id="btn-start-simulation"
                  onClick={onStartSimulation}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate Walk</span>
                </button>
              ) : (
                <button
                  id="btn-pause-simulation"
                  onClick={onPauseSimulation}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-md transition-all"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              {simulatedPosition && (
                <button
                  id="btn-reset-simulation"
                  onClick={onResetSimulation}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Speed toggle */}
              <button
                id="btn-speed-toggle"
                onClick={() => {
                  const nextSpeed = simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 4 : 1;
                  onSetSimulationSpeed(nextSpeed);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-400 rounded-lg"
                title="Simulation Speed"
              >
                {simulationSpeed}x
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
