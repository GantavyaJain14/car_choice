"use client";

import { useState, useMemo } from "react";
import CarCard, { Car } from "@/components/CarCard";
import { SlidersHorizontal, Search, Filter } from "lucide-react";
import { FilterModal, FilterState } from "@/components/FilterModal";

interface CarsContentProps {
  initialCars: Car[];
}

const initialFilterState: FilterState = {
  make: "",
  yearRange: [2000, new Date().getFullYear()],
  owner: "",
  transmission: "",
  fuelType: "",
  kmRange: [0, 200000],
};

export default function CarsContent({ initialCars }: CarsContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("FEATURED");

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMake = !filters.make || car.make.toLowerCase() === filters.make.toLowerCase();
      const matchesYear = car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1];
      const matchesOwner = !filters.owner || car.owner.toLowerCase() === filters.owner.toLowerCase();
      const matchesTransmission = !filters.transmission || car.transmission.toLowerCase() === filters.transmission.toLowerCase();
      const matchesFuel = !filters.fuelType || car.fuel_type.toLowerCase() === filters.fuelType.toLowerCase();
      const matchesKm = car.mileage <= filters.kmRange[1];

      return matchesSearch && matchesMake && matchesYear && matchesOwner && matchesTransmission && matchesFuel && matchesKm;
    }).sort((a, b) => {
      if (sortBy === "PRICE: LOW TO HIGH") return a.price - b.price;
      if (sortBy === "PRICE: HIGH TO LOW") return b.price - a.price;
      if (sortBy === "NEWEST ARRIVALS") return b.year - a.year;
      return 0; // Default featured
    });
  }, [initialCars, searchQuery, filters, sortBy]);

  return (
    <div className="container mx-auto px-6 md:px-12">
      <div className="flex flex-col gap-12">
        {/* Listings Header */}
        <main className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-6 border-b border-white/10 gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-3 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all rounded-sm"
              >
                <Filter size={18} /> FILTERS
              </button>
              
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="SEARCH MODELS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-transparent border-b border-white/20 text-white rounded-none focus:outline-none focus:border-white transition-colors text-xs font-semibold uppercase tracking-widest placeholder:text-white/30"
                />
                <Search className="absolute right-2 top-3 text-white/40" size={16} />
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-8">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                {filteredCars.length} VEHICLES FOUND
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">SORT:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                >
                  <option className="bg-[#0a0a0a] text-white py-2">FEATURED</option>
                  <option className="bg-[#0a0a0a] text-white py-2">PRICE: LOW TO HIGH</option>
                  <option className="bg-[#0a0a0a] text-white py-2">PRICE: HIGH TO LOW</option>
                  <option className="bg-[#0a0a0a] text-white py-2">NEWEST ARRIVALS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm">
                <p className="text-white/40 uppercase tracking-widest text-sm font-semibold mb-2">No vehicles found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setFilters(initialFilterState);
                    setSearchQuery("");
                  }}
                  className="text-white underline text-xs uppercase tracking-widest font-bold mt-4 hover:text-white/80 transition-colors"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
}
