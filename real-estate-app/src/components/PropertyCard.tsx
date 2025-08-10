import Image from "next/image";
import type { Property } from "@/types/property";
import clsx from "clsx";

type Props = {
  property: Property;
  selected?: boolean;
  onClick?: () => void;
};

export default function PropertyCard({ property, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all",
        selected ? "ring-2 ring-blue-500" : ""
      )}
    >
      <div className="relative h-44 w-full">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {property.title}
          </h3>
          <div className="text-blue-600 dark:text-blue-400 font-bold">
            ${" "}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
              property.price
            )}
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{property.address}</p>
        <div className="mt-3 flex gap-4 text-xs text-zinc-700 dark:text-zinc-300">
          <span>{property.beds} bd</span>
          <span>{property.baths} ba</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </button>
  );
}