"use client";

import { Car } from "@/components/CarCard";
import { Fuel, Gauge, Disc, Calendar, ShieldCheck, Mail, Phone, CalendarHeart, CheckCircle } from "lucide-react";
import { useState, useEffect, use } from "react";
import { CarGallery } from "@/components/ui/car-gallery";
import { EmiCalculatorInline } from "@/components/EmiCalculatorInline";
import { API_BASE_URL } from "@/lib/utils";

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: carId } = use(params);

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    // Inquiry form state
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiryName, setInquiryName] = useState("");
    const [inquiryPhone, setInquiryPhone] = useState("");
    const [inquiryEmail, setInquiryEmail] = useState("");
    const [inquiryMessage, setInquiryMessage] = useState("");
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);
    const [inquiryError, setInquiryError] = useState("");

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/cars`);
                if (res.ok) {
                    const cars = await res.json();
                    setCar(cars.find((c: Car) => c.id === carId) || null);
                }
            } catch (err) {
                console.error("Failed to fetch car:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInquiryError("");
        setInquirySubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    car_id: car?.id || "",
                    full_name: inquiryName,
                    phone: inquiryPhone,
                    email: inquiryEmail || null,
                    message: inquiryMessage || `Interested in ${car?.make} ${car?.model}`,
                    type: "Purchase Enquiry",
                }),
            });

            if (response.ok) {
                setInquirySuccess(true);
            } else {
                setInquiryError("Failed to submit inquiry. Please try again.");
            }
        } catch (error) {
            setInquiryError("Network error. Please try again.");
        } finally {
            setInquirySubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold uppercase tracking-widest text-sm">Loading vehicle...</div>;
    }

    // Helper formatting 
    const displayImage = car?.images[0]?.startsWith("http") || car?.images[0]?.startsWith("/media") ? car?.images[0] : `${API_BASE_URL}${car?.images[0]}`

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Detail Hero Section - Optimized Vertical Size */}
            <div className="relative h-[50vh] md:h-[65vh] w-full bg-[#050505] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={displayImage || "/media/image1.jpeg"}
                    alt={`${car?.make} ${car?.model}`}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-white/50 font-bold uppercase tracking-[0.3em] text-xs">{car?.year} • {car?.make}</p>
                                {car?.status && (car.status.toLowerCase() === "booked" || car.status.toLowerCase() === "sold") && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest border ${
                                        car.status.toLowerCase() === "sold" ? "bg-red-600/90 border-red-500/50 text-white" : "bg-amber-600/90 border-amber-500/50 text-white"
                                    }`}>
                                        {car.status}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold font-heading tracking-tight leading-none">{car?.model}</h1>
                        </div>
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 px-10 py-6 text-center shadow-2xl">
                            <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold mb-2">ASKING PRICE</p>
                            <p className="text-4xl md:text-5xl font-heading font-light tracking-wide">₹{car?.price?.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col gap-12">

                    {/* 1. Gallery Section (Interactive Expand) */}
                    <div className="w-full">
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-6 text-white/40 pb-4 border-b border-white/10">GALLERY</h2>
                        <CarGallery
                            images={car?.images.map((img) =>
                                img.startsWith("http") || img.startsWith("/media") ? img : `${API_BASE_URL}${img}`
                            ) || []}
                            carName={`${car?.make} ${car?.model}`}
                        />
                    </div>

                    {/* 2. Specs Grid */}
                    <div className="w-full">
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-10 text-white/40 pb-4 border-b border-white/10">VEHICLE SPECIFICATIONS</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-white text-center">
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <Calendar className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">YEAR</span>
                                <span className="font-light text-lg tracking-wider">{car?.year}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <Gauge className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">MILEAGE</span>
                                <span className="font-light text-lg tracking-wider">{car?.mileage?.toLocaleString('en-IN')} kms</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <Fuel className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">FUEL</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.fuel_type}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <Disc className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">TRANS</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.transmission}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">OWNER</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.owner}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <Disc className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">COLOR</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.color}</span>
                            </div>

                            {/* Row 2 */}
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <ShieldCheck className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">INSURANCE</span>
                                <span className="font-light text-lg tracking-wider uppercase">
                                    {car?.insurance_type?.toLowerCase() === "zero dep" ? "Zero Depth" : car?.insurance_type}
                                </span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">HISTORY</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.service_history ? "Available" : "Not Available"}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">VARIANT</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.variant}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">SUNROOF</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.sunroof ? "Yes" : "No"}</span>
                            </div>

                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">2ND KEY</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.second_key ? "Yes" : "No"}</span>
                            </div>
                            <div className="bg-[#111] p-8 border border-white/5 flex flex-col items-center">
                                <CheckCircle className="text-white/40 mb-4" size={24} />
                                <span className="text-white/30 text-[10px] mb-2 uppercase tracking-[0.2em] font-bold">REGISTRATION</span>
                                <span className="font-light text-lg tracking-wider uppercase">{car?.registration || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. EMI Calculator Section */}
                    <div className="w-full">
                        <EmiCalculatorInline initialLoanAmount={car?.price || 0} />
                    </div>

                    {/* 4. Inquiry Section */}
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-[#111] border border-white/10 p-10 md:p-16">
                            <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-12 text-white pb-4 border-b border-white/10 text-center">INTERESTED?</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 border-b border-white/5 pb-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white/5 p-4 rounded-full border border-white/10"><ShieldCheck className="text-white" size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Verified</h4>
                                            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Car Choice Certified</p>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-4">SPEAK TO A CONCIERGE</p>
                                        <a href="tel:18001234567" className="text-2xl font-light tracking-widest flex items-center gap-3 hover:text-white/70 transition-colors">
                                            <Phone size={20} className="text-white/40" /> +91 9929020000
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {!showInquiryForm && !inquirySuccess && (
                                        <button
                                            onClick={() => setShowInquiryForm(true)}
                                            className="w-full bg-white text-black hover:bg-gray-200 py-6 font-bold uppercase tracking-[0.2em] text-sm transition-colors flex justify-center items-center gap-3"
                                        >
                                            <Mail size={18} /> Make an Inquiry
                                        </button>
                                    )}

                                    {showInquiryForm && !inquirySuccess && (
                                        <form onSubmit={handleInquirySubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    required
                                                    value={inquiryName}
                                                    onChange={(e) => setInquiryName(e.target.value)}
                                                    placeholder="Full Name"
                                                    className="w-full bg-black/40 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                                />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={inquiryPhone}
                                                    onChange={(e) => setInquiryPhone(e.target.value)}
                                                    placeholder="Phone Number"
                                                    className="w-full bg-black/40 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                value={inquiryEmail}
                                                onChange={(e) => setInquiryEmail(e.target.value)}
                                                placeholder="Email Address (Optional)"
                                                className="w-full bg-black/40 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                            />
                                            <textarea
                                                value={inquiryMessage}
                                                onChange={(e) => setInquiryMessage(e.target.value)}
                                                placeholder="Additional Message (Optional)"
                                                className="w-full bg-black/40 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                                            />
                                            {inquiryError && <p className="text-red-500 text-xs">{inquiryError}</p>}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowInquiryForm(false)}
                                                    className="w-1/3 bg-transparent border border-white/30 text-white hover:border-white py-4 font-bold uppercase tracking-widest text-xs transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={inquirySubmitting}
                                                    className="w-2/3 bg-white text-black hover:bg-gray-200 py-4 font-bold uppercase tracking-[0.2em] text-xs transition-colors disabled:opacity-50"
                                                >
                                                    {inquirySubmitting ? "Sending..." : "Submit"}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {inquirySuccess && (
                                        <div className="bg-green-500/10 border border-green-500/30 p-8 text-center animate-in fade-in duration-500">
                                            <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
                                            <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-2">Inquiry Sent</h4>
                                            <p className="text-white/60 text-xs leading-relaxed">Thank you. A concierge will analyze your request and contact you shortly.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
