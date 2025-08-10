"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L, { LatLngBoundsExpression, Icon } from "leaflet";
import type { Property } from "@/types/property";
import Supercluster from "supercluster";

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

function MapStateTracker({ onChange }: { onChange: (state: { zoom: number; bbox: [number, number, number, number] }) => void }) {
  const map = useMapEvents({
    load() {
      const b = map.getBounds();
      const z = map.getZoom();
      onChange({ zoom: z, bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] });
    },
    moveend() {
      const b = map.getBounds();
      const z = map.getZoom();
      onChange({
        zoom: z,
        bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
      });
    },
    zoomend() {
      const b = map.getBounds();
      const z = map.getZoom();
      onChange({
        zoom: z,
        bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
      });
    },
  });
  return null;
}

function ClusterMarker({ lat, lng, count, clusterId, index }: { lat: number; lng: number; count: number; clusterId: number; index: Supercluster<{ cluster: boolean; propertyId?: string }>; }) {
  const map = useMap();
  const size = count < 10 ? 30 : count < 50 ? 36 : 44;
  const icon = L.divIcon({
    html: `<div class="cluster-marker" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
    className: "",
    iconSize: [size, size],
  });
  return (
    <Marker
      key={`cluster-${clusterId}`}
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          // Use supercluster to determine the best expansion zoom
          const targetZoom = index.getClusterExpansionZoom(clusterId);
          const max = map.getMaxZoom() || 18;
          const nextZoom = Math.min(targetZoom, max);
          map.flyTo([lat, lng], nextZoom, { animate: true, duration: 0.5 });
        },
      }}
    />
  );
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

  // Build geojson points for clustering
  const points = useMemo(
    () =>
      properties.map((p) => ({
        type: "Feature" as const,
        properties: { cluster: false, propertyId: p.id },
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      })),
    [properties]
  );

  const index = useMemo(() => {
    const sc = new Supercluster<{ cluster: boolean; propertyId?: string }>({
      radius: 60,
      maxZoom: 12, // cluster from zoom 0..12
    });
    sc.load(points as Supercluster.PointFeature<{ cluster: boolean; propertyId?: string }> []);
    return sc;
  }, [points]);

  const [mapState, setMapState] = useState<{ zoom: number; bbox: [number, number, number, number] } | null>(null);

  const clusters = useMemo(() => {
    if (!mapState) return [] as Supercluster.PointFeature<{ cluster: boolean; propertyId?: string }> [];
    return index.getClusters(mapState.bbox, Math.floor(mapState.zoom)) as Supercluster.PointFeature<
      { cluster: boolean; propertyId?: string; point_count?: number; cluster_id?: number }
    >[];
  }, [index, mapState]);

  const renderPointMarker = (p: Property) => (
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
  );

  return (
    <MapContainer center={center} zoom={5} zoomControl scrollWheelZoom className="h-full w-full rounded-xl">
      <TileLayer
        attribution={
          process.env.NEXT_PUBLIC_MAP_ATTR ||
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
        url={process.env.NEXT_PUBLIC_MAP_TILES || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
      />
      {bounds && <FitBounds bounds={bounds} />}
      <MapStateTracker onChange={setMapState} />

      {/* Render clusters for zoom 0-12; individual markers for zoom 13-15 */}
      {mapState &&
        clusters.map((item) => {
          const [lng, lat] = (item.geometry.coordinates as number[]) ?? [0, 0];
          // cluster
          if ((item.properties as { cluster?: boolean }).cluster) {
            const { point_count: count, cluster_id: clusterId } = item.properties as unknown as { point_count: number; cluster_id: number };
            return <ClusterMarker key={`cluster-${clusterId}`} lat={lat} lng={lng} count={count} clusterId={clusterId} index={index} />;
          }
          // single point
          if (mapState.zoom >= 13) {
            const propertyId = (item.properties as { propertyId?: string }).propertyId as string;
            const p = properties.find((pp) => pp.id === propertyId);
            if (p) return renderPointMarker(p);
          }
          return null;
        })}
    </MapContainer>
  );
}