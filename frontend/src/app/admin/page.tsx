"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Car, Lock, Plus, Trash2, Edit2, Image as ImageIcon, Upload, ChevronUp, ChevronDown, Database, ExternalLink, AlertCircle, X } from "lucide-react";

import { motion } from "framer-motion";
import type { Car as CarType } from "@/components/CarCard";
import { API_BASE_URL } from "@/lib/utils";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const COLOURS = [
    "White", "Black", "Silver", "Grey", "Red", "Blue", "Brown",
    "Green", "Beige", "Gold", "Orange", "Other"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

// Reusable form styles (matching sell page)
const labelClass = "block text-[10px] uppercase tracking-widest font-bold mb-3 text-white/40";
const inputClass = "w-full bg-transparent border-b border-white/20 px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20";
const selectClass = "w-full bg-transparent border-b border-white/20 px-2 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white";
const radioLabelClass = "flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors";
const radioClass = "w-4 h-4 accent-white cursor-pointer";

function AdminContent() {
    const searchParams = useSearchParams();
    const secretKey = searchParams.get("key");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(false);

    // UI State
    const [formOpen, setFormOpen] = useState(true);
    const [editingCarId, setEditingCarId] = useState<string | null>(null);

    // Form State
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [variant, setVariant] = useState("");

    // Dynamic dependent states
    const [availableModels, setAvailableModels] = useState<any[]>([]);
    const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
    const [availableVariants, setAvailableVariants] = useState<any[]>([]);

    const [carMakes, setCarMakes] = useState<any[]>([]);
    const [dbManagementOpen, setDbManagementOpen] = useState(false);

    // Fetch car data on load
    const fetchCarData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/car-data`);
            if (response.ok) {
                const data = await response.json();
                const sortedBrands = [...data.brands].sort((a: any, b: any) => a.name.localeCompare(b.name));
                setCarMakes(sortedBrands);
            }
        } catch (error) {
            console.error("Error fetching car data:", error);
        }
    };

    useEffect(() => {
        fetchCarData();
    }, []);

    // Handle Make Change
    const handleMakeChange = (selectedMakeName: string) => {
        setMake(selectedMakeName);
        setModel("");
        setVariant("");

        const selectedBrand = carMakes.find(b => b.name === selectedMakeName);
        if (selectedBrand) {
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
            const fuels = Array.from(new Set(selectedModel.variants.map((v: any) => v.fuel_type))) as string[];
            setAvailableFuelTypes(fuels.sort());

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

    // Handle Fuel Type Change
    const handleFuelTypeChange = (selectedFuel: string) => {
        setFuelType(selectedFuel);
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
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [transmission, setTransmission] = useState("automatic");
    const [owner, setOwner] = useState("");
    const [color, setColor] = useState("");
    const [insuranceType, setInsuranceType] = useState("");
    const [accidental, setAccidental] = useState("No");
    const [serviceHistory, setServiceHistory] = useState("Available");
    const [secondKey, setSecondKey] = useState("Yes");
    const [sunroof, setSunroof] = useState("Yes");
    const [alloyWheels, setAlloyWheels] = useState("Yes");
    const [registration, setRegistration] = useState("");
    const [images, setImages] = useState<FileList | null>(null);
    const [status, setStatus] = useState("available");

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // Management State
    const [mBrandName, setMBrandName] = useState("");
    const [mBrandId, setMBrandId] = useState("");
    const [mModelName, setMModelName] = useState("");
    const [mModelId, setMModelId] = useState("");
    const [mVariantName, setMVariantName] = useState("");
    const [mVariantFuel, setMVariantFuel] = useState("Petrol");

    // Management Selection
    const [selectedMBrand, setSelectedMBrand] = useState("");
    const [selectedMModel, setSelectedMModel] = useState("");

    const handleAddBrand = async () => {
        if (!mBrandName || !mBrandId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/car-data/brands`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: mBrandId, name: mBrandName, models: [] })
            });
            if (response.ok) {
                setMBrandName("");
                setMBrandId("");
                fetchCarData();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteBrand = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/api/car-data/brands/${id}`, { method: "DELETE" });
            fetchCarData();
        } catch (e) { console.error(e); }
    };

    const handleAddModel = async () => {
        if (!selectedMBrand || !mModelName || !mModelId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/car-data/brands/${selectedMBrand}/models`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: mModelId, name: mModelName, variants: [], discontinued: false })
            });
            if (response.ok) {
                setMModelName("");
                setMModelId("");
                fetchCarData();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteModel = async (brandId: string, modelId: string) => {
        try {
            await fetch(`${API_BASE_URL}/api/car-data/brands/${brandId}/models/${modelId}`, { method: "DELETE" });
            fetchCarData();
        } catch (e) { console.error(e); }
    };

    const handleAddVariant = async () => {
        if (!selectedMBrand || !selectedMModel || !mVariantName) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/car-data/brands/${selectedMBrand}/models/${selectedMModel}/variants`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: mVariantName, fuel_type: mVariantFuel })
            });
            if (response.ok) {
                setMVariantName("");
                fetchCarData();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteVariant = async (brandId: string, modelId: string, variantName: string) => {
        try {
            await fetch(`${API_BASE_URL}/api/car-data/brands/${brandId}/models/${modelId}/variants/${variantName}`, { method: "DELETE" });
            fetchCarData();
        } catch (e) { console.error(e); }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
        if (password === adminPassword) {
            setIsAuthenticated(true);
            fetchCars();
        } else {
            alert("Invalid credentials");
        }
    };

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/cars`);
            if (res.ok) {
                const data = await res.json();
                setCars(data);
            }
        } catch (error) {
            console.error("Failed to fetch cars", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        if (!make) newErrors.make = true;
        if (!model) newErrors.model = true;
        if (!variant) newErrors.variant = true;
        if (!month) newErrors.month = true;
        if (!year) newErrors.year = true;
        if (!price) newErrors.price = true;
        if (!mileage) newErrors.mileage = true;
        if (!registration) newErrors.registration = true;

        // Images are only required for new cars, optional for edits
        if (!editingCarId && (!images || images.length === 0)) {
            newErrors.images = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCar = async () => {
        if (!validateForm()) {
            setFormOpen(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();

        // Text/Select fields
        formData.append("make", make);
        formData.append("model", model);
        formData.append("variant", variant);
        formData.append("month", month);
        formData.append("year", year);
        formData.append("price", price);
        formData.append("mileage", mileage);
        formData.append("fuel_type", fuelType);
        formData.append("transmission", transmission);
        formData.append("owner", owner);
        formData.append("color", color);
        formData.append("insurance_type", insuranceType);
        formData.append("registration", registration);
        formData.append("status", status);

        // Boolean -> Int (0 or 1) conversions
        formData.append("accidental", accidental === "Yes" ? "1" : "0");
        formData.append("service_history", serviceHistory === "Available" ? "1" : "0");
        formData.append("second_key", secondKey === "Yes" ? "1" : "0");
        formData.append("sunroof", sunroof === "Yes" ? "1" : "0");
        formData.append("alloy_wheels", alloyWheels === "Yes" ? "1" : "0");

        // Media
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        try {
            const url = editingCarId
                ? `${API_BASE_URL}/api/cars/${editingCarId}`
                : `${API_BASE_URL}/api/cars`;

            const res = await fetch(url, {
                method: editingCarId ? "PUT" : "POST",
                body: formData,
            });

            if (res.ok) {
                alert(editingCarId ? "Car updated successfully!" : "Car added successfully to inventory!");
                fetchCars();

                // Clear form
                resetForm();
                setFormOpen(false); // collapse form to show list
            } else {
                const errData = await res.json();
                console.error("Backend Error:", errData);
                alert("Failed to add car: " + (errData.detail || "Check console"));
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this car?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, { method: "DELETE" });
            if (res.ok) fetchCars();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (car: CarType) => {
        setEditingCarId(car.id);
        setFormOpen(true);
        window.scrollTo({ top: 300, behavior: 'smooth' });

        // Populate fields
        setMake(car.make);

        // Need to trigger model/variant setup manually since they depend on fetch
        const selectedBrand = carMakes.find(b => b.name === car.make);
        if (selectedBrand) {
            const models = selectedBrand.models
                .filter((m: any) => !m.discontinued)
                .sort((a: any, b: any) => a.name.localeCompare(b.name));
            setAvailableModels(models);

            const selectedModel = models.find((m: any) => m.name === car.model);
            if (selectedModel) {
                const fuels = Array.from(new Set(selectedModel.variants.map((v: any) => v.fuel_type))) as string[];
                setAvailableFuelTypes(fuels.sort());
                setAvailableVariants(selectedModel.variants);
            }
        }

        setModel(car.model);
        setVariant(car.variant);
        setMonth(car.month);
        setYear(car.year.toString());
        setPrice(car.price.toString());
        setMileage(car.mileage.toString());
        setFuelType(car.fuel_type);
        setTransmission(car.transmission);
        setOwner(car.owner);
        setColor(car.color);
        setInsuranceType(car.insurance_type);
        setAccidental(car.accidental === 1 ? "Yes" : "No");
        setServiceHistory(car.service_history === 1 ? "Available" : "Not Available");
        setSecondKey(car.second_key === 1 ? "Yes" : "No");
        setSunroof(car.sunroof === 1 ? "Yes" : "No");
        setAlloyWheels(car.alloy_wheels === 1 ? "Yes" : "No");
        setRegistration(car.registration || "");
        setStatus(car.status || "available");
        // Images cannot be pre-populated in file input, user can upload new ones to replace
    };

    const resetForm = () => {
        setEditingCarId(null);
        setMake(""); setModel(""); setVariant(""); setMonth(""); setYear("");
        setPrice(""); setMileage(""); setOwner(""); setColor("");
        setFuelType(""); setTransmission("automatic"); setInsuranceType("");
        setAccidental("No"); setServiceHistory("Available"); setSecondKey("Yes");
        setSunroof("Yes"); setAlloyWheels("Yes");
        setRegistration("");
        setStatus("available");
        setImages(null);
        setErrors({});
    };

    /**
     * RENDER LOGIN
     */
    const expectedSecretKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
    if (secretKey !== expectedSecretKey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-2xl font-bold tracking-widest uppercase">404 - Page Not Found</h1>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/media/image8.jpeg" alt="Background" className="w-full h-full object-cover filter blur-md grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
                </div>

                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl p-10 md:p-14 border border-white/10 w-full max-w-lg text-center relative z-10 shadow-2xl">
                    <div className="border border-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-white/5">
                        <Lock size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading mb-3 uppercase tracking-[0.2em] text-white">SYSTEM ACCESS</h1>
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-10">Restricted Admin Area</p>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <input
                            type="password"
                            placeholder="ENTER CREDENTIALS"
                            className="w-full bg-transparent border-b border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white text-center text-sm font-light tracking-widest uppercase placeholder:text-white/30"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 transition-colors uppercase tracking-[0.2em] text-xs">
                            Declassify & Access
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    /**
     * RENDER ADMIN DASHBOARD
     */
    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none fixed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/image8.jpeg" alt="Background" className="w-full h-full object-cover filter blur-md grayscale" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
            </div>

            <div className="border-b border-white/10 bg-[#050505]/90 backdrop-blur-md py-8 fixed w-full top-20 z-40">
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold font-heading mb-1 uppercase tracking-[0.2em]">COMMAND DEPOT</h1>
                        <p className="text-white/40 text-[10px] tracking-widest uppercase">Inventory Management</p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-white/60 hover:text-white border border-white/20 px-5 py-2 uppercase tracking-[0.15em] text-[10px] transition-colors hover:bg-white/5"
                    >
                        TERMINATE SESSION
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 mt-32 relative z-10 max-w-5xl">

                {/* ── CAR DATABASE MANAGEMENT ── */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 mb-10 shadow-2xl">
                    <button
                        onClick={() => setDbManagementOpen(!dbManagementOpen)}
                        className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer"
                    >
                        <h3 className="text-lg font-heading font-bold uppercase tracking-widest flex items-center gap-3">
                            <Database size={20} className="text-white/50" /> DYNAMIC DATA CONTROL
                        </h3>
                        {dbManagementOpen ? <ChevronUp size={20} className="text-white/50" /> : <ChevronDown size={20} className="text-white/50" />}
                    </button>

                    {dbManagementOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 pb-8 space-y-12">
                            <div className="border-t border-white/10"></div>

                            {/* Manage Brands */}
                            <div className="space-y-6">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-white/60 mb-5 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-500" /> MANAGE BRANDS
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div>
                                        <label className={labelClass}>New Brand Name</label>
                                        <input type="text" value={mBrandName} onChange={e => setMBrandName(e.target.value)} placeholder="e.g. Maruti Suzuki" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Brand ID (snake_case)</label>
                                        <input type="text" value={mBrandId} onChange={e => setMBrandId(e.target.value)} placeholder="maruti_suzuki" className={inputClass} />
                                    </div>
                                    <button onClick={handleAddBrand} className="bg-white text-black py-4 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-white/90">
                                        ADD BRAND
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                                    {carMakes.map(b => (
                                        <div key={b.id} className="group relative flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-sm hover:border-white/20 transition-all">
                                            <span className="text-xs uppercase tracking-wider font-medium">{b.name}</span>
                                            <button onClick={() => handleDeleteBrand(b.id)} className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-500 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/5"></div>

                            {/* Manage Models */}
                            <div className="space-y-6">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-white/60 mb-5 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-500" /> MANAGE MODELS
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Select Brand</label>
                                        <select value={selectedMBrand} onChange={e => setSelectedMBrand(e.target.value)} className={selectClass}>
                                            <option value="">Select</option>
                                            {carMakes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Model Name</label>
                                        <input type="text" value={mModelName} onChange={e => setMModelName(e.target.value)} placeholder="e.g. Swift" className={inputClass} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Model ID</label>
                                        <input type="text" value={mModelId} onChange={e => setMModelId(e.target.value)} placeholder="swift" className={inputClass} />
                                    </div>
                                    <button onClick={handleAddModel} className="md:col-span-2 bg-white text-black py-4 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-white/90">
                                        ADD MODEL
                                    </button>
                                </div>
                                {selectedMBrand && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                                        {carMakes.find(b => b.id === selectedMBrand)?.models.map((m: any) => (
                                            <div key={m.id} className="group relative flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-sm hover:border-white/20 transition-all">
                                                <span className="text-xs uppercase tracking-wider font-medium">{m.name}</span>
                                                <button onClick={() => handleDeleteModel(selectedMBrand, m.id)} className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-500 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/5"></div>

                            {/* Manage Variants */}
                            <div className="space-y-6">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-white/60 mb-5 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-amber-500" /> MANAGE VARIANTS
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Brand</label>
                                        <select value={selectedMBrand} onChange={e => { setSelectedMBrand(e.target.value); setSelectedMModel(""); }} className={selectClass}>
                                            <option value="">Select</option>
                                            {carMakes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Model</label>
                                        <select value={selectedMModel} onChange={e => setSelectedMModel(e.target.value)} className={selectClass} disabled={!selectedMBrand}>
                                            <option value="">Select</option>
                                            {carMakes.find(b => b.id === selectedMBrand)?.models.map((m: any) => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Variant Name</label>
                                        <input type="text" value={mVariantName} onChange={e => setMVariantName(e.target.value)} placeholder="VXi" className={inputClass} />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>Fuel Type</label>
                                        <select value={mVariantFuel} onChange={e => setMVariantFuel(e.target.value)} className={selectClass}>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="CNG">CNG</option>
                                        </select>
                                    </div>
                                    <button onClick={handleAddVariant} className="bg-white text-black py-4 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-white/90">
                                        ADD VARIANT
                                    </button>
                                </div>
                                {selectedMBrand && selectedMModel && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                                        {carMakes.find(b => b.id === selectedMBrand)?.models.find((m: any) => m.id === selectedMModel)?.variants.map((v: any, i: number) => (
                                            <div key={i} className="group relative flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-sm hover:border-white/20 transition-all">
                                                <span className="text-xs uppercase tracking-wider font-medium">{v.name} <span className="text-[8px] text-white/30">({v.fuel_type})</span></span>
                                                <button onClick={() => handleDeleteVariant(selectedMBrand, selectedMModel, v.name)} className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-500 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── ADD NEW CAR ACCORDION ── */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 mb-10 shadow-2xl">
                    <button
                        onClick={() => setFormOpen(!formOpen)}
                        className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer"
                    >
                        <h3 className="text-lg font-heading font-bold uppercase tracking-widest flex items-center gap-3">
                            {editingCarId ? (
                                <><Edit2 size={20} className="text-amber-500" /> EDIT ASSET: {model}</>
                            ) : (
                                <><Plus size={20} className="text-white/50" /> ADD NEW INVENTORY</>
                            )}
                        </h3>
                        {formOpen ? <ChevronUp size={20} className="text-white/50" /> : <ChevronDown size={20} className="text-white/50" />}
                    </button>

                    {formOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 pb-8 space-y-8">
                            <div className="border-t border-white/10"></div>

                            {/* Make, Model, Variant */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-white/60 mb-5">
                                    VEHICLE IDENTITY
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClass}>Make <span className="text-red-500">*</span></label>
                                        <select value={make} onChange={e => handleMakeChange(e.target.value)} className={`${selectClass} ${errors.make ? "border-red-500" : ""}`}>
                                            <option value="">Select Make</option>
                                            {carMakes.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Model <span className="text-red-500">*</span></label>
                                        <select value={model} onChange={e => handleModelChange(e.target.value)} className={`${selectClass} ${errors.model ? "border-red-500" : ""}`} disabled={!make}>
                                            <option value="">{make ? "Select Model" : "Select Make First"}</option>
                                            {availableModels.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Variant <span className="text-red-500">*</span></label>
                                        <select value={variant} onChange={e => handleVariantChange(e.target.value)} className={`${selectClass} ${errors.variant ? "border-red-500" : ""}`} disabled={!model}>
                                            <option value="">{model ? "Select Variant" : "Select Model First"}</option>
                                            {availableVariants.map((v, i) => (
                                                <option key={`${v.name}-${i}`} value={v.name}>{v.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Registration <span className="text-red-500">*</span></label>
                                        <input type="text" value={registration} onChange={e => setRegistration(e.target.value)} className={`${inputClass} ${errors.registration ? "border-red-500" : ""}`} placeholder="e.g. RJ 14 AB 1234" />
                                    </div>
                                </div>
                            </div>

                            {/* Month, Year, Owner, Colour */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className={labelClass}>Month <span className="text-red-500">*</span></label>
                                    <select value={month} onChange={e => setMonth(e.target.value)} className={`${selectClass} ${errors.month ? "border-red-500" : ""}`}>
                                        <option value="">Month</option>
                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Year <span className="text-red-500">*</span></label>
                                    <select value={year} onChange={e => setYear(e.target.value)} className={`${selectClass} ${errors.year ? "border-red-500" : ""}`}>
                                        <option value="">Year</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Owner</label>
                                    <select value={owner} onChange={e => setOwner(e.target.value)} className={selectClass}>
                                        <option value="">Select Owner</option>
                                        <option value="1st">1st Owner</option>
                                        <option value="2nd">2nd Owner</option>
                                        <option value="3rd">3rd Owner</option>
                                        <option value="4+">4th or More</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Colour</label>
                                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className={inputClass} placeholder="e.g. Obsidian Black" />
                                </div>
                            </div>

                            {/* Specs: Transmission, Fuel, KM, Price */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className={labelClass}>Transmission</label>
                                    <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectClass}>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Fuel Type <span className="text-red-500">*</span></label>
                                    <select value={fuelType} onChange={e => handleFuelTypeChange(e.target.value)} className={`${selectClass} ${errors.fuelType ? "border-red-500" : ""}`} disabled={!model}>
                                        <option value="">{model ? "Select Fuel" : "Select Model First"}</option>
                                        {availableFuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>KMs Driven <span className="text-red-500">*</span></label>
                                    <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} className={`${inputClass} ${errors.mileage ? "border-red-500" : ""}`} placeholder="e.g. 15000" />
                                </div>
                                <div>
                                    <label className={labelClass}>Price ($) <span className="text-red-500">*</span></label>
                                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={`${inputClass} ${errors.price ? "border-red-500" : ""}`} placeholder="e.g. 85000" />
                                </div>
                            </div>

                            {/* Features Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                    <label className={labelClass}>Availability Status</label>
                                    <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
                                        <option value="available">Available</option>
                                        <option value="booked">Booked</option>
                                        <option value="sold">Sold</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Insurance Type</label>
                                    <select value={insuranceType} onChange={e => setInsuranceType(e.target.value)} className={selectClass}>
                                        <option value="">Select Insurance</option>
                                        <option value="Comprehensive">Comprehensive</option>
                                        <option value="Third Party">Third Party</option>
                                        <option value="Zero Dep">Zero Depreciation</option>
                                        <option value="Lapsed">Lapsed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>car accidental?</label>
                                    <div className="flex gap-6 mt-3">
                                        <label className={radioLabelClass}><input type="radio" value="Yes" checked={accidental === "Yes"} onChange={e => setAccidental(e.target.value)} className={radioClass} /> Yes</label>
                                        <label className={radioLabelClass}><input type="radio" value="No" checked={accidental === "No"} onChange={e => setAccidental(e.target.value)} className={radioClass} /> No</label>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>service history</label>
                                    <div className="flex gap-6 mt-3">
                                        <label className={radioLabelClass}><input type="radio" value="Available" checked={serviceHistory === "Available"} onChange={e => setServiceHistory(e.target.value)} className={radioClass} /> Available</label>
                                        <label className={radioLabelClass}><input type="radio" value="Not Available" checked={serviceHistory === "Not Available"} onChange={e => setServiceHistory(e.target.value)} className={radioClass} /> Not Available</label>
                                    </div>
                                </div>
                            </div>

                            {/* Features Row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4 border-b border-white/10">
                                <div>
                                    <label className={labelClass}>2nd key</label>
                                    <div className="flex gap-6 mt-3">
                                        <label className={radioLabelClass}><input type="radio" value="Yes" checked={secondKey === "Yes"} onChange={e => setSecondKey(e.target.value)} className={radioClass} /> Yes</label>
                                        <label className={radioLabelClass}><input type="radio" value="No" checked={secondKey === "No"} onChange={e => setSecondKey(e.target.value)} className={radioClass} /> No</label>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>sunroof</label>
                                    <div className="flex gap-6 mt-3">
                                        <label className={radioLabelClass}><input type="radio" value="Yes" checked={sunroof === "Yes"} onChange={e => setSunroof(e.target.value)} className={radioClass} /> Yes</label>
                                        <label className={radioLabelClass}><input type="radio" value="No" checked={sunroof === "No"} onChange={e => setSunroof(e.target.value)} className={radioClass} /> No</label>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>alloy wheels</label>
                                    <div className="flex gap-6 mt-3">
                                        <label className={radioLabelClass}><input type="radio" value="Yes" checked={alloyWheels === "Yes"} onChange={e => setAlloyWheels(e.target.value)} className={radioClass} /> Yes</label>
                                        <label className={radioLabelClass}><input type="radio" value="No" checked={alloyWheels === "No"} onChange={e => setAlloyWheels(e.target.value)} className={radioClass} /> No</label>
                                    </div>
                                </div>
                            </div>

                            {/* Media Upload */}
                            <div>
                                <label className={labelClass}>MEDIA UPLOAD {!editingCarId && <span className="text-red-500">*</span>}</label>
                                <div className={`border border-dashed ${errors.images ? "border-red-500" : "border-white/20"} p-10 text-center bg-white/5 hover:bg-white/10 transition-colors`}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setImages(e.target.files)}
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="text-white/40 mb-3" size={24} />
                                        <span className="text-xs uppercase tracking-widest font-bold text-white mb-2">
                                            {editingCarId ? "UPLOAD NEW IMAGES (REPLACES OLD)" : "SELECT IMAGE FILES"}
                                        </span>
                                        <span className="text-[10px] text-white/40 tracking-widest">
                                            {images ? `${images.length} FILES QUEUED` : "JPG / PNG FORMATS ONLY"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div>
                                {Object.keys(errors).length > 0 && (
                                    <p className="text-red-400 text-[10px] uppercase tracking-widest text-center mb-4">
                                        Please complete all required fields
                                    </p>
                                )}
                                <button
                                    onClick={handleAddCar}
                                    disabled={loading}
                                    className={`w-full border ${editingCarId ? 'border-amber-500/50 hover:bg-amber-500 hover:text-black' : 'border-white hover:bg-white hover:text-black'} text-white py-5 font-bold transition-all uppercase tracking-[0.2em] text-xs mt-2 disabled:opacity-50`}
                                >
                                    {loading ? "INITIALIZING DATABASE ENTRY..." : editingCarId ? "UPDATE INVENTORY ASSET" : "PUBLISH ASSET TO INVENTORY"}
                                </button>
                                {editingCarId && (
                                    <button
                                        onClick={resetForm}
                                        className="w-full mt-4 flex items-center justify-center gap-2 text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-bold"
                                    >
                                        <X size={14} /> CANCEL EDIT MODE
                                    </button>
                                )}
                            </div>

                        </motion.div>
                    )}
                </div>


                {/* ── INVENTORY VIEW ── */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10">
                        <h2 className="text-lg font-bold font-heading flex items-center gap-3 uppercase tracking-[0.2em] text-white/70">
                            <Car size={20} /> ACTIVE INVENTORY
                        </h2>
                        <button onClick={fetchCars} className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest font-bold border border-white/10 px-4 py-2 hover:bg-white/5">
                            SYNC DB
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {loading && cars.length === 0 ? (
                            <div className="text-center py-20 text-white/30 text-xs tracking-widest uppercase font-bold">Querying Data...</div>
                        ) : cars.length === 0 ? (
                            <div className="text-center py-32 text-white/20 border border-white/5 bg-[#050505]">
                                <Car size={48} className="mx-auto mb-6 opacity-30" />
                                <p className="uppercase tracking-[0.2em] text-xs font-bold">NO ASSETS FOUND. AWAITING INPUT.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cars.map(car => (
                                    <div key={car.id} className="border border-white/10 bg-[#111] flex flex-col hover:border-white/30 transition-colors group">
                                        <div className="h-48 bg-[#050505] overflow-hidden relative border-b border-white/5">
                                            {car.images && car.images.length > 0 ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={car.images[0].startsWith("http") ? car.images[0] : `${API_BASE_URL}${car.images[0]}`} alt={car.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={32} /></div>
                                            )}
                                            {car.status && (car.status.toLowerCase() === "booked" || car.status.toLowerCase() === "sold") && (
                                                <div className={`absolute top-3 left-3 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest border z-10 ${
                                                    car.status.toLowerCase() === "sold" ? "bg-red-600/90 border-red-500/50" : "bg-amber-600/90 border-amber-500/50"
                                                }`}>
                                                    {car.status}
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                                                ₹{car.price.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="p-5 flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] text-white/40 font-bold mb-1 tracking-[0.2em] uppercase">{car.year} • {car.make}</div>
                                                <h3 className="font-bold text-white text-xl font-heading leading-tight uppercase relative inline-block group-hover:text-gray-300">
                                                    {car.model}
                                                </h3>
                                                <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">{car.mileage.toLocaleString('en-IN')} KM • {car.fuel_type}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEditClick(car)}
                                                    className="text-white/30 hover:text-amber-400 p-2 transition-colors"
                                                    title="Edit Car"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(car.id)}
                                                    className="text-white/30 hover:text-red-400 p-2 transition-colors"
                                                    title="Delete Car"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen"></div>}>
            <AdminContent />
        </Suspense>
    );
}
