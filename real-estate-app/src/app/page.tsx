"use client";

import dynamic from "next/dynamic";
// import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { properties as seedProperties } from "@/data/properties";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const properties: Property[] = useMemo(() => {
    if (!query.trim()) return seedProperties;
    const q = query.toLowerCase();
    return seedProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!selectedId) return;
    const el = itemRefs.current[selectedId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Removed page-level header; global TopNav is used */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + actions */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by neighborhood, address, or listing title"
              className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 px-4 py-3 outline-none focus:ring-2 ring-blue-500 shadow-sm"
            />
          </div>
          <div className="md:hidden">
            <div className="inline-flex rounded-lg overflow-hidden border border-black/10 dark:border-white/15 shadow-sm">
              <button
                className={`px-3 py-2 text-sm ${mobileView === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-zinc-900"}`}
                onClick={() => setMobileView("list")}
              >
                List
              </button>
              <button
                className={`px-3 py-2 text-sm ${mobileView === "map" ? "bg-blue-600 text-white" : "bg-white dark:bg-zinc-900"}`}
                onClick={() => setMobileView("map")}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 min-h-[75vh]">
          {/* List */}
          <section className={`xl:block ${mobileView === "list" ? "block" : "hidden"}`}>
            <div className="grid gap-4">
              {properties.map((p) => (
                <div key={p.id} ref={(el) => { itemRefs.current[p.id] = el; }}>
                  <PropertyCard
                    property={p}
                    selected={p.id === selectedId}
                    onClick={() => {
                      setSelectedId(p.id);
                      setMobileView("map");
                    }}
                  />
                </div>
              ))}
              {properties.length === 0 && (
                <div className="text-sm text-zinc-500">No results</div>
              )}
            </div>
          </section>

          {/* Map */}
          <section className={`xl:block ${mobileView === "map" ? "block" : "hidden"}`}>
            <div className="h-[75vh] xl:h-[85vh] sticky top-[92px]">
              <LeafletMap
                properties={properties}
                selectedId={selectedId}
                onMarkerClick={(id) => {
                  setSelectedId(id);
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
