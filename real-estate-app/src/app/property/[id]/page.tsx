import { notFound } from "next/navigation";
import Image from "next/image";
import { properties } from "@/data/properties";
import MapClient from "./MapClient";

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="relative w-full h-72 rounded-2xl overflow-hidden">
            <Image src={property.imageUrl} alt={property.title} fill className="object-cover" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold">{property.title}</div>
            <div className="text-zinc-600 dark:text-zinc-400">{property.address}</div>
            <div className="mt-2 text-blue-600 font-bold text-xl">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(property.price)}
            </div>
            <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              {property.beds} beds • {property.baths} baths • {property.sqft.toLocaleString()} sqft
            </div>
          </div>
        </div>
        <div>
          <div className="h-72 rounded-2xl overflow-hidden">
            <MapClient property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}