"use client";

import { motion } from "framer-motion";
import { CheckCircle, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const CITIES = [
    "Jaipur", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Lucknow", "Chandigarh", "Gurgaon",
    "Noida", "Indore", "Udaipur", "Jodhpur", "Other"
];

const COLOURS = [
    "White", "Black", "Silver", "Grey", "Red", "Blue", "Brown",
    "Green", "Beige", "Gold", "Orange", "Other"
];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

// Reusable form field styles
const labelClass = "block text-[10px] uppercase tracking-widest font-bold mb-3 text-white/40";
const inputClass = "w-full bg-transparent border-b border-white/20 px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20";
const selectClass = "w-full bg-transparent border-b border-white/20 px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white";
const radioLabelClass = "flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors";
const radioClass = "w-4 h-4 accent-white cursor-pointer";

export default function SellPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [carDetailsOpen, setCarDetailsOpen] = useState(true);
    const [contactOpen, setContactOpen] = useState(true);

    // Car details state
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [variant, setVariant] = useState("");
    
    // Dynamic dependent states
    const [availableModels, setAvailableModels] = useState<any[]>([]);
    const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
    const [availableVariants, setAvailableVariants] = useState<any[]>([]);

    const [carMakes, setCarMakes] = useState<any[]>([]);

    // Fetch car data on load
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/car-data");
                if (response.ok) {
                    const data = await response.json();
                    const sortedBrands = [...data.brands].sort((a: any, b: any) => a.name.localeCompare(b.name));
                    setCarMakes(sortedBrands);
                }
            } catch (error) {
                console.error("Error fetching car data:", error);
            }
        };
        fetchCarData();
    }, []);

    // Handle Make Change
    const handleMakeChange = (selectedMakeName: string) => {
        setMake(selectedMakeName);
        setModel("");
        setVariant("");
        
        const selectedBrand = carMakes.find(b => b.name === selectedMakeName);
        if (selectedBrand) {
            // Filter out discontinued models and sort alphabetically
            const models = selectedBrand.models
                .filter((m: any) => !m.discontinued)
                .sort((a: any, b: any) => a.name.localeCompare(b.name));
            setAvailableModels(models);
        } else {
            setAvailableModels([]);
        }
        setAvailableFuelTypes([]);
        setAvailableVariants([]);
    };

    // Handle Model Change
    const handleModelChange = (selectedModelName: string) => {
        setModel(selectedModelName);
        setFuelType("");
        setVariant("");
        
        const selectedModel = availableModels.find(m => m.name === selectedModelName);
        if (selectedModel) {
            // Extract unique fuel types from variants for the dropdown
            const fuels = Array.from(new Set(selectedModel.variants.map((v: any) => v.fuel_type))) as string[];
            setAvailableFuelTypes(fuels.sort());
            
            // Show ALL variants for this model immediately
            const variants = [...selectedModel.variants].sort((a: any, b: any) => a.name.localeCompare(b.name));
            setAvailableVariants(variants);
        } else {
            setAvailableFuelTypes([]);
            setAvailableVariants([]);
        }
    };

    // Handle Variant Change (Auto-detect Fuel)
    const handleVariantChange = (selectedVariantName: string) => {
        setVariant(selectedVariantName);
        
        const selectedModel = availableModels.find(m => m.name === model);
        if (selectedModel) {
            const selectedVariant = selectedModel.variants.find((v: any) => v.name === selectedVariantName);
            if (selectedVariant) {
                setFuelType(selectedVariant.fuel_type);
            }
        }
    };

    // Handle Fuel Type Change (Optional Filter)
    const handleFuelTypeChange = (selectedFuel: string) => {
        setFuelType(selectedFuel);
        // We don't necessarily need to reset variant here if the user wants them independent,
        // but if they select a fuel that doesn't match the current variant, we should probably clear it.
        const selectedModel = availableModels.find(m => m.name === model);
        if (selectedModel && selectedFuel) {
            const currentVariant = selectedModel.variants.find((v: any) => v.name === variant);
            if (currentVariant && currentVariant.fuel_type !== selectedFuel) {
                setVariant("");
            }
        }
    };

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [owner, setOwner] = useState("");
    const [colour, setColour] = useState("");
    const [city, setCity] = useState("");
    const [registrationNo, setRegistrationNo] = useState("");
    const [registrationAt, setRegistrationAt] = useState("");
    const [kmDone, setKmDone] = useState("");
    const [lifetimeTax, setLifetimeTax] = useState("");
    const [insurance, setInsurance] = useState("");
    const [insuranceValidTill, setInsuranceValidTill] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [isAccidental, setIsAccidental] = useState("");
    const [isFloodAffected, setIsFloodAffected] = useState("");

    // Contact details state
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleSubmit = async () => {
        const newErrors: Record<string, boolean> = {};

        // Required car fields
        if (!make) newErrors.make = true;
        if (!month) newErrors.month = true;
        if (!year) newErrors.year = true;
        if (!city) newErrors.city = true;

        // Required contact fields
        if (!fullName.trim()) newErrors.fullName = true;
        if (!phone.trim()) newErrors.phone = true;
        
        // Additional car fields
        if (!model) newErrors.model = true;
        if (!variant) newErrors.variant = true;
        if (!owner) newErrors.owner = true;
        if (!colour) newErrors.colour = true;
        if (!registrationNo) newErrors.registrationNo = true;
        if (!registrationAt) newErrors.registrationAt = true;
        if (!kmDone) newErrors.kmDone = true;
        if (!lifetimeTax) newErrors.lifetimeTax = true;
        if (!insurance) newErrors.insurance = true;
        if (!insuranceValidTill) newErrors.insuranceValidTill = true;
        if (!estimatedPrice) newErrors.estimatedPrice = true;
        if (!isAccidental) newErrors.isAccidental = true;
        if (!isFloodAffected) newErrors.isFloodAffected = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await fetch("http://localhost:8000/api/sell-requests", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        phone: phone,
                        email: email || null,
                        make: make,
                        model: model,
                        fuel_type: fuelType,
                        variant: variant,
                        month: month,
                        year: parseInt(year) || 0,
                        owner: owner,
                        color: colour,
                        city: city,
                        registration_no: registrationNo,
                        registration_at: registrationAt,
                        km_done: parseInt(kmDone) || 0,
                        lifetime_tax: lifetimeTax,
                        insurance: insurance,
                        insurance_valid_till: insuranceValidTill,
                        estimated_price: parseFloat(estimatedPrice) || 0,
                        is_accidental: isAccidental,
                        is_flood_affected: isFloodAffected,
                    }),
                });

                if (response.ok) {
                    setSubmitted(true);
                } else {
                    console.error("Failed to submit request", await response.text());
                    alert("Failed to submit the request. Please try again later.");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Network error. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Open sections with errors
            if (newErrors.make || newErrors.month || newErrors.year || newErrors.city) {
                setCarDetailsOpen(true);
            }
            if (newErrors.fullName || newErrors.phone) {
                setContactOpen(true);
            }
            if (Object.keys(newErrors).length > 0) {
                setCarDetailsOpen(true);
            }
        }
    };

    if (submitted) {
        return (
            <div className="bg-black min-h-screen text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/media/image8.jpeg" alt="Background" className="w-full h-full object-cover filter blur-md grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
                </div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-12 md:p-16">
                            <div className="text-center space-y-6 pt-6">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-black">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest mb-2">EVALUATION INITIATED</h3>
                                <p className="text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto mb-10">
                                    Thank you. Our experts are currently reviewing your vehicle details. A dedicated concierge will contact you within 24 hours to schedule a physical inspection.
                                </p>
                                <Link href="/" className="inline-block border border-white hover:bg-white hover:text-black py-4 px-10 font-bold uppercase tracking-[0.2em] text-xs transition-colors">
                                    RETURN TO HOME
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/image8.jpeg" alt="Background" className="w-full h-full object-cover filter blur-md grayscale" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h4 className="text-white/40 font-bold uppercase tracking-[0.3em] mb-4 text-xs">Unlock Your Car&apos;s Potential</h4>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 uppercase tracking-tight">SELL YOUR <span className="text-white/50">CAR</span></h1>
                        <p className="text-lg text-white/50 font-light tracking-wide max-w-xl mx-auto">
                            Please fill the details in the below form to send your request.
                        </p>
                    </div>

                    {/* ── SECTION 1: CAR DETAILS ── */}
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 mb-6">
                        <button
                            onClick={() => setCarDetailsOpen(!carDetailsOpen)}
                            className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer"
                        >
                            <h3 className="text-lg font-heading font-bold uppercase tracking-widest">CAR DETAILS</h3>
                            {carDetailsOpen ? <ChevronUp size={20} className="text-white/50" /> : <ChevronDown size={20} className="text-white/50" />}
                        </button>

                        {carDetailsOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 pb-8 space-y-8">
                                {/* Divider */}
                                <div className="border-t border-white/10"></div>

                                {/* Select Your Car */}
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest font-bold text-white/60 mb-5">
                                        SELECT YOUR CAR <span className="text-red-500">*</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <label className={labelClass}>Make</label>
                                            <select
                                                value={make}
                                                onChange={(e) => handleMakeChange(e.target.value)}
                                                className={`${selectClass} ${errors.make ? "border-red-500" : ""}`}
                                            >
                                                <option value="">Select Make</option>
                                                {carMakes.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Model <span className="text-red-500">*</span></label>
                                            <select
                                                value={model}
                                                onChange={(e) => handleModelChange(e.target.value)}
                                                className={`${selectClass} ${errors.model ? "border-red-500" : ""}`}
                                                disabled={!make}
                                            >
                                                <option value="">{make ? "Select Model" : "Select Make First"}</option>
                                                {availableModels.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Fuel Type <span className="text-red-500">*</span></label>
                                            <select
                                                value={fuelType}
                                                onChange={(e) => handleFuelTypeChange(e.target.value)}
                                                className={`${selectClass} ${errors.fuelType ? "border-red-500" : ""}`}
                                                disabled={!model}
                                            >
                                                <option value="">{model ? "Select Fuel" : "Select Model First"}</option>
                                                {availableFuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Variant <span className="text-red-500">*</span></label>
                                            <select
                                                value={variant}
                                                onChange={(e) => handleVariantChange(e.target.value)}
                                                className={`${selectClass} ${errors.variant ? "border-red-500" : ""}`}
                                                disabled={!model}
                                            >
                                                <option value="">{model ? "Select Variant" : "Select Model First"}</option>
                                                {availableVariants.map((v, i) => (
                                                    <option key={`${v.name}-${i}`} value={v.name}>{v.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Month, Year, Owner, Colour */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className={labelClass}>
                                            Month <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className={`${selectClass} ${errors.month ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Month</option>
                                            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Year <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className={`${selectClass} ${errors.year ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Year</option>
                                            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Owner <span className="text-red-500">*</span></label>
                                        <select
                                            value={owner}
                                            onChange={(e) => setOwner(e.target.value)}
                                            className={`${selectClass} ${errors.owner ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Select Owner</option>
                                            <option value="1st">1st Owner</option>
                                            <option value="2nd">2nd Owner</option>
                                            <option value="3rd">3rd Owner</option>
                                            <option value="4+">4th or More</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Colour <span className="text-red-500">*</span></label>
                                        <select
                                            value={colour}
                                            onChange={(e) => setColour(e.target.value)}
                                            className={`${selectClass} ${errors.colour ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Colour</option>
                                            {COLOURS.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* City, Registration No, Registration At */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClass}>
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className={`${selectClass} ${errors.city ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Select City</option>
                                            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Registration No <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={registrationNo}
                                            onChange={(e) => setRegistrationNo(e.target.value)}
                                            className={`${inputClass} ${errors.registrationNo ? "border-red-500" : ""}`}
                                            placeholder="e.g. RJ 14 AB 1234"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Registration At (RTO) <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={registrationAt}
                                            onChange={(e) => setRegistrationAt(e.target.value)}
                                            className={`${inputClass} ${errors.registrationAt ? "border-red-500" : ""}`}
                                            placeholder="e.g. Jaipur RTO"
                                        />
                                    </div>
                                </div>

                                {/* KM Done */}
                                <div className="max-w-xs">
                                    <label className={labelClass}>KM Done <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={kmDone}
                                        onChange={(e) => setKmDone(e.target.value)}
                                        className={`${inputClass} ${errors.kmDone ? "border-red-500" : ""}`}
                                        placeholder="e.g. 25000"
                                    />
                                </div>

                                {/* Life Time Tax */}
                                <div>
                                    <label className={labelClass}>Life Time Tax <span className="text-red-500">*</span></label>
                                    <div className={`flex gap-8 mt-1 ${errors.lifetimeTax ? "p-2 border border-red-500/30 rounded" : ""}`}>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="lifetimeTax" value="Individual" checked={lifetimeTax === "Individual"} onChange={(e) => setLifetimeTax(e.target.value)} className={radioClass} />
                                            Individual
                                        </label>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="lifetimeTax" value="Corporate" checked={lifetimeTax === "Corporate"} onChange={(e) => setLifetimeTax(e.target.value)} className={radioClass} />
                                            Corporate
                                        </label>
                                    </div>
                                </div>

                                {/* Car Insurance */}
                                <div>
                                    <label className={labelClass}>Car Insurance <span className="text-red-500">*</span></label>
                                    <div className={`flex flex-wrap gap-8 mt-1 ${errors.insurance ? "p-2 border border-red-500/30 rounded" : ""}`}>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="insurance" value="Comprehensive" checked={insurance === "Comprehensive"} onChange={(e) => setInsurance(e.target.value)} className={radioClass} />
                                            Comprehensive
                                        </label>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="insurance" value="Third Party" checked={insurance === "Third Party"} onChange={(e) => setInsurance(e.target.value)} className={radioClass} />
                                            Third Party
                                        </label>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="insurance" value="No Insurance" checked={insurance === "No Insurance"} onChange={(e) => setInsurance(e.target.value)} className={radioClass} />
                                            No Insurance
                                        </label>
                                    </div>
                                </div>

                                {/* Insurance Valid Till, Estimated Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Insurance Valid Till <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={insuranceValidTill}
                                            onChange={(e) => setInsuranceValidTill(e.target.value)}
                                            className={`${inputClass} ${errors.insuranceValidTill ? "border-red-500" : ""} [color-scheme:dark]`}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Estimated Price (₹) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={estimatedPrice}
                                            onChange={(e) => setEstimatedPrice(e.target.value)}
                                            className={`${inputClass} ${errors.estimatedPrice ? "border-red-500" : ""}`}
                                            placeholder="e.g. 2500000"
                                        />
                                    </div>
                                </div>

                                {/* Is car accidental? */}
                                <div>
                                    <label className={labelClass}>Is car accidental? <span className="text-red-500">*</span></label>
                                    <div className={`flex gap-8 mt-1 ${errors.isAccidental ? "p-2 border border-red-500/30 rounded" : ""}`}>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="accidental" value="Yes" checked={isAccidental === "Yes"} onChange={(e) => setIsAccidental(e.target.value)} className={radioClass} />
                                            Yes
                                        </label>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="accidental" value="No" checked={isAccidental === "No"} onChange={(e) => setIsAccidental(e.target.value)} className={radioClass} />
                                            No
                                        </label>
                                    </div>
                                </div>

                                {/* Is car flood-affected? */}
                                <div>
                                    <label className={labelClass}>Is car flood-affected? <span className="text-red-500">*</span></label>
                                    <div className={`flex gap-8 mt-1 ${errors.isFloodAffected ? "p-2 border border-red-500/30 rounded" : ""}`}>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="flood" value="Yes" checked={isFloodAffected === "Yes"} onChange={(e) => setIsFloodAffected(e.target.value)} className={radioClass} />
                                            Yes
                                        </label>
                                        <label className={radioLabelClass}>
                                            <input type="radio" name="flood" value="No" checked={isFloodAffected === "No"} onChange={(e) => setIsFloodAffected(e.target.value)} className={radioClass} />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── SECTION 2: CONTACT DETAILS ── */}
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 mb-8">
                        <button
                            onClick={() => setContactOpen(!contactOpen)}
                            className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer"
                        >
                            <h3 className="text-lg font-heading font-bold uppercase tracking-widest">CONTACT DETAILS</h3>
                            {contactOpen ? <ChevronUp size={20} className="text-white/50" /> : <ChevronDown size={20} className="text-white/50" />}
                        </button>

                        {contactOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 pb-8 space-y-8">
                                <div className="border-t border-white/10"></div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClass}>
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`${inputClass} ${errors.fullName ? "border-red-500" : ""}`}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Error summary */}
                    {Object.keys(errors).length > 0 && (
                        <p className="text-red-400 text-xs uppercase tracking-widest text-center mb-6">
                            Please fill in all required fields marked with *
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full border border-white hover:bg-white hover:text-black py-5 font-bold uppercase tracking-[0.2em] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT FOR EVALUATION"}
                    </button>

                </motion.div>
            </div>
        </div>
    );
}
