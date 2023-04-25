export function getStopDuration(route, index = -1) {
  if (index > -1) return (+route.stops[index]?.time || +route.stopTime || 0) * 60;
  return route.stops.reduce((total, stop) => (total + (+stop.time || +route.stopTime || 0) * 60), 0) || 0;
}