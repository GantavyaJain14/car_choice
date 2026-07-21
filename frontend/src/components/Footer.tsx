import Link from "next/link";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
    </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.582 6.186a2.715 2.715 0 00-1.911-1.924C17.985 3.8 12 3.8 12 3.8s-5.985 0-7.671.462a2.715 2.715 0 00-1.911 1.924C2 7.892 2 12 2 12s0 4.108.418 5.814a2.715 2.715 0 001.911 1.924C6.015 20.2 12 20.2 12 20.2s5.985 0 7.671-.462a2.715 2.715 0 001.911-1.924C22 16.108 22 12 22 12s0-4.108-.418-5.814zm-11.832 9.278V8.536L16 12l-6.25 3.464z" clipRule="evenodd" fillRule="evenodd" />
    </svg>
);

const GoogleMapsIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
            <linearGradient id="maps-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA4335" />
                <stop offset="33%" stopColor="#4285F4" />
                <stop offset="66%" stopColor="#34A853" />
                <stop offset="100%" stopColor="#FBBC05" />
            </linearGradient>
        </defs>
        <path className="fill-current group-hover:[fill:url(#maps-gradient)] transition-colors duration-300" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Subtle Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/media/image2.jpeg"
                                alt="Car Choice Logo"
                                className="shrink-0 h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-2xl font-bold tracking-[0.2em] font-heading leading-none">
                                    CAR CHOICE<span className="text-[16px] font-normal tracking-normal relative -top-3.5 -ml-1.5">®</span>
                                </span>
                                <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Right Car Right Choice</span>
                            </div>
                        </Link>
                        <p className="text-white/50 mb-8 leading-relaxed max-w-sm text-sm font-light">
                            India's leading destination for pre-owned cars. Quality, trust, and excellence redefine your automotive journey with us.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: FacebookIcon, href: "https://www.facebook.com/carchoicemoto", hoverClass: "group hover:bg-white hover:border-white hover:text-[#0866FF]" },
                                { Icon: WhatsAppIcon, href: "https://wa.me/c/919588280238?lang=en", hoverClass: "hover:bg-[#25D366] hover:border-[#25D366] hover:text-white" },
                                { Icon: Instagram, href: "https://www.instagram.com/carchoice.moto?igsh=MTIxMzl6djR3bDd2cw==", hoverClass: "hover:bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] hover:border-transparent hover:text-white" },
                                { Icon: YoutubeIcon, href: "https://youtube.com/@carchoicemoto?si=E0Hk9iLhYSivd3S7", hoverClass: "group hover:bg-white hover:border-white hover:text-[#FF0000]" },
                                { Icon: GoogleMapsIcon, href: " https://maps.app.goo.gl/gZMN6UUjMCU39Zf38?g_st=iw", hoverClass: "group hover:bg-white hover:border-white" }
                            ].map((social, i) => (
                                <a key={i} href={social.href} className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 text-white/70 ${social.hoverClass}`}>
                                    <social.Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-6 tracking-widest uppercase">COLLECTION</h4>
                        <ul className="flex flex-col gap-4 text-sm font-light text-white/50">
                            <li><Link href="/cars" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Cars</Link></li>
                            <li><Link href="/cars?make=mercedes" className="hover:text-white hover:translate-x-1 inline-block transition-all">Mercedes-Benz</Link></li>
                            <li><Link href="/cars?make=bmw" className="hover:text-white hover:translate-x-1 inline-block transition-all">BMW</Link></li>
                            <li><Link href="/cars?make=audi" className="hover:text-white hover:translate-x-1 inline-block transition-all">Audi</Link></li>
                            <li><Link href="/cars?make=porsche" className="hover:text-white hover:translate-x-1 inline-block transition-all">Porsche</Link></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-6 tracking-widest uppercase">COMPANY</h4>
                        <ul className="flex flex-col gap-4 text-sm font-light text-white/50">
                            <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Services</Link></li>
                            <li><Link href="/sell" className="hover:text-white hover:translate-x-1 inline-block transition-all">Sell Your Car</Link></li>
                            <li><Link href="/career" className="hover:text-white hover:translate-x-1 inline-block transition-all">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-6 tracking-widest uppercase">CONTACT</h4>
                        <ul className="flex flex-col gap-5 text-sm font-light text-white/50">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-white/30 shrink-0 mt-0.5" size={16} />
                                <span>34, Durga Vihar, Sector 3, Malviya Nagar, Jaipur, Rajasthan, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-white/30 shrink-0" size={16} />
                                <span>+91 9929020000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-white/30 shrink-0" size={16} />
                                <span>carchoice.moto@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-white/30 text-xs font-light tracking-wide gap-4">
                    <p>&copy; {new Date().getFullYear()} Car Choice®. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
