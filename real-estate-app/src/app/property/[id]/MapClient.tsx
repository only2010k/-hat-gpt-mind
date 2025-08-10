"use client";

import LeafletMap from "@/components/LeafletMap";
import type { Property } from "@/types/property";

export default function MapClient({ property }: { property: Property }) {
  return <LeafletMap properties={[property]} selectedId={property.id} />;
}