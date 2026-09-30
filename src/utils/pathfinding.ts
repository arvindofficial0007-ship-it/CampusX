import { Building, MapNode, NavigationRoute, RouteStep, TransportMode, RoomDetail } from '../types';

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function calculateBearing(x1: number, y1: number, x2: number, y2: number): number {
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  return (angle + 360) % 360;
}

export function getTurnInstruction(prevBearing: number, currBearing: number): string {
  let diff = currBearing - prevBearing;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;

  if (Math.abs(diff) < 25) {
    return 'Continue straight along';
  } else if (diff >= 25 && diff < 65) {
    return 'Turn slightly right towards';
  } else if (diff >= 65 && diff < 120) {
    return 'Turn right at';
  } else if (diff >= 120) {
    return 'Make a sharp right toward';
  } else if (diff <= -25 && diff > -65) {
    return 'Turn slightly left towards';
  } else if (diff <= -65 && diff > -120) {
    return 'Turn left at';
  } else {
    return 'Make a sharp left toward';
  }
}

export function findShortestPath(
  startNodeId: string,
  endNodeId: string,
  nodes: MapNode[],
  mode: TransportMode = 'walk'
): { pathNodeIds: string[]; totalDistance: number; warnings: string[] } | null {
  if (startNodeId === endNodeId) {
    return { pathNodeIds: [startNodeId], totalDistance: 0, warnings: [] };
  }

  const nodeMap = new Map<string, MapNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();
  const warnings: string[] = [];

  nodes.forEach(node => {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
    unvisited.add(node.id);
  });

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let currentId: string | null = null;
    let shortestDist = Infinity;

    unvisited.forEach(id => {
      const dist = distances.get(id) ?? Infinity;
      if (dist < shortestDist) {
        shortestDist = dist;
        currentId = id;
      }
    });

    if (!currentId || shortestDist === Infinity) {
      break; // Remaining nodes are unreachable
    }

    if (currentId === endNodeId) {
      break; // Reached target
    }

    unvisited.delete(currentId);
    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    for (const conn of currentNode.connections) {
      if (!unvisited.has(conn.targetNodeId)) continue;

      // Filter or penalize based on mode
      if (mode === 'wheelchair') {
        if (!conn.accessible || conn.stairs) {
          continue; // Strictly skip inaccessible stairs/steps
        }
      }

      if (mode === 'bicycle') {
        if (conn.indoor && !conn.pathType.includes('road')) {
          continue; // Skip indoor rooms and stairwells for bike
        }
      }

      let edgeWeight = conn.distanceMeters;

      // Mode adjustments
      if (mode === 'indoor_safe' && conn.indoor) {
        edgeWeight *= 0.5; // Favor indoor and skybridge routes
      }
      if (mode === 'wheelchair' && conn.pathType === 'ramp') {
        edgeWeight *= 0.8; // Prefer ramps
      }
      if (mode === 'wheelchair' && conn.pathType === 'elevator') {
        edgeWeight *= 0.7; // Prefer elevators
      }

      const alt = (distances.get(currentId) ?? 0) + edgeWeight;
      if (alt < (distances.get(conn.targetNodeId) ?? Infinity)) {
        distances.set(conn.targetNodeId, alt);
        previous.set(conn.targetNodeId, currentId);
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = endNodeId;

  while (curr !== null) {
    path.unshift(curr);
    curr = previous.get(curr) ?? null;
    if (curr === startNodeId) {
      path.unshift(startNodeId);
      break;
    }
  }

  if (path.length === 0 || path[0] !== startNodeId) {
    return null; // No path found
  }

  // Calculate actual distance without mode artificial multipliers
  let realDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const fromN = nodeMap.get(path[i]);
    const toN = nodeMap.get(path[i + 1]);
    if (fromN && toN) {
      const conn = fromN.connections.find(c => c.targetNodeId === toN.id);
      if (conn) {
        realDistance += conn.distanceMeters;
        if (!conn.accessible && mode !== 'wheelchair') {
          warnings.push(`Path between ${fromN.name} and ${toN.name} contains stairs.`);
        }
      } else {
        realDistance += calculateDistance(fromN.x, fromN.y, toN.x, toN.y) * 0.8;
      }
    }
  }

  return {
    pathNodeIds: path,
    totalDistance: Math.round(realDistance),
    warnings: Array.from(new Set(warnings))
  };
}

export function buildCompleteNavigationRoute(
  fromPOI: Building | MapNode,
  toPOI: Building | MapNode,
  nodes: MapNode[],
  mode: TransportMode = 'walk',
  startRoom?: RoomDetail,
  destinationRoom?: RoomDetail
): NavigationRoute | null {
  const startNodeId = 'entranceNodeId' in fromPOI ? fromPOI.entranceNodeId : fromPOI.id;
  const endNodeId = 'entranceNodeId' in toPOI ? toPOI.entranceNodeId : toPOI.id;

  const result = findShortestPath(startNodeId, endNodeId, nodes, mode);
  if (!result) return null;

  const nodeMap = new Map<string, MapNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const pathCoordinates: Array<{ x: number; y: number; floor?: number; name?: string }> = [];
  const steps: RouteStep[] = [];

  // If start room is specified on another floor
  if (startRoom && startRoom.floor > 0) {
    steps.push({
      stepNumber: 1,
      instruction: `Start inside ${fromPOI.name} on Floor ${startRoom.floor} (Room ${startRoom.roomNumber}). Take the ${mode === 'wheelchair' ? 'elevator' : 'stairs or elevator'} down to the Ground Floor Main Exit.`,
      distanceMeters: 25,
      pathType: mode === 'wheelchair' ? 'elevator' : 'stairs',
      nodeId: startNodeId,
      waypointName: `${fromPOI.name} Ground Exit`,
      floorLevel: 0,
      isAccessible: true,
      landmarkHint: `Exit through the main glass portico onto the campus quad.`
    });
  }

  let prevBearing: number | null = null;
  let currentStepNum = steps.length + 1;

  for (let i = 0; i < result.pathNodeIds.length; i++) {
    const nodeId = result.pathNodeIds[i];
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    pathCoordinates.push({
      x: node.x,
      y: node.y,
      floor: node.floor,
      name: node.name
    });

    if (i < result.pathNodeIds.length - 1) {
      const nextNode = nodeMap.get(result.pathNodeIds[i + 1]);
      if (nextNode) {
        const bearing = calculateBearing(node.x, node.y, nextNode.x, nextNode.y);
        const turnPrefix = prevBearing === null ? 'Head towards' : getTurnInstruction(prevBearing, bearing);
        const conn = node.connections.find(c => c.targetNodeId === nextNode.id);
        const dist = conn ? conn.distanceMeters : Math.round(calculateDistance(node.x, node.y, nextNode.x, nextNode.y) * 0.8);
        const pathType = conn ? conn.pathType : 'walkway';

        let customInstruction = `${turnPrefix} ${nextNode.name}`;
        if (pathType === 'skybridge') {
          customInstruction = `Cross via the covered Skybridge towards ${nextNode.name}`;
        } else if (pathType === 'ramp') {
          customInstruction = `Follow the ADA accessible ramp towards ${nextNode.name}`;
        } else if (pathType === 'elevator') {
          customInstruction = `Take the elevator to ${nextNode.name}`;
        } else if (pathType === 'garden_path') {
          customInstruction = `Stroll through the shaded quad garden path to ${nextNode.name}`;
        }

        steps.push({
          stepNumber: currentStepNum++,
          instruction: customInstruction,
          distanceMeters: dist,
          pathType,
          nodeId: nextNode.id,
          waypointName: nextNode.name,
          floorLevel: nextNode.floor ?? 0,
          isAccessible: conn ? conn.accessible : true,
          landmarkHint: getLandmarkHint(nextNode.name)
        });

        prevBearing = bearing;
      }
    }
  }

  // If destination room is specified
  if (destinationRoom) {
    if (destinationRoom.floor > 0) {
      steps.push({
        stepNumber: currentStepNum++,
        instruction: `Enter ${toPOI.name}. Take the ${mode === 'wheelchair' ? 'central elevator' : 'elevator or main atrium stairs'} to Floor ${destinationRoom.floor}.`,
        distanceMeters: 20,
        pathType: mode === 'wheelchair' ? 'elevator' : 'stairs',
        nodeId: endNodeId,
        waypointName: `${toPOI.name} Floor ${destinationRoom.floor}`,
        floorLevel: destinationRoom.floor,
        isAccessible: true,
        landmarkHint: `Look for Room ${destinationRoom.roomNumber} (${destinationRoom.name}) located on the corridor wing.`
      });
    }

    steps.push({
      stepNumber: currentStepNum++,
      instruction: `Arrive at your destination: Room ${destinationRoom.roomNumber} - ${destinationRoom.name}.`,
      distanceMeters: 10,
      pathType: 'corridor',
      nodeId: endNodeId,
      waypointName: `${destinationRoom.name}`,
      floorLevel: destinationRoom.floor,
      isAccessible: true,
      landmarkHint: destinationRoom.headOrProfessor ? `Office / Lab of: ${destinationRoom.headOrProfessor}` : `Classroom capacity: ${destinationRoom.capacity ?? 'Standard'}`
    });
  } else {
    // End step at building entrance
    steps.push({
      stepNumber: currentStepNum++,
      instruction: `You have arrived at ${toPOI.name}!`,
      distanceMeters: 0,
      pathType: 'walkway',
      nodeId: endNodeId,
      waypointName: toPOI.name,
      floorLevel: 0,
      isAccessible: true,
      landmarkHint: 'description' in toPOI ? toPOI.description : 'Campus Landmark'
    });
  }

  // Calculate total meters including indoor adjustments
  let totalDistance = result.totalDistance;
  if (startRoom && startRoom.floor > 0) totalDistance += 30;
  if (destinationRoom && destinationRoom.floor > 0) totalDistance += 30;

  // Calculate speed: walk = 80m/min, wheelchair = 60m/min, bicycle = 250m/min
  let speedMetersPerMin = 80;
  if (mode === 'wheelchair') speedMetersPerMin = 65;
  if (mode === 'bicycle') speedMetersPerMin = 220;

  const estimatedTimeMinutes = Math.max(1, Math.ceil(totalDistance / speedMetersPerMin));
  const estimatedCalories = Math.round(totalDistance * 0.045);

  const isWeatherSafe = steps.every(s => s.pathType === 'skybridge' || s.pathType === 'corridor' || s.pathType === 'elevator') || steps.filter(s => s.pathType === 'walkway' || s.pathType === 'road').length <= 2;

  const accessibilityScore = mode === 'wheelchair' ? 100 : (result.warnings.length === 0 ? 100 : 85);

  return {
    fromPOI,
    toPOI,
    startRoom,
    destinationRoom,
    mode,
    pathNodeIds: result.pathNodeIds,
    pathCoordinates,
    totalDistanceMeters: totalDistance,
    estimatedTimeMinutes,
    estimatedCalories,
    steps,
    accessibilityScore,
    warnings: result.warnings,
    isWeatherSafe
  };
}

function getLandmarkHint(nodeName: string): string {
  if (nodeName.includes('Clock Tower') || nodeName.includes('Quad')) {
    return 'Pass by the landmark Clock Tower and solar charging benches.';
  }
  if (nodeName.includes('Skybridge')) {
    return 'High-level glass enclosure connecting CS & Student Union with quad views.';
  }
  if (nodeName.includes('Library')) {
    return 'Turnstiles right next to the 24/7 book return slot & cafe.';
  }
  if (nodeName.includes('Transit')) {
    return 'Look for the electronic bus countdown board & bike station.';
  }
  if (nodeName.includes('Turing') || nodeName.includes('CS')) {
    return 'Glass atrium with digital LED welcome wall.';
  }
  return 'Follow paved illuminated pathway.';
}
