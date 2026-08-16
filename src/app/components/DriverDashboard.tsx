// DriverDashboard — earnings, trip management, and vehicle verification for drivers.
// Also houses the PostTripForm modal so drivers can publish a new ride without leaving the page.
// Project maintained by Shahriyar Sumon

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Car, TrendingUp, Star, Users, Clock, MapPin, Shield, CheckCircle,
  AlertCircle, Plus, ChevronRight, Bike, Bus, ArrowRight, Calendar,
  Upload, X, Wind, Music, Package, Heart
} from "lucide-react";
import { mockTrips, bangladeshCities } from "./mockData";

// Stubbed driver session — in production this comes from the JWT decoded payload + /api/driver/me
const DRIVER_DATA = {
  name: "Rafiqul Islam",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul&backgroundColor=b6e3f4",
  verificationStatus: "approved" as "pending" | "approved" | "rejected",
  rating: 4.8,
  reviews: 234,
  totalTrips: 456,
  monthEarnings: 18500,
  totalEarnings: 185000,
  vehicle: { type: "car", model: "Toyota Allion 2019", plate: "ঢাকা মেট্রো-গ ১১-২৩৪৫", color: "Silver" },
};

// Maps verification status to the banner colour scheme shown at the top of the dashboard
const STATUS_COLORS = {
  pending: { bg: "rgba(255,183,0,0.1)", color: "#FFB800", label: "Pending Approval", icon: Clock },
  approved: { bg: "rgba(0,200,150,0.1)", color: "#00C896", label: "Verified Driver", icon: CheckCircle },
  rejected: { bg: "rgba(213,24,61,0.1)", color: "#D4183D", label: "Verification Rejected", icon: X },
};

/* PostTripForm — 5-step wizard for creating a new trip listing.
   Steps: Route → Vehicle → Preferences → Pricing → Review & Publish
   Custom business logic: platform takes 10% commission, shown to driver in step 4. */
function PostTripForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    from: "", to: "", stops: "", date: "", departureTime: "", arrivalTime: "",
    vehicleType: "car", seats: 2, pricePerSeat: 300, description: "",
    ac: true, music: false, smoking: false, pets: false, luggage: true, helmet: false, womenOnly: false,
    instantBooking: true, luggageWeight: 10,
  });

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "white",
    width: "100%",
    outline: "none",
    fontSize: 13,
  };

  // Vehicle options shown as icon cards in step 2
  const VEHICLE_TYPES = [
    { key: "bike", icon: Bike, label: "Bike" },
    { key: "car", icon: Car, label: "Car" },
    { key: "microbus", icon: Bus, label: "Microbus" },
  ];

  // Toggle-able amenity list in step 3 — each item maps to a boolean in the trip form state
  const AMENITIES = [
    { key: "ac", icon: Wind, label: "AC" },
    { key: "music", icon: Music, label: "Music" },
    { key: "luggage", icon: Package, label: "Luggage" },
    { key: "pets", icon: Heart, label: "Pets" },
    { key: "smoking", icon: AlertCircle, label: "Smoking" },
    { key: "helmet", icon: Shield, label: "Helmet" },
    { key: "womenOnly", icon: Users, label: "Women Only" },
  ];

  // Step labels drive both the progress bar and the heading in the modal header
  const STEPS = ["Route", "Vehicle", "Preferences", "Pricing", "Review"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: "#0D1528", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div>
            <h3 className="text-white" style={{ fontWeight: 700 }}>Post a New Trip</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Step {step} of {STEPS.length}: {STEPS[step - 1]}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><X size={18} /></button>
        </div>

        {/* Step progress */}
        <div className="px-5 pt-4 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i < step ? "#00C896" : "rgba(255,255,255,0.08)" }} />
          ))}
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Starting Point *</label>
                <input style={inputStyle} placeholder="From city" list="cities-from" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
                <datalist id="cities-from">{bangladeshCities.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Destination *</label>
                <input style={inputStyle} placeholder="To city" list="cities-to" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                <datalist id="cities-to">{bangladeshCities.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Stop Points (optional)</label>
                <input style={inputStyle} placeholder="e.g. Comilla, Feni (comma separated)" value={form.stops} onChange={e => setForm({ ...form, stops: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Date *</label>
                  <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Departure Time *</label>
                  <input style={inputStyle} type="time" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Estimated Arrival Time</label>
                <input style={inputStyle} type="time" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-3 block" style={{ color: "rgba(255,255,255,0.5)" }}>Vehicle Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_TYPES.map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setForm({ ...form, vehicleType: key })}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{ background: form.vehicleType === key ? "rgba(0,200,150,0.12)" : "rgba(255,255,255,0.04)", border: form.vehicleType === key ? "1px solid rgba(0,200,150,0.35)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <Icon size={22} style={{ color: form.vehicleType === key ? "#00C896" : "rgba(255,255,255,0.4)", margin: "0 auto 6px" }} />
                      <p style={{ fontSize: 13, color: form.vehicleType === key ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Available Seats *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button key={n} onClick={() => setForm({ ...form, seats: n })}
                      className="w-10 h-10 rounded-xl text-sm transition-all"
                      style={{ background: form.seats === n ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.05)", color: form.seats === n ? "#00C896" : "rgba(255,255,255,0.5)", border: form.seats === n ? "1px solid rgba(0,200,150,0.3)" : "1px solid transparent", fontWeight: 700 }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Select what your ride offers:</p>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map(({ key, icon: Icon, label }) => {
                  const val = form[key as keyof typeof form] as boolean;
                  return (
                    <button key={key} onClick={() => setForm({ ...form, [key]: !val })}
                      className="flex items-center gap-2 p-3 rounded-xl text-left transition-all"
                      style={{ background: val ? "rgba(0,200,150,0.1)" : "rgba(255,255,255,0.04)", border: val ? "1px solid rgba(0,200,150,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <Icon size={15} style={{ color: val ? "#00C896" : "rgba(255,255,255,0.3)" }} />
                      <span style={{ fontSize: 13, color: val ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: val ? 600 : 400 }}>{label}</span>
                      {val && <CheckCircle size={12} style={{ color: "#00C896", marginLeft: "auto" }} />}
                    </button>
                  );
                })}
              </div>
              {form.luggage && (
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Max Luggage Weight: {form.luggageWeight}kg</label>
                  <input type="range" min={5} max={30} step={5} value={form.luggageWeight} onChange={e => setForm({ ...form, luggageWeight: +e.target.value })} className="w-full accent-emerald-400" />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Price Per Seat (৳) *</label>
                <input style={inputStyle} type="number" min={50} value={form.pricePerSeat} onChange={e => setForm({ ...form, pricePerSeat: +e.target.value })} />
              </div>

              <div className="p-3 rounded-xl" style={{ background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.12)" }}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>You earn per seat</span>
                  <span className="text-white" style={{ fontWeight: 600 }}>৳{Math.round(form.pricePerSeat * 0.9)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Platform fee (10%)</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>৳{Math.round(form.pricePerSeat * 0.1)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Booking Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ key: true, label: "Instant", desc: "Auto-confirm" }, { key: false, label: "Manual", desc: "You approve" }].map(({ key, label, desc }) => (
                    <button key={String(key)} onClick={() => setForm({ ...form, instantBooking: key })
                    } className="p-3 rounded-xl text-center transition-all"
                      style={{ background: form.instantBooking === key ? "rgba(0,200,150,0.1)" : "rgba(255,255,255,0.04)", border: form.instantBooking === key ? "1px solid rgba(0,200,150,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
                      <p style={{ color: form.instantBooking === key ? "#00C896" : "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13 }}>{label}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.5)" }}>Trip Description</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} placeholder="Tell passengers about your trip..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Review your trip details before publishing:</p>
              <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { label: "Route", value: `${form.from || "—"} → ${form.to || "—"}${form.stops ? ` via ${form.stops}` : ""}` },
                  { label: "Date", value: form.date || "Not set" },
                  { label: "Departure", value: form.departureTime || "Not set" },
                  { label: "Vehicle", value: `${form.vehicleType} · ${form.seats} seats` },
                  { label: "Price", value: `৳${form.pricePerSeat}/seat · ${form.instantBooking ? "Instant" : "Manual"} booking` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                    <span style={{ fontSize: 13, color: "white", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries({ ac: form.ac, music: form.music, luggage: form.luggage, pets: form.pets, smoking: form.smoking, helmet: form.helmet, womenOnly: form.womenOnly })
                  .filter(([, v]) => v).map(([k]) => (
                    <span key={k} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896", border: "1px solid rgba(0,200,150,0.2)", textTransform: "capitalize" }}>{k}</span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="px-5 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              Back
            </button>
          )}
          <button
            onClick={() => step < 5 ? setStep(s => s + 1) : onClose()}
            className="flex-1 py-3 rounded-xl text-white text-sm"
            style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
          >
            {step === 5 ? "Publish Trip 🚀" : "Continue"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Main driver dashboard — verification banner always visible above the tab content
export default function DriverDashboard() {
  const [showPostTrip, setShowPostTrip] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "earnings" | "vehicle">("overview");
  const status = STATUS_COLORS[DRIVER_DATA.verificationStatus];
  const SIcon = status.icon;
  const TABS = ["overview", "trips", "earnings", "vehicle"] as const;
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ color: "white" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Driver Dashboard</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Manage your trips and earnings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPostTrip(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
        >
          <Plus size={15} /> Post a Trip
        </motion.button>
      </div>

      {/* Verification status banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ background: status.bg, border: `1px solid ${status.color}30` }}>
        <SIcon size={18} style={{ color: status.color }} />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: status.color }}>{status.label}</p>
          {DRIVER_DATA.verificationStatus === "pending" && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>NID and license documents are under review</p>}
          {DRIVER_DATA.verificationStatus === "approved" && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>All documents verified. You can post trips.</p>}
          {DRIVER_DATA.verificationStatus === "rejected" && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Please re-submit your documents.</p>}
        </div>
        {DRIVER_DATA.verificationStatus === "rejected" && (
          <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(213,24,61,0.15)", color: "#D4183D", fontWeight: 600 }}>Re-submit</button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2 rounded-lg text-sm capitalize transition-all"
            style={{ background: activeTab === tab ? "rgba(0,200,150,0.15)" : "transparent", color: activeTab === tab ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: activeTab === tab ? 600 : 400 }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: TrendingUp, label: "This Month", value: `৳${DRIVER_DATA.monthEarnings.toLocaleString()}`, color: "#00C896", sub: "earnings" },
              { icon: Car, label: "Total Trips", value: DRIVER_DATA.totalTrips.toString(), color: "#7B61FF", sub: "all time" },
              { icon: Star, label: "Rating", value: DRIVER_DATA.rating.toString(), color: "#FFB800", sub: `${DRIVER_DATA.reviews} reviews` },
              { icon: Users, label: "Passengers", value: "1,248", color: "#FF6B2B", sub: "carried" },
            ].map(({ icon: Icon, label, value, color, sub }) => (
              <motion.div key={label} whileHover={{ y: -2 }} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{label}</span>
                </div>
                <p className="text-white" style={{ fontWeight: 800, fontSize: 22 }}>{value}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Active trips */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white" style={{ fontWeight: 700 }}>Your Posted Trips</h3>
              <button onClick={() => setActiveTab("trips")} style={{ fontSize: 13, color: "#00C896" }}>View all</button>
            </div>
            <div className="space-y-3">
              {mockTrips.filter(t => t.driver.id === "d1").slice(0, 2).map(trip => (
                <div key={trip.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,200,150,0.1)" }}>
                    <Car size={18} style={{ color: "#00C896" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{trip.from} → {trip.to}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{trip.date} · {trip.departureTime} · {trip.seatsAvailable}/{trip.totalSeats} seats left</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm" style={{ fontWeight: 700 }}>৳{trip.pricePerSeat}</p>
                    <span className="text-xs" style={{ color: "#00C896" }}>Active</span>
                  </div>
                </div>
              ))}
              {mockTrips.filter(t => t.driver.id === "d1").length === 0 && (
                <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Car size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
                  <p>No trips posted yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Your Rating Breakdown</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p style={{ fontSize: 48, fontWeight: 900, color: "#FFB800", lineHeight: 1 }}>{DRIVER_DATA.rating}</p>
                <div className="flex gap-0.5 justify-center my-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < Math.floor(DRIVER_DATA.rating) ? "#FFB800" : "transparent"} style={{ color: "#FFB800" }} />)}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{DRIVER_DATA.reviews} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { label: "Safety", val: 4.9 },
                  { label: "Cleanliness", val: 4.7 },
                  { label: "Driving", val: 4.8 },
                  { label: "Communication", val: 4.9 },
                  { label: "Punctuality", val: 4.8 },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", width: 100, flexShrink: 0 }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(val / 5) * 100}%`, background: "#00C896" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "white", fontWeight: 600, width: 28 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "trips" && (
        <div>
          <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>All Your Trips</h3>
          <div className="space-y-3">
            {mockTrips.slice(0, 4).map(trip => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white" style={{ fontWeight: 700 }}>{trip.from} → {trip.to}</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{trip.date} · Departs {trip.departureTime}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: "#00C896", fontWeight: 800, fontSize: 18 }}>৳{trip.pricePerSeat}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>/seat</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{trip.seatsAvailable}/{trip.totalSeats} seats left</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{trip.vehicleType}</span>
                    {trip.instantBooking && <span style={{ fontSize: 11, color: "#7B61FF" }}>⚡ Instant</span>}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Edit</button>
                    <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(213,24,61,0.1)", color: "#D4183D" }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Earnings Tab ────────────────────────────────────────────── */}
      {activeTab === "earnings" && (
        <div>
          <div className="p-6 rounded-2xl mb-5" style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.12), rgba(0,200,150,0.04))", border: "1px solid rgba(0,200,150,0.2)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Total Earnings</p>
            <p style={{ fontWeight: 900, fontSize: 36, color: "white" }}>৳{DRIVER_DATA.totalEarnings.toLocaleString()}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: "This Month", value: `৳${DRIVER_DATA.monthEarnings.toLocaleString()}` },
                { label: "Pending", value: "৳2,400" },
                { label: "Withdrawn", value: "৳182,600" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-white" style={{ fontWeight: 700 }}>{value}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-white mb-3" style={{ fontWeight: 700 }}>Recent Payments</h3>
          <div className="space-y-2">
            {[
              { route: "Dhaka → Chittagong", date: "Jul 25", passengers: 3, earned: 945 },
              { route: "Dhaka → Chittagong", date: "Jul 20", passengers: 2, earned: 630 },
              { route: "Dhaka → Khulna", date: "Jul 15", passengers: 4, earned: 1620 },
              { route: "Dhaka → Rajshahi", date: "Jul 10", passengers: 3, earned: 864 },
            ].map(({ route, date, passengers, earned }, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{route}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{date} · {passengers} passengers</p>
                </div>
                <p style={{ fontWeight: 700, color: "#00C896" }}>+৳{earned}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Vehicle & Documents Tab ─────────────────────────────────── */}
      {activeTab === "vehicle" && (
        <div>
          <div className="p-5 rounded-2xl mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,200,150,0.1)" }}>
                <Car size={26} style={{ color: "#00C896" }} />
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>{DRIVER_DATA.vehicle.model}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{DRIVER_DATA.vehicle.color} · {DRIVER_DATA.vehicle.plate}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>
                  <CheckCircle size={10} /> Verified
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Driving License", status: "verified", expires: "Dec 2028" },
              { label: "National ID (NID)", status: "verified", expires: "Lifetime" },
              { label: "Vehicle Registration", status: "verified", expires: "Jan 2027" },
              { label: "Insurance Certificate", status: "verified", expires: "Mar 2027" },
            ].map(({ label, status: s, expires }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,150,0.1)" }}>
                    <Upload size={14} style={{ color: "#00C896" }} />
                  </div>
                  <div>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Expires: {expires}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs" style={{ color: "#00C896" }}>
                  <CheckCircle size={12} /> Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPostTrip && <PostTripForm onClose={() => setShowPostTrip(false)} />}
    </div>
  );
}
