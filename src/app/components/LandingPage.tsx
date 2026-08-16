// LandingPage — the public marketing homepage for Pother Dake.
// Sections: hero → stats → popular routes → how it works → features → testimonials → CTA → footer.

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  MapPin, Calendar, Users, ArrowRight, Star, Shield, Zap,
  ChevronRight, Bike, Car, Bus, Clock, CheckCircle, Search,
  TrendingUp, Heart, Award, Phone, MessageSquare
} from "lucide-react";
import { popularRoutes, bangladeshCities } from "./mockData";

// Platform-level stats displayed below the hero — update these as the platform grows
const STATS = [
  { value: "48,520+", label: "Registered Users", icon: Users },
  { value: "3,842", label: "Verified Drivers", icon: Shield },
  { value: "128K+", label: "Trips Completed", icon: Car },
  { value: "50+", label: "Cities Covered", icon: MapPin },
];

// Three-step explainer — keep descriptions under ~15 words each for scannability
const HOW_IT_WORKS = [
  {
    step: "01", icon: Search, title: "Find Your Ride",
    desc: "Search rides by route, date and number of passengers. Find the best match for your journey."
  },
  {
    step: "02", icon: CheckCircle, title: "Book Instantly",
    desc: "Choose your driver, review their profile and ratings, then book with instant or manual confirmation."
  },
  {
    step: "03", icon: MapPin, title: "Travel Together",
    desc: "Share the ride, save money, and enjoy the journey. Both you and the driver benefit."
  },
];

// Feature highlights — each has a unique accent colour to avoid visual monotony
const FEATURES = [
  { icon: Shield, title: "Verified Drivers", desc: "Every driver goes through NID, license, and face verification before being approved.", color: "#00C896" },
  { icon: Star, title: "Trusted Reviews", desc: "Real ratings from real passengers. Book with confidence based on driver history.", color: "#FF6B2B" },
  { icon: Zap, title: "Instant Booking", desc: "Many rides offer instant confirmation. No waiting, just book and go.", color: "#7B61FF" },
  { icon: Phone, title: "24/7 Support", desc: "Emergency SOS, live location sharing, and round-the-clock customer support.", color: "#FF4E88" },
  { icon: MessageSquare, title: "In-App Chat", desc: "Coordinate pickup details directly with your driver through secure in-app messaging.", color: "#FFB800" },
  { icon: Heart, title: "Women Only Rides", desc: "Female drivers offering safe, women-only rides for added peace of mind.", color: "#FF6B2B" },
];

// Real-sounding testimonials that reflect actual use cases (solo travel, group, women-only)
const TESTIMONIALS = [
  { name: "Tahmina Khatun", city: "Dhaka → Sylhet", rating: 5, text: "Pother Dake changed how I travel. Clean car, great driver, and saved ৳200 compared to a bus ticket!", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tahmina&backgroundColor=ffd5dc" },
  { name: "Sabbir Hossain", city: "Chittagong → Cox's Bazar", rating: 5, text: "The driver was punctual and professional. The QR code check-in was really cool. Highly recommend!", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sabbir&backgroundColor=b6e3f4" },
  { name: "Roksana Parvin", city: "Dhaka → Rajshahi", rating: 5, text: "Finally a safe option for solo female travel! The women-only ride feature is brilliant.", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roksana&backgroundColor=d1f4d1" },
];

// Quick-glance vehicle type pills shown in the hero section
const VEHICLE_TYPES = [
  { icon: Bike, label: "Bike", desc: "Fast & affordable" },
  { icon: Car, label: "Car", desc: "Comfortable & spacious" },
  { icon: Bus, label: "Microbus", desc: "For groups & families" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({ from: "", to: "", date: "", passengers: "1" });

  // Push search params into the URL so the results page can read them via useSearchParams
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${searchForm.from}&to=${searchForm.to}&date=${searchForm.date}&passengers=${searchForm.passengers}`);
  };

  return (
    <div style={{ color: "white", paddingTop: 72 }}>
      {/* ─── Hero Section ─────────────────────────────────────────────
           Animated radial gradient blobs + a subtle grid overlay.
           City autocomplete uses a <datalist> — no extra library needed. */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #00C896, transparent)", top: "-10%", left: "20%" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #7B61FF, transparent)", bottom: "10%", right: "10%" }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #FF6B2B, transparent)", bottom: "20%", left: "5%" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm" style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", color: "#00C896" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00C896" }} />
              Bangladesh's #1 Intercity Ridesharing Platform
            </div>

            <h1 className="mb-6 leading-none" style={{ fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 900, letterSpacing: "-2px" }}>
              Where Every Journey{" "}
              <span style={{ background: "linear-gradient(135deg, #00C896, #7B61FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Finds a Friend
              </span>
            </h1>

            <p className="mb-10 mx-auto max-w-xl" style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Share rides across Bangladesh. Save money, reduce traffic, and make friends on the road. Trusted by 48,000+ travelers.
            </p>

            {/* Vehicle type pills */}
            <div className="flex justify-center gap-3 mb-8">
              {VEHICLE_TYPES.map(({ icon: Icon, label, desc }) => (
                <motion.div key={label} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon size={16} style={{ color: "#00C896" }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl p-6 mx-auto max-w-3xl"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                {[
                  { icon: MapPin, placeholder: "From City", field: "from", type: "text" },
                  { icon: MapPin, placeholder: "To City", field: "to", type: "text" },
                  { icon: Calendar, placeholder: "Date", field: "date", type: "date" },
                  { icon: Users, placeholder: "Passengers", field: "passengers", type: "number" },
                ].map(({ icon: Icon, placeholder, field, type }) => (
                  <div key={field} className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon size={16} style={{ color: "#00C896", flexShrink: 0 }} />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={searchForm[field as keyof typeof searchForm]}
                      min={type === "number" ? 1 : undefined}
                      max={type === "number" ? 10 : undefined}
                      onChange={(e) => setSearchForm({ ...searchForm, [field]: e.target.value })}
                      list={field === "from" || field === "to" ? `cities-${field}` : undefined}
                      className="bg-transparent outline-none text-white placeholder-white/30 w-full text-sm"
                    />
                    {(field === "from" || field === "to") && (
                      <datalist id={`cities-${field}`}>
                        {bangladeshCities.map(city => <option key={city} value={city} />)}
                      </datalist>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["Tomorrow", "This Weekend", "Return Trip"].map((opt) => (
                    <button key={opt} type="button" className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {opt}
                    </button>
                  ))}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
                >
                  <Search size={16} />
                  Search Rides
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────────── */}
      <section className="py-14 px-4" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(0,200,150,0.1)" }}>
                <Icon size={22} style={{ color: "#00C896" }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "white" }}>{value}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Popular Routes ──────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm px-3 py-1 rounded-full mb-4 inline-block" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>Popular Routes</span>
            <h2 className="text-white" style={{ fontWeight: 800, letterSpacing: "-1px" }}>Most Traveled Routes</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Find rides on Bangladesh's busiest intercity corridors</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => navigate(`/search?from=${route.from}&to=${route.to}`)}
                className="p-5 rounded-2xl cursor-pointer group transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,150,0.1)" }}>
                      <MapPin size={15} style={{ color: "#00C896" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>{route.from}</span>
                        <ArrowRight size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>{route.to}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{route.km} km · {route.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>From </span>
                    <span style={{ color: "#00C896", fontWeight: 700, fontSize: 16 }}>৳{route.price}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>/seat</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>
                    {route.trips} rides available
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm px-3 py-1 rounded-full mb-4 inline-block" style={{ background: "rgba(123,97,255,0.1)", color: "#7B61FF" }}>How It Works</span>
            <h2 className="text-white" style={{ fontWeight: 800, letterSpacing: "-1px" }}>Travel Smarter in 3 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative p-7 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="absolute top-5 right-5 text-5xl" style={{ fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>{step}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,200,150,0.05))", border: "1px solid rgba(0,200,150,0.2)" }}>
                  <Icon size={22} style={{ color: "#00C896" }} />
                </div>
                <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm px-3 py-1 rounded-full mb-4 inline-block" style={{ background: "rgba(255,107,43,0.1)", color: "#FF6B2B" }}>Why Choose Us</span>
            <h2 className="text-white" style={{ fontWeight: 800, letterSpacing: "-1px" }}>Built for Safe, Affordable Travel</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h4 className="text-white mb-2" style={{ fontWeight: 700 }}>{title}</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm px-3 py-1 rounded-full mb-4 inline-block" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>Testimonials</span>
            <h2 className="text-white" style={{ fontWeight: 800, letterSpacing: "-1px" }}>What Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, city, rating, text, photo }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-start gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#FFB800" style={{ color: "#FFB800" }} />
                  ))}
                </div>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 16 }}>"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={photo} className="w-9 h-9 rounded-full" alt={name} />
                  <div>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Driver CTA ──────────────────────────────────────────────────
           Encourages existing travelers to post their trips and earn money.
           // For details: Shahriyar Sumon (LinkedIn: linkedin.com/in/shahriyarsumon) */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.15), rgba(123,97,255,0.1))", border: "1px solid rgba(0,200,150,0.2)" }}
          >
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #00C896, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm" style={{ background: "rgba(0,200,150,0.15)", color: "#00C896" }}>
                <TrendingUp size={13} />
                Earn Money While You Travel
              </div>
              <h2 className="text-white mb-4" style={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                Already Traveling? Share Your Ride.
              </h2>
              <p className="mx-auto max-w-lg mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                If you're planning an intercity trip, post it on Pother Dake. Let passengers join, split costs, and earn money on your regular journeys.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
                  onClick={() => navigate("/driver/post-trip")}
                >
                  Post Your First Trip <ArrowRight size={16} />
                </motion.button>
                <button className="px-7 py-3.5 rounded-xl text-sm" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                  <Award size={15} className="inline mr-2" />
                  Driver Benefits
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-12 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00C896, #009E78)" }}>
                  <MapPin size={15} className="text-white" />
                </div>
                <span className="text-white" style={{ fontWeight: 800 }}>Pother Dake</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Where every journey finds a friend. Bangladesh's trusted intercity ridesharing platform.
              </p>
            </div>
            {[
              { title: "Company", links: ["About Us", "How It Works", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Safety", "FAQ", "Contact Us", "Support Ticket"] },
              { title: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Refund Policy"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-white mb-4 text-sm" style={{ fontWeight: 700 }}>{title}</p>
                {links.map(link => (
                  <p key={link} className="mb-2 text-sm cursor-pointer hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{link}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2026 Pother Dake. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Made with ❤️ in Bangladesh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
