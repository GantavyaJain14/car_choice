import { Car } from "@/components/CarCard";
import CarsContent from "./CarsContent";

async function getAllCars(): Promise<Car[]> {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/cars", { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((car: Car, i: number) => ({
            ...car,
            images: car.images && car.images.length > 0 ? car.images : [`/media/image${(i % 8) + 1}.jpeg`]
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default async function CarsPage() {
    const cars = await getAllCars();

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-32">
            {/* Page Header */}
            <div className="relative overflow-hidden border-b border-white/10 mb-16 pb-12 pt-16">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <h4 className="text-white/40 font-bold uppercase tracking-[0.3em] mb-4 text-xs">Explore Curated</h4>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4 uppercase text-white tracking-widest leading-none">
                        OUR <span className="text-white/50">COLLECTION</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl font-light tracking-wide leading-relaxed">
                        Experience uncompromised luxury and performance from our highly vetted selection of exquisite automobiles.
                    </p>
                </div>
                
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            </div>

            <CarsContent initialCars={cars} />
        </div>
    );
}
