"use client";

import React from "react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { BadgeCheck, Tag, UserCheck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

// Scroll Reveal Component using framer-motion
function RevealCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutUs() {
  return (
    <div className={`${montserrat.className} bg-black text-white text-[16px] leading-[24px] min-h-screen`}>
      {/* Hero Section */}
      <section className="relative h-[530px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src=""
            alt="Showroom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 px-[16px] md:px-[40px] pb-12 w-full max-w-7xl mx-auto">
          <h1 className="font-bold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] text-white mb-4">Driven by Trust, Defined by Quality.</h1>
          <div className="w-16 h-1 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-[16px] md:px-[40px] bg-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white text-[14px] leading-[20px] font-semibold tracking-[0.05em] uppercase">Our Mission</span>
          </div>
          <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-white">A Legacy of Trust</h2>
          <div className="flex flex-col gap-4 text-gray-400 max-w-3xl">
            <p className="text-[16px] leading-[24px]">
              Car Choice was born out of a simple observation: the used car market lacked a standard for institutional trust. We set out to change that by building a dealership where honesty is the primary currency and every vehicle is treated as a high-consideration asset.
            </p>
            <p className="text-[16px] leading-[24px]">
              Today, we are more than just a dealership. We are a team of automotive enthusiasts and service professionals dedicated to making the car buying journey completely transparent, stress-free, and efficient for the modern discerning buyer.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-[16px] md:px-[40px] bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold text-white mb-8 text-center">The Car Choice Standard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 0: Trusted Vehicle */}
            <RevealCard className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] font-semibold tracking-[0.05em] text-white mb-2">Trusted Vehicle</h3>
                <p className="text-[12px] leading-[16px] tracking-[0.03em] text-gray-400">Every vehicle is thoroughly inspected and verified. We never buy or sell accident-damaged or odometer-tampered cars, giving you confidence in every purchase.</p>
              </div>
            </RevealCard>

            {/* Card 1 */}
            <RevealCard className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <BadgeCheck size={32} />
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] font-semibold tracking-[0.05em] text-white mb-2">Certified Quality</h3>
                <p className="text-[12px] leading-[16px] tracking-[0.03em] text-gray-400">Every car undergoes a rigorous 150-point inspection by master technicians to ensure peak performance and safety.</p>
              </div>
            </RevealCard>

            {/* Card 2 */}
            <RevealCard className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <Tag size={32} />
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] font-semibold tracking-[0.05em] text-white mb-2">Transparent Pricing</h3>
                <p className="text-[12px] leading-[16px] tracking-[0.03em] text-gray-400">No hidden fees, no last-minute surprises. The price you see is the price you pay, backed by market data analytics.</p>
              </div>
            </RevealCard>

            {/* Card 3 */}
            <RevealCard className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <UserCheck size={32} />
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] font-semibold tracking-[0.05em] text-white mb-2">Customer First</h3>
                <p className="text-[12px] leading-[16px] tracking-[0.03em] text-gray-400">Dedicated personal consultants guide you from the initial browse to the final handover, ensuring a seamless experience.</p>
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-[16px] md:px-[40px] bg-black">
        <div className="max-w-7xl mx-auto bg-[#111111] rounded-xl p-8 text-center flex flex-col items-center gap-6 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-white mb-4">Ready to find your next car?</h2>
            <p className="text-[16px] leading-[24px] text-gray-400 mb-8">Explore our hand-picked inventory of certified pre-owned vehicles.</p>
            <Link href="/cars" className="bg-white text-black px-8 py-4 rounded-lg text-[14px] leading-[20px] font-semibold tracking-[0.05em] hover:bg-gray-200 transition-all active:scale-95 shadow-lg inline-block">
              Browse Our Inventory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
