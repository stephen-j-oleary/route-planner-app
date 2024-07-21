import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";


export default function useFocus(boundStyle: "extend" | "focus" = "extend") {
  const mapsLibrary = useMapsLibrary("core");
  const map = useMap();

  const focus = async (coordinates: google.maps.LatLngLiteral[]) => {
    if (!map || !mapsLibrary) return;

    const newBounds = new mapsLibrary.LatLngBounds();
    const mapBounds = map.getBounds();
    if (boundStyle === "extend" && mapBounds) newBounds.union(mapBounds);

    coordinates.forEach(coord => newBounds.extend(coord));

    map.setZoom(20);
    map.setCenter(newBounds.getCenter());
    map.fitBounds(newBounds, 0);
    if (boundStyle === "focus" && (map.getZoom() || 0) > 15) map.setZoom(15);
  };

  return focus;
}