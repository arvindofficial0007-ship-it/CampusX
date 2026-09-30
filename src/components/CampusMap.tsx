import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapNode, 
  NavigationRoute, 
  TransportMode, 
  RoomDetail 
} from '../types';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  MapPin, 
  Navigation, 
  Layers, 
  Accessibility, 
  ShieldAlert, 
  Coffee, 
  BookOpen, 
  GraduationCap, 
  Activity, 
  Bus, 
  Home, 
  Palette, 
  Footprints,
  Sparkles,
  Info
} from 'lucide-react';

interface CampusMapProps {
  buildings: Building[];
  nodes: MapNode[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building | null) => void;
  activeRoute: NavigationRoute | null;
  currentLocationNodeId: string;
  onSetCurrentLocation: (nodeId: string) => void;
  onRouteToBuilding: (building: Building) => void;
  simulatedPosition: { x: number; y: number; angle: number; stepIndex: number } | null;
  selectedFloor: number;
  onSelectFloor: (floor: number) => void;
  highlightedRoom: RoomDetail | null;
  filterCategory: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  buildings,
  nodes,
  selectedBuilding,
  onSelectBuilding,
  activeRoute,
  currentLocationNodeId,
  onSetCurrentLocation,
  onRouteToBuilding,
  simulatedPosition,
  selectedFloor,
  onSelectFloor,
  highlightedRoom,
  filterCategory
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showNodeNetwork, setShowNodeNetwork] = useState<boolean>(false);
  const [showAmenitiesOverlay, setShowAmenitiesOverlay] = useState<boolean>(true);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.6));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on current user location or active route
  const handleCenterUser = () => {
    const currNode = nodes.find(n => n.id === currentLocationNodeId);
    if (currNode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetPanX = (rect.width / 2) - currNode.x;
      const targetPanY = (rect.height / 2) - currNode.y;
      setPan({ x: targetPanX * 0.5, y: targetPanY * 0.5 });
      setZoom(1.3);
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Find user current location node coordinate
  const userNode = useMemo(() => {
    return nodes.find(n => n.id === currentLocationNodeId) || nodes[0];
  }, [nodes, currentLocationNodeId]);

  // Filtered buildings
  const displayedBuildings = useMemo(() => {
    if (filterCategory === 'all') return buildings;
    return buildings.filter(b => b.category === filterCategory);
  }, [buildings, filterCategory]);

  // Route path SVG polyline string
  const routePathString = useMemo(() => {
    if (!activeRoute || activeRoute.pathCoordinates.length < 2) return '';
    return activeRoute.pathCoordinates.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, [activeRoute]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <GraduationCap className="w-4 h-4" />;
      case 'library': return <BookOpen className="w-4 h-4" />;
      case 'dining': return <Coffee className="w-4 h-4" />;
      case 'sports': return <Activity className="w-4 h-4" />;
      case 'health': return <ShieldAlert className="w-4 h-4" />;
      case 'residential': return <Home className="w-4 h-4" />;
      case 'arts': return <Palette className="w-4 h-4" />;
      case 'transit': return <Bus className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div 
      id="campus-interactive-map-container"
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-800/80 rounded-2xl shadow-2xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Map Controls Floating Bar */}
      <div id="map-controls-toolbar" className="absolute top-4 right-4 z-30 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl">
        <button
          id="btn-zoom-in"
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          id="btn-zoom-out"
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          id="btn-center-user"
          onClick={handleCenterUser}
          className="p-2.5 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors"
          title="Center on My Location"
        >
          <Navigation className="w-5 h-5" />
        </button>
        <button
          id="btn-reset-view"
          onClick={handleResetView}
          className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Reset Campus View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <div className="h-px bg-slate-800 my-1" />
        <button
          id="btn-toggle-nodes"
          onClick={() => setShowNodeNetwork(!showNodeNetwork)}
          className={`p-2.5 rounded-lg transition-colors ${showNodeNetwork ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          title="Toggle Pathway Network Grid"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Compass / Orientation Indicator */}
      <div id="map-compass" className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg text-xs text-slate-300">
        <Compass className="w-4 h-4 text-rose-400 animate-pulse" />
        <span className="font-semibold tracking-wider text-slate-200">NORTH</span>
        <span className="text-slate-500">|</span>
        <span className="text-[11px] text-emerald-400 font-mono">LIVE GPS GRID</span>
      </div>

      {/* Floor Level Selector when building is active */}
      {selectedBuilding && (
        <div id="floor-level-selector" className="absolute bottom-4 left-4 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
          <div className="px-2 text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">FLOOR:</span>
          </div>
          {selectedBuilding.floors.map(floor => (
            <button
              key={floor}
              id={`btn-floor-${floor}`}
              onClick={() => onSelectFloor(floor)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFloor === floor
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {floor === 0 ? 'G (Ground)' : `F${floor}`}
            </button>
          ))}
        </div>
      )}

      {/* Main SVG Vector Canvas */}
      <svg
        id="campus-svg-canvas"
        viewBox="0 0 1000 700"
        className="w-full h-full transform origin-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
          </pattern>

          {/* Grass Quad Gradient */}
          <radialGradient id="quadGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0.05" />
          </radialGradient>

          {/* Route Glow Filter */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Building Drop Shadow */}
          <filter id="buildingShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Campus Terrain Background */}
        <rect x="0" y="0" width="1000" height="700" fill="#090D16" />
        <rect x="0" y="0" width="1000" height="700" fill="url(#campusGrid)" />

        {/* Central Quad Lawn & Garden Oval */}
        <ellipse cx="400" cy="300" rx="200" ry="120" fill="url(#quadGlow)" stroke="#065F46" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="400" cy="300" r="28" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
        {/* Landmark Clock Tower Icon */}
        <text x="400" y="304" textAnchor="middle" dominantBaseline="middle" fill="#34D399" fontSize="16" fontWeight="bold">⏳</text>
        <text x="400" y="340" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="600" letterSpacing="0.5">MEMORIAL CLOCK TOWER</text>

        {/* North and South Garden Quad Accents */}
        <ellipse cx="700" cy="350" rx="90" ry="60" fill="url(#quadGlow)" stroke="#065F46" strokeWidth="1" />
        <ellipse cx="400" cy="500" rx="110" ry="50" fill="url(#quadGlow)" stroke="#065F46" strokeWidth="1" />

        {/* Campus Outer Boundary Road Loop */}
        <rect x="25" y="25" width="950" height="650" rx="30" fill="none" stroke="#1E293B" strokeWidth="14" strokeLinejoin="round" />
        <rect x="25" y="25" width="950" height="650" rx="30" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="8 8" />

        {/* Inner Walkways Network */}
        {nodes.map(node => (
          <g key={`pathways-${node.id}`}>
            {node.connections.map((conn, idx) => {
              const target = nodes.find(n => n.id === conn.targetNodeId);
              if (!target) return null;
              const isSkybridge = conn.pathType === 'skybridge';
              const isRamp = conn.pathType === 'ramp';
              return (
                <line
                  key={`conn-${node.id}-${conn.targetNodeId}-${idx}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isSkybridge 
                      ? '#38BDF8' 
                      : isRamp 
                      ? '#A7F3D0' 
                      : conn.indoor 
                      ? '#6366F1' 
                      : '#334155'
                  }
                  strokeWidth={isSkybridge ? 5 : isRamp ? 4 : 3}
                  strokeDasharray={isSkybridge ? '6 4' : isRamp ? '4 2' : undefined}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ))}

        {/* Skybridge Decorative Overlay Labels */}
        <g id="skybridge-overlay">
          <rect x="535" y="295" width="30" height="30" rx="6" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="550" y="313" textAnchor="middle" fill="#E0F2FE" fontSize="10" fontWeight="bold">🌉</text>
        </g>

        {/* Pathway Nodes Display (if toggled) */}
        {showNodeNetwork && nodes.map(n => (
          <g key={`node-point-${n.id}`} onClick={() => onSetCurrentLocation(n.id)} className="cursor-pointer">
            <circle cx={n.x} cy={n.y} r={n.type === 'gate' ? 6 : 4} fill={n.accessible ? '#10B981' : '#F59E0B'} stroke="#0F172A" strokeWidth="1.5" />
            <text x={n.x} y={n.y - 8} textAnchor="middle" fill="#CBD5E1" fontSize="9" fontWeight="500">{n.name.split(' ')[0]}</text>
          </g>
        ))}

        {/* Active Navigation Route Glowing Line */}
        {activeRoute && routePathString && (
          <g id="active-navigation-route-render">
            {/* Background Route Glow */}
            <path
              d={routePathString}
              fill="none"
              stroke={activeRoute.mode === 'wheelchair' ? '#10B981' : '#38BDF8'}
              strokeWidth="10"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlow)"
            />
            {/* Main Crisp Route Line with Animated Dash Pulse */}
            <path
              d={routePathString}
              fill="none"
              stroke={activeRoute.mode === 'wheelchair' ? '#34D399' : '#00E5FF'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
              className="animate-[dash_1.5s_linear_infinite]"
            />

            {/* Route Waypoint Dots */}
            {activeRoute.pathCoordinates.map((pt, idx) => (
              <circle
                key={`wp-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 0 || idx === activeRoute.pathCoordinates.length - 1 ? 6 : 3.5}
                fill={idx === 0 ? '#10B981' : idx === activeRoute.pathCoordinates.length - 1 ? '#F43F5E' : '#38BDF8'}
                stroke="#0F172A"
                strokeWidth="2"
              />
            ))}
          </g>
        )}

        {/* Campus Buildings Isometric Boxes */}
        {displayedBuildings.map(bldg => {
          const isSelected = selectedBuilding?.id === bldg.id;
          const isHovered = hoveredBuilding?.id === bldg.id;
          const isRouteDestination = activeRoute?.toPOI && 'id' in activeRoute.toPOI && activeRoute.toPOI.id === bldg.id;
          const isRouteStart = activeRoute?.fromPOI && 'id' in activeRoute.fromPOI && activeRoute.fromPOI.id === bldg.id;

          return (
            <g
              key={`bldg-group-${bldg.id}`}
              id={`building-${bldg.id}`}
              className="cursor-pointer transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuilding(bldg);
              }}
              onMouseEnter={() => setHoveredBuilding(bldg)}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              {/* 3D Isometric Extrusion Base */}
              <rect
                x={bldg.x + 4}
                y={bldg.y + 6}
                width={bldg.width}
                height={bldg.height}
                rx="14"
                fill="#0B132B"
                opacity="0.9"
              />

              {/* Main Building Body */}
              <rect
                x={bldg.x}
                y={bldg.y}
                width={bldg.width}
                height={bldg.height}
                rx="12"
                fill={isSelected ? '#1E293B' : '#0F172A'}
                stroke={
                  isSelected
                    ? '#38BDF8'
                    : isRouteDestination
                    ? '#F43F5E'
                    : isRouteStart
                    ? '#10B981'
                    : isHovered
                    ? '#94A3B8'
                    : bldg.color
                }
                strokeWidth={isSelected || isRouteDestination || isRouteStart ? 3.5 : 2}
                filter="url(#buildingShadow)"
              />

              {/* Top Accent Strip */}
              <rect
                x={bldg.x + 8}
                y={bldg.y + 8}
                width={bldg.width - 16}
                height="6"
                rx="3"
                fill={bldg.color}
                opacity="0.8"
              />

              {/* Building Code Badge */}
              <rect
                x={bldg.x + 12}
                y={bldg.y + 20}
                width="36"
                height="20"
                rx="6"
                fill={bldg.color}
                opacity="0.2"
              />
              <text
                x={bldg.x + 30}
                y={bldg.y + 34}
                textAnchor="middle"
                fill={bldg.color}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {bldg.code}
              </text>

              {/* Building Name */}
              <text
                x={bldg.x + 54}
                y={bldg.y + 34}
                fill="#F8FAFC"
                fontSize="12"
                fontWeight="700"
                className="select-none"
              >
                {bldg.shortName}
              </text>

              {/* Secondary Detail Text (Floors & Depts) */}
              <text
                x={bldg.x + 14}
                y={bldg.y + 54}
                fill="#94A3B8"
                fontSize="10"
                fontWeight="500"
              >
                {bldg.floors.length} Floors • {bldg.rooms.length} Key Rooms
              </text>

              {/* Amenities quick icons in building box */}
              {showAmenitiesOverlay && (
                <g transform={`translate(${bldg.x + 14}, ${bldg.y + bldg.height - 24})`}>
                  {bldg.amenities.slice(0, 3).map((am, amIdx) => (
                    <g key={am.id} transform={`translate(${amIdx * 22}, 0)`}>
                      <circle cx="8" cy="8" r="8" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
                      <text x="8" y="11" textAnchor="middle" fill="#CBD5E1" fontSize="9">
                        {am.type === 'wifi' ? '📶' : am.type === 'cafe' ? '☕' : am.type === 'printer' ? '🖨️' : am.type === 'quiet_zone' ? '🤫' : '✨'}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Selection Halo / Pulsing Indicator */}
              {isSelected && (
                <rect
                  x={bldg.x - 4}
                  y={bldg.y - 4}
                  width={bldg.width + 8}
                  height={bldg.height + 8}
                  rx="16"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              )}

              {/* Destination Pin Marker on Top of Building */}
              {isRouteDestination && (
                <g transform={`translate(${bldg.x + bldg.width / 2}, ${bldg.y - 12})`}>
                  <circle cx="0" cy="0" r="14" fill="#F43F5E" />
                  <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">🏁</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Live User GPS Location Pin */}
        {userNode && !simulatedPosition && (
          <g id="user-current-gps-pin" transform={`translate(${userNode.x}, ${userNode.y})`}>
            {/* Pulsing Radar Ring */}
            <circle cx="0" cy="0" r="22" fill="#10B981" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#047857" stroke="#10B981" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
            {/* User Label */}
            <g transform="translate(0, -22)">
              <rect x="-42" y="-12" width="84" height="18" rx="9" fill="#065F46" stroke="#34D399" strokeWidth="1" />
              <text x="0" y="1" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" letterSpacing="0.5">YOU ARE HERE</text>
            </g>
          </g>
        )}

        {/* Moving Simulation Avatar when GPS walk is running */}
        {simulatedPosition && (
          <g id="user-simulated-avatar" transform={`translate(${simulatedPosition.x}, ${simulatedPosition.y})`}>
            <circle cx="0" cy="0" r="18" fill="#38BDF8" fillOpacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Directional arrow based on angle */}
            <g transform={`rotate(${simulatedPosition.angle})`}>
              <path d="M 0 -9 L 5 5 L 0 2 L -5 5 Z" fill="#FFFFFF" />
            </g>
            <g transform="translate(0, -20)">
              <rect x="-35" y="-10" width="70" height="16" rx="8" fill="#0369A1" stroke="#7DD3FC" strokeWidth="1" />
              <text x="0" y="1" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">WALKING...</text>
            </g>
          </g>
        )}
      </svg>

      {/* Map Bottom Legend */}
      <div id="map-legend" className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>My GPS Pin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Route Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-sky-500" />
          <span>Skybridge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Destination</span>
        </div>
      </div>
    </div>
  );
};
