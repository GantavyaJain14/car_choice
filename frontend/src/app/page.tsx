"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import CarCard, { Car } from "@/components/CarCard";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/utils";

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlogan, setShowSlogan] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlogan(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars`);
        if (res.ok) {
          const data = await res.json();
          // Use provided images if fetched car image is missing
          const carsWithImages = data.map((car: Car, i: number) => ({
            ...car,
            images: car.images && car.images.length > 0 ? car.images : [`/media/image${(i % 8) + 1}.jpeg`]
          }));
          setFeaturedCars(carsWithImages.slice(0, 3));
        } else {
          console.error("Failed to fetch cars");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
          <video
            src="https://drive.google.com/uc?export=view&id=16y60_Zo6K5_3so56l6uhI05SP3pwkCYd"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 px-6 md:px-12 text-center mt-20 pointer-events-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center w-full h-[180px] md:h-[240px] mb-8">
              <AnimatePresence>
                {showSlogan && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center absolute"
                  >
                    <h2 className="text-white/80 text-xs md:text-sm tracking-[0.3em] font-medium mb-4 uppercase">
                      The Car Choice Experience
                    </h2>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tighter leading-none">
                      <span className="text-white">RIGHT</span> <span className="text-red-600">CAR</span><br />
                      <span className="text-red-600">RIGHT</span> <span className="text-white">CHOICE</span>
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* <p className="text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Meticulously curated selection of luxury cars. Discover the perfect balance of quality, style, and performance for your discerning tastes.
            </p> */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <Link href="/cars">
                <LiquidMetalButton label="View Collection" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-[0.2em] mb-2">Scroll</span>
          <div className="w-[1px] h-10 bg-white/30 relative overflow-hidden">
            <motion.div
              animate={{ y: [-40, 40] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-1/2 bg-white absolute top-0"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-32 bg-[#050505] relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8"
          >
            <div>
              {/* <h4 className="text-white/40 font-bold uppercase tracking-[0.3em] mb-4 text-xs">Curated Selection</h4> */}
              <h2 className="text-5xl lg:text-7xl font-bold text-white font-heading leading-none">FEATURED VEHICLES</h2>
            </div>
            <Link href="/cars">
              <LiquidMetalButton label="Explore All" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCars.length > 0 ? (
                featuredCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-white/40 py-10 uppercase tracking-widest text-sm">No vehicles available currently</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Parallax Image Break */}
      <section className="h-[60vh] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/image8.jpeg"
          alt="Parallax"
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        <div className="relative z-20 text-center container px-6">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 uppercase tracking-wider">Uncompromised Promise</h2>
          <p className="text-white/80 max-w-xl mx-auto text-lg mb-8 font-light">Every vehicle in our collection represents the pinnacle of automotive engineering and design.</p>
        </div>
      </section>

      {/* Sell Process Section */}
      <section className="py-32 bg-[#050505]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white/40 font-bold uppercase tracking-[0.3em] mb-4 text-xs">Best Value</h4>
              <h2 className="text-5xl lg:text-7xl font-bold text-white font-heading leading-none mb-8">SELL YOUR CAR</h2>
              <p className="text-white/60 leading-relaxed font-light text-lg mb-10">
                Experience a seamless and transparent selling process. We offer the best market value for your car with instant evaluation and payment.
              </p>

              <div className="space-y-8 mb-12">
                {[
                  { step: "01", title: "Instant Payment", desc: "Receive secure payment immediately after deal confirmation." },
                  { step: "02", title: "FAST RC TRANSFER", desc: "Smooth and hassle-free ownership transfer handled by our team." },
                  { step: "03", title: "INSTANT EVALUATION", desc: "Know your car’s estimated value within minutes." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 border-b border-white/10 pb-6">
                    <div className="text-white/30 text-3xl font-heading font-bold">{item.step}</div>
                    <div>
                      <h5 className="text-white font-bold tracking-widest uppercase text-sm mb-2">{item.title}</h5>
                      <p className="text-white/50 text-sm font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/sell"
                className="inline-block border border-white hover:bg-white hover:text-black text-white px-10 py-5 font-bold transition-all uppercase tracking-[0.2em] text-sm"
              >
                Evaluate Now
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-sm overflow-hidden border border-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/image3.jpeg" alt="Sell Car" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
