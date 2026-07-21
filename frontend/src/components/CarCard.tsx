"use client";

import Link from "next/link";
import { Fuel, Gauge, User } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { API_BASE_URL } from "@/lib/utils";

export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  month: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  owner: string;
  color: string;
  insurance_type: string;
  accidental: number;
  service_history: number;
  second_key: number;
  sunroof: number;
  alloy_wheels: number;
  registration?: string;
  images: string[];
  status?: string;
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // 3D perspective scroll animation — card starts rotated and scales up as it enters view
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.5], [15, 2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.92, 0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  // Use first image or a placeholder that was provided in media
  const mainImage = car.images && car.images.length > 0
    ? (car.images[0].startsWith('http') || car.images[0].startsWith('/media') ? car.images[0] : `${API_BASE_URL}${car.images[0]}`)
    : "/media/image1.jpeg";

  return (
    <div
      ref={cardRef}
      style={{ perspective: "1200px" }}
    >
      <Link href={`/cars/${car.id}`}>
        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
            translateY,
            transformOrigin: "center bottom",
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
          }}
          whileHover={{ y: -8, scale: 1.02, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-[#111] rounded-lg overflow-hidden group border border-white/5 flex flex-col h-full cursor-pointer relative shadow-2xl"
        >
          {/* Image Container with Zoom effect */}
          <div className="relative h-64 md:h-72 overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImage}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>

            {/* Status Tag */}
            {car.status && (car.status.toLowerCase() === "booked" || car.status.toLowerCase() === "sold") && (
              <div className={`absolute top-4 left-4 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest border z-10 ${
                car.status.toLowerCase() === "sold" ? "bg-red-600/90 border-red-500/50" : "bg-amber-600/90 border-amber-500/50"
              }`}>
                {car.status}
              </div>
            )}

            {/* Price Tag */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
              ₹{car.price.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Content Container */}
          <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 bg-[#111]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/40 text-xs font-bold tracking-[0.2em] mb-1 uppercase">{car.year}</p>
                <h3 className="text-2xl font-heading font-bold text-white mb-1 group-hover:text-gray-300 transition-colors">
                  {car.make} {car.model}
                </h3>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 flex-grow mb-6">
              <div className="flex flex-col items-center justify-center text-center">
                <Gauge className="text-white/30 mb-2" size={18} />
                <span className="text-xs font-medium text-white/70 uppercase tracking-widest">{car.mileage.toLocaleString('en-IN')} kms</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-x border-white/10">
                <Fuel className="text-white/30 mb-2" size={18} />
                <span className="text-xs font-medium text-white/70 uppercase tracking-widest">{car.fuel_type}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <User className="text-white/30 mb-2" size={18} />
                <span className="text-xs font-medium text-white/70 uppercase tracking-widest">{car.owner} OWNER</span>
              </div>
            </div>

            {/* Action Button */}
            <div
              className="w-full block text-center border border-white/20 text-white py-3 font-semibold group-hover:bg-white group-hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-xs"
            >
              EXPLORE
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
