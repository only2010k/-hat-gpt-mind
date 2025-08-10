import Image from "next/image";
import type { Property } from "@/types/property";
import clsx from "clsx";

function BedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 10h18M6 10V7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3M3 21v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/>
    </svg>
  );
}
function BathIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 10V6a3 3 0 0 1 6 0v4M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6Z"/>
    </svg>
  );
}
function AreaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 3h8v8H3zM13 13h8v8h-8zM3 13l8 8M13 3l8 8"/>
    </svg>
  );
}

type Props = {
  property: Property;
  selected?: boolean;
  onClick?: () => void;
};

export default function PropertyCard({ property, selected, onClick }: Props) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-2xl border border-black/10 dark:border-white/15 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-[2px]",
        selected ? "ring-2 ring-blue-500" : ""
      )}
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-blue-700 text-sm font-semibold shadow">
          {price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">{property.address}</p>
        <div className="mt-3 flex gap-5 text-xs text-zinc-700 dark:text-zinc-300 items-center">
          <span className="inline-flex items-center gap-1.5"><BedIcon className="w-4 h-4" />{property.beds} bd</span>
          <span className="inline-flex items-center gap-1.5"><BathIcon className="w-4 h-4" />{property.baths} ba</span>
          <span className="inline-flex items-center gap-1.5"><AreaIcon className="w-4 h-4" />{property.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </button>
  );
}