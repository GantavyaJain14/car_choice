"use client";

import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login with:", email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/media/image8.jpeg"
                    alt="Login Background"
                    className="w-full h-full object-cover filter blur-sm grayscale"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-10 md:p-14">
                    <div className="text-center mb-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Link href="/">
                            <img
                                src="/media/image2.jpeg"
                                alt="Logo"
                                className="shrink-0 bg-white object-contain rounded-md mx-auto mb-6 grayscale"
                                style={{ width: "80px", height: "80px", maxWidth: "80px" }}
                            />
                        </Link>
                        <h1 className="text-2xl font-bold font-heading mb-2 uppercase tracking-[0.2em] text-white">ACCESS PORTAL</h1>
                        <p className="text-white/40 text-xs tracking-widest uppercase">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-white/50 mb-3">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-white/20 text-white px-2 py-3 focus:outline-none focus:border-white transition-colors text-sm font-light"
                                placeholder="admin@carchoice.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-white/50 mb-3">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full bg-transparent border-b border-white/20 text-white px-2 py-3 focus:outline-none focus:border-white transition-colors text-sm font-light pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute right-2 top-3.5 text-white/30" size={16} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs mt-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 bg-transparent border border-white/30 checked:bg-white focus:ring-0 appearance-none rounded-none relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[4px] after:top-[1px] after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-black after:rotate-45" />
                                <span className="text-white/60 tracking-wider uppercase">Remember Me</span>
                            </label>
                            <a href="#" className="text-white/80 hover:text-white transition-colors tracking-wider uppercase">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black py-4 font-bold uppercase tracking-[0.2em] text-xs transition-colors flex justify-center items-center gap-3 mt-8">
                            <LogIn size={16} /> SIGN IN
                        </button>
                    </form>

                    <div className="mt-10 text-center text-xs text-white/40 tracking-widest uppercase">
                        Don&apos;t have an account? <Link href="/signup" className="text-white hover:underline ml-2">Register</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
