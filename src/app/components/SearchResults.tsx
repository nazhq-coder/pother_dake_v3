// SearchResults — lists available rides matching the user's search query.
// Filters are kept in local state; in production they'd be query params for shareability.

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { MapPin, Clock, Users, Filter, Star, ArrowRight, Shield, Zap, Car, Bike, Bus, ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import { mockTrips, bangladeshCities, Trip } from "./mockData";

// Map vehicle type string to the matching Lucide icon component
const VEHICLE_ICONS = { car: Car, bike: Bike, microbus: Bus };

/* TripCard — individual ride listing.
   Seats-left colour shifts to orange when only 1 seat remains — intentional urgency cue. */
function TripCard({ trip, onClick }: { trip: Trip; onClick: () => void }) {
  const Icon = VEHICLE_ICONS[trip.vehicleType];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="p-5 rounded-2xl cursor-pointer group transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-start gap-4">
        {/* Driver */}
        <div className="flex-shrink-0 relative">
          <img src={trip.driver.photo} className="w-14 h-14 rounded-2xl object-cover" alt={trip.driver.name} />
          {trip.driver.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#00C896" }}>
              <Shield size={10} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 700 }}>{trip.driver.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} fill="#FFB800" style={{ color: "#FFB800" }} />
                <span style={{ fontSize: 12, color: "#FFB800", fontWeight: 600 }}>{trip.driver.rating}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>({trip.driver.reviews})</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>· {trip.driver.totalTrips} trips</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p style={{ color: "#00C896", fontWeight: 800, fontSize: 22 }}>৳{trip.pricePerSeat}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>per seat</p>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00C896" }} />
              <span className="text-white text-sm" style={{ fontWeight: 600 }}>{trip.from}</span>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              {trip.stops.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                  +{trip.stops.length} stop
                </span>
              )}
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
              <span className="text-white text-sm" style={{ fontWeight: 600 }}>{trip.to}</span>
            </div>
          </div>

          {/* Details row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{trip.departureTime}</span>
              <ArrowRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{trip.arrivalTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, color: trip.seatsAvailable <= 1 ? "#FF6B2B" : "rgba(255,255,255,0.5)" }}>
                {trip.seatsAvailable} seat{trip.seatsAvailable !== 1 ? "s" : ""} left
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{trip.vehicleType}</span>
            </div>
          </div>

          {/* Amenity chips + badges */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {trip.amenities.ac && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896", border: "1px solid rgba(0,200,150,0.2)" }}>AC</span>}
              {trip.amenities.luggage && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Luggage</span>}
              {trip.amenities.music && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Music</span>}
              {trip.amenities.womenOnly && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,78,136,0.1)", color: "#FF4E88", border: "1px solid rgba(255,78,136,0.2)" }}>Women Only</span>}
              {trip.amenities.pets && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Pet Friendly</span>}
              {trip.amenities.helmet && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Helmet</span>}
            </div>
            <div className="flex items-center gap-2">
              {trip.instantBooking && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(123,97,255,0.1)", color: "#7B61FF", border: "1px solid rgba(123,97,255,0.2)" }}>
                  <Zap size={10} /> Instant
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="px-4 py-2 rounded-xl text-white text-sm"
                style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
              >
                Book Seat
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main page component — reads initial from/to from URL params set by the landing search form
export default function SearchResults() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({ vehicle: "all", maxPrice: 500, instantOnly: false, womenOnly: false, ac: false });
  const [sortBy, setSortBy] = useState<"time" | "price" | "rating">("time");
  const [showFilters, setShowFilters] = useState(false);
  const [fromCity, setFromCity] = useState(params.get("from") || "");
  const [toCity, setToCity] = useState(params.get("to") || "");

  /* Client-side filter + sort — acceptable for this data size.
     Move to server-side query params if trip count exceeds a few hundred. */
  const filtered = mockTrips
    .filter(t => {
      if (filters.vehicle !== "all" && t.vehicleType !== filters.vehicle) return false;
      if (t.pricePerSeat > filters.maxPrice) return false;
      if (filters.instantOnly && !t.instantBooking) return false;
      if (filters.womenOnly && !t.amenities.womenOnly) return false;
      if (filters.ac && !t.amenities.ac) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.pricePerSeat - b.pricePerSeat;
      if (sortBy === "rating") return b.driver.rating - a.driver.rating;
      return a.departureTime.localeCompare(b.departureTime);
    });

  return (
    <div style={{ color: "white", paddingTop: 72, minHeight: "100vh" }}>
      {/* Search bar */}
      <div className="sticky top-16 z-30 px-4 py-3" style={{ background: "rgba(7,12,24,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <MapPin size={15} style={{ color: "#00C896" }} />
            <input value={fromCity} onChange={e => setFromCity(e.target.value)} placeholder="From" list="from-cities" className="bg-transparent outline-none text-white text-sm w-24" />
            <datalist id="from-cities">{bangladeshCities.map(c => <option key={c} value={c} />)}</datalist>
            <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input value={toCity} onChange={e => setToCity(e.target.value)} placeholder="To" list="to-cities" className="bg-transparent outline-none text-white text-sm w-24" />
            <datalist id="to-cities">{bangladeshCities.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }} onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Sort:</span>
            {(["time", "price", "rating"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className="px-2.5 py-1 rounded-lg text-xs capitalize transition-all" style={{ background: sortBy === s ? "rgba(0,200,150,0.15)" : "transparent", color: sortBy === s ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: sortBy === s ? 600 : 400 }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible filter panel — rendered inline below the sticky bar */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto mt-3 p-4 rounded-xl flex flex-wrap items-center gap-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Vehicle:</span>
              {["all", "bike", "car", "microbus"].map(v => (
                <button key={v} onClick={() => setFilters(f => ({ ...f, vehicle: v }))} className="px-3 py-1 rounded-lg text-xs capitalize" style={{ background: filters.vehicle === v ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.06)", color: filters.vehicle === v ? "#00C896" : "rgba(255,255,255,0.5)", border: filters.vehicle === v ? "1px solid rgba(0,200,150,0.25)" : "1px solid transparent" }}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Max ৳{filters.maxPrice}:</span>
              <input type="range" min={100} max={1000} step={50} value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))} className="w-24 accent-emerald-400" />
            </div>
            {[
              { key: "instantOnly", label: "Instant Booking" },
              { key: "womenOnly", label: "Women Only" },
              { key: "ac", label: "AC" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters[key as keyof typeof filters] as boolean} onChange={e => setFilters(f => ({ ...f, [key]: e.target.checked }))} className="accent-emerald-400" />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white" style={{ fontWeight: 700 }}>
              {fromCity && toCity ? `${fromCity} → ${toCity}` : "All Available Rides"}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{filtered.length} rides found · {params.get("date") || "Jul 26, 2026"}</p>
          </div>
        </div>

        {/* Trip list — empty state shown when no results match the current filters */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 16px" }} />
              <p style={{ color: "rgba(255,255,255,0.3)" }}>No rides found matching your filters.</p>
            </div>
          ) : (
            filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trip/${trip.id}`)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
