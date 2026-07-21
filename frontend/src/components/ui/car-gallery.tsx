"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarGalleryProps {
  images: string[];
  carName?: string;
}

export const CarGallery: React.FC<CarGalleryProps> = ({ images, carName = "Vehicle" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = images.length > 0 ? images : ["/media/image1.jpeg"];

  const prev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setActiveIndex((i) => (i + 1) % items.length);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Featured Image */}
      <div className="relative w-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10" style={{ height: "420px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeIndex}
          src={items[activeIndex]}
          alt={`${carName} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-contain transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/media/image1.jpeg";
          }}
        />

        {/* Nav arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 border border-white/10 text-white rounded-full p-2 transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 border border-white/10 text-white rounded-full p-2 transition-all backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {activeIndex + 1} / {items.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {items.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-none relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                idx === activeIndex
                  ? "border-white shadow-lg shadow-white/10 scale-105"
                  : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/30"
              }`}
              style={{ width: "80px", height: "60px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/media/image1.jpeg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
