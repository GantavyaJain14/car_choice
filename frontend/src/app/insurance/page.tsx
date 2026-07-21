"use client";

import { useState } from "react";
import { ThumbsUp, Trophy, Calculator, Phone, CheckCircle2 } from "lucide-react";

export default function InsurancePage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/call-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    preferred_time: "Insurance Page Callback"
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setName("");
                    setPhone("");
                }, 4000);
            } else {
                console.error("Submission failed");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const features = [
        {
            Icon: ThumbsUp,
            title: "Unbiased Comparison",
            description: "With multiple insurers integrated, we provide an unbiased comparison between all the top insurers."
        },
        {
            Icon: Trophy,
            title: "Expert Guidance",
            description: "Our experts help you choose the best plan tailored to your luxury vehicle's specific needs."
        },
        {
            Icon: Calculator,
            title: "Best Premiums",
            description: "Get the most competitive rates in the market with exclusive tie-ups with leading providers."
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            {/* Hero & Content Section */}
            <section className="pt-32 pb-20 px-6 md:px-12">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-white/5 shadow-2xl">

                        {/* Left Side - Info */}
                        <div className="lg:w-3/5 bg-[#0a0a0a] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

                            <div className="relative z-10">
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight font-heading">
                                    Get cashless services at <span className="text-white/40">3500+</span> network garages
                                </h1>

                                <p className="text-white/60 text-lg leading-relaxed mb-16 max-w-xl font-light">
                                    A vehicle in today's world is an inseparable part of life. It gives an exclusiveness & freedom to your movement whether it is your day to day activity or going for a long drive with your family. We ensure your luxury asset stays protected with the best-in-class insurance solutions.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex flex-col gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                <feature.Icon className="text-white" size={24} />
                                            </div>
                                            <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs text-white/40 leading-relaxed font-light">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="lg:w-2/5 bg-black p-8 md:p-16 border-l border-white/5 flex flex-col items-center justify-center text-center relative">
                            {/* Decorative background element */}
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

                            <div className="w-full max-w-sm relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wider uppercase font-heading">
                                    Want to know <span className="text-red-500 italic">More?</span>
                                </h2>

                                {submitted ? (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                                        <CheckCircle2 className="text-green-500" size={48} />
                                        <h3 className="text-xl font-bold">Request Sent!</h3>
                                        <p className="text-white/50 text-sm">Our insurance manager will call you shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="text-left">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block ml-1">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 focus:outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block ml-1">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 focus:outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-5 rounded-lg hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                                        >
                                            Request a Callback
                                        </button>
                                    </form>
                                )}

                                <div className="mt-16 pt-16 border-t border-white/5">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">For Assistance, Please Call</p>
                                    <h4 className="text-sm font-bold tracking-widest mb-2 uppercase text-white/80">Our Insurance Manager</h4>
                                    <a
                                        href="tel:+919414412345"
                                        className="text-2xl md:text-3xl font-bold text-red-500 hover:text-red-400 transition-colors tracking-tighter"
                                    >
                                        94144-12345
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
