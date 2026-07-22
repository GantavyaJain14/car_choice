"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { EmiCalculatorModal } from "./EmiCalculatorModal";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [scrollRatio, setScrollRatio] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [emiModalOpen, setEmiModalOpen] = useState(false);

    useEffect(() => {
        if (!isHome) {
            setScrollRatio(1);
            return;
        }

        const handleScroll = () => {
            const heroHeight = window.innerHeight || 800;
            const currentScroll = window.scrollY;
            const ratio = Math.min(currentScroll / heroHeight, 1);
            setScrollRatio(ratio);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 border-b"
            style={{
                backgroundColor: `rgba(0, 0, 0, ${scrollRatio * 0.95})`,
                backdropFilter: `blur(${scrollRatio * 16}px)`,
                WebkitBackdropFilter: `blur(${scrollRatio * 16}px)`,
                borderBottomColor: `rgba(255, 255, 255, ${scrollRatio * 0.08})`,
                paddingTop: `${24 - scrollRatio * 8}px`,
                paddingBottom: `${24 - scrollRatio * 8}px`,
                boxShadow: scrollRatio > 0.8 ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
                transition: "padding 0.3s ease, background-color 0.1s ease, backdrop-filter 0.1s ease"
            }}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/media/image2.png"
                        alt="Car Choice Logo"
                        className="shrink-0 h-24 md:h-28 w-auto object-contain -my-4 md:-my-6 -mr-4 md:-mr-6 relative -top-2.5 md:-top-4"
                    />
                    <div className="flex flex-col shrink-0">
                        <span className="text-white text-xl md:text-2xl font-bold tracking-[0.2em] font-heading leading-none whitespace-nowrap">
                            CAR CHOICE<span className="text-[14px] md:text-[16px] font-normal tracking-normal relative -top-2.5 md:-top-3.5 -ml-1 md:-ml-1.5">®</span>
                        </span>
                        <span className="text-white/50 text-[10px] uppercase tracking-widest mt-1 whitespace-nowrap">Right Car Right Choice</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8 ml-auto mr-8">
                    {["FLEET", "INSURANCE", "SELL YOUR CAR", "ABOUT US"].map((item) => (
                        <Link
                            key={item}
                            href={
                                item === "FLEET" ? "/cars" : 
                                item === "SELL YOUR CAR" ? "/sell" :
                                item === "INSURANCE" ? "/insurance" :
                                `/${item.toLowerCase().replace(' ', '-')}`
                            }
                            className="text-white/70 hover:text-white transition-colors text-xs font-semibold uppercase tracking-[0.15em] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-6 shrink-0">

                    <button
                        onClick={() => setEmiModalOpen(true)}
                        className="border border-white/30 hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-sm font-semibold transition-all duration-300 text-xs uppercase tracking-[0.15em]"
                    >
                        EMI CALCULATOR
                    </button>
                    <EmiCalculatorModal isOpen={emiModalOpen} onClose={() => setEmiModalOpen(false)} />
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 h-screen">
                    {["FLEET", "INSURANCE", "SELL YOUR CAR", "ABOUT US"].map((item) => (
                        <Link
                            key={item}
                            href={
                                item === "FLEET" ? "/cars" : 
                                item === "SELL YOUR CAR" ? "/sell" :
                                item === "INSURANCE" ? "/insurance" :
                                `/${item.toLowerCase().replace(' ', '-')}`
                            }
                            className="text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setEmiModalOpen(true);
                            setMobileMenuOpen(false);
                        }}
                        className="text-left text-white text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4"
                    >
                        EMI CALCULATOR
                    </button>

                </div>
            )}
        </header>
    );
}
