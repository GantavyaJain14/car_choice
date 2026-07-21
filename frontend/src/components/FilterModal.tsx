"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { cn, API_BASE_URL } from "@/lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  make: string;
  yearRange: [number, number];
  owner: string;
  transmission: string;
  fuelType: string;
  kmRange: [number, number];
}

const OWNER_OPTIONS = ["1st", "2nd", "3rd", "4+"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid"];

export function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/car-data`);
        if (res.ok) {
          const data = await res.json();
          setBrands(data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    }
    fetchBrands();
  }, []);

  const handleReset = () => {
    setFilters({
      make: "",
      yearRange: [2000, new Date().getFullYear()],
      owner: "",
      transmission: "",
      fuelType: "",
      kmRange: [0, 200000],
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-heading font-bold uppercase tracking-widest flex items-center gap-3">
                  <Filter size={24} /> FILTERS
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                {/* Make */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">MAKE</label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a]">Select Make</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name} className="bg-[#0a0a0a]">
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">YEAR RANGE</label>
                    <span className="text-xs font-bold text-white">{filters.yearRange[0]} - {filters.yearRange[1]}</span>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-[1px] bg-white/10" />
                    <style>{`
                      .range-input {
                        pointer-events: none;
                      }
                      .range-input::-webkit-slider-thumb {
                        pointer-events: auto;
                      }
                      .range-input::-moz-range-thumb {
                        pointer-events: auto;
                      }
                    `}</style>
                    <input
                      type="range"
                      min={currentYear - 20}
                      max={currentYear}
                      value={filters.yearRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          yearRange: [Math.min(parseInt(e.target.value), filters.yearRange[1]), filters.yearRange[1]],
                        })
                      }
                      className="absolute w-full appearance-none bg-transparent h-2 cursor-pointer range-input [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                    <input
                      type="range"
                      min={currentYear - 20}
                      max={currentYear}
                      value={filters.yearRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          yearRange: [filters.yearRange[0], Math.max(parseInt(e.target.value), filters.yearRange[0])],
                        })
                      }
                      className="absolute w-full appearance-none bg-transparent h-2 cursor-pointer range-input [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>

                {/* Owner */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">OWNER</label>
                  <div className="flex flex-wrap gap-3">
                    {OWNER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, owner: opt === filters.owner ? "" : opt })}
                        className={cn(
                          "px-4 py-2 text-xs font-bold border transition-all uppercase tracking-widest",
                          filters.owner === opt
                            ? "border-white bg-white text-black"
                            : "border-white/10 hover:border-white/40 text-white/60"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">TRANSMISSION</label>
                  <div className="flex gap-3">
                    {TRANSMISSION_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, transmission: opt === filters.transmission ? "" : opt })}
                        className={cn(
                          "flex-1 px-4 py-2 text-xs font-bold border transition-all uppercase tracking-widest",
                          filters.transmission === opt
                            ? "border-white bg-white text-black"
                            : "border-white/10 hover:border-white/40 text-white/60"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">FUEL TYPE</label>
                  <div className="flex flex-wrap gap-3">
                    {FUEL_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, fuelType: opt === filters.fuelType ? "" : opt })}
                        className={cn(
                          "px-4 py-2 text-xs font-bold border transition-all uppercase tracking-widest",
                          filters.fuelType === opt
                            ? "border-white bg-white text-black"
                            : "border-white/10 hover:border-white/40 text-white/60"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KMS Driven */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">KMS DRIVEN</label>
                    <span className="text-xs font-bold text-white">UP TO {filters.kmRange[1].toLocaleString()} KMS</span>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-[1px] bg-white/10" />
                    <input
                      type="range"
                      min={0}
                      max={200000}
                      step={5000}
                      value={filters.kmRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          kmRange: [0, parseInt(e.target.value)],
                        })
                      }
                      className="w-full appearance-none bg-transparent h-2 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/30 uppercase font-bold tracking-widest pl-1">
                    <span>0 KMS</span>
                    <span>200,000+ KMS</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-16 pb-12">
                <button
                  onClick={handleReset}
                  className="py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-white transition-colors"
                >
                  RESET
                </button>
                <button
                  onClick={() => {
                    onApply(filters);
                    onClose();
                  }}
                  className="py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
                >
                  APPLY
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
