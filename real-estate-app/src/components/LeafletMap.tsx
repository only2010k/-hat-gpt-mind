"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression, Icon } from "leaflet";
import type { Property } from "@/types/property";

// Fix default icon paths in Next.js bundlers
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (L.Icon.Default as any).mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const selectedIcon: Icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const normalIcon: Icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [bounds, map]);
  return null;
}

export type LeafletMapProps = {
  properties: Property[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
};

export default function LeafletMap({ properties, selectedId, onMarkerClick }: LeafletMapProps) {
  const positions = properties.map((p) => [p.lat, p.lng]) as [number, number][];
  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (positions.length === 0) return null;
    return L.latLngBounds(positions);
  }, [positions]);

  const center = useMemo<[number, number]>(() => {
    if (positions.length > 0) return positions[0];
    return [37.7749, -122.4194];
  }, [positions]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {bounds && <FitBounds bounds={bounds} />}
      {properties.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={p.id === selectedId ? selectedIcon : normalIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(p.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{p.title}</div>
              <div className="text-blue-600 font-bold mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
                  p.price
                )}
              </div>
              <div className="text-zinc-600 mt-1">{p.address}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}