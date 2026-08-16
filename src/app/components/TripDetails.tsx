// TripDetails — full single-trip view with driver profile, map, reviews, and booking flow.
// BookingModal is embedded here to avoid a separate route for a lightweight interaction.

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, Users, Star, Shield, Zap, ArrowRight, Phone, MessageSquare,
  Share2, Bookmark, Flag, X, CheckCircle, Car, Bike, Bus, AlertCircle,
  Calendar, Navigation, Wind, Music, Package, Heart, ChevronLeft
} from "lucide-react";
import { mockTrips, mockReviews } from "./mockData";

// Small visual component for the per-category rating breakdown (safety, cleanliness, etc.)
function StarRating({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < Math.round(value) ? "#00C896" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <span style={{ fontSize: 13, color: "white", fontWeight: 600, width: 28 }}>{value}</span>
      </div>
    </div>
  );
}

/* BookingModal — three-step flow: seat selection → payment method → QR confirmation.
   Custom business logic: a ৳20 service fee is added on top of the seat price. */
function BookingModal({ trip, onClose, onConfirm }: { trip: any; onClose: () => void; onConfirm: () => void }) {
  const [seats, setSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [step, setStep] = useState<"details" | "payment" | "confirmed">("details");
  // Supported payment gateways — order reflects market share in Bangladesh
  const PAYMENTS = ["bKash", "Nagad", "Rocket", "SSLCommerz", "Wallet"];

  // Confirmed state: show QR code so the passenger can check in at pickup point
  if (step === "confirmed") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm p-8 rounded-3xl text-center"
          style={{ background: "#0D1528", border: "1px solid rgba(0,200,150,0.3)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(0,200,150,0.15)" }}>
            <CheckCircle size={40} style={{ color: "#00C896" }} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: 800 }}>Booking Confirmed!</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Your ride has been booked. Show the QR code at pickup.</p>
          <div className="p-4 rounded-xl mb-6 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-24 h-24 mx-auto mb-3 rounded-lg" style={{ background: "white" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => (
                  Math.random() > 0.4 && <rect key={`${r}-${c}`} x={c * 12 + 2} y={r * 12 + 2} width={10} height={10} fill="#000" />
                )))}
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", fontFamily: "monospace" }}>PD-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}>
            View My Booking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden"
        style={{ background: "#0D1528", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <h3 className="text-white" style={{ fontWeight: 700 }}>{step === "details" ? "Book Your Seat" : "Payment"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><X size={18} /></button>
        </div>

        {step === "details" ? (
          <div className="p-5">
            <div className="flex items-center gap-4 p-4 rounded-xl mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <img src={trip.driver.photo} className="w-12 h-12 rounded-xl" alt={trip.driver.name} />
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>{trip.driver.name}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{trip.from} → {trip.to} · {trip.date}</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm mb-2 block" style={{ color: "rgba(255,255,255,0.6)" }}>Number of seats</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => setSeats(n)} disabled={n > trip.seatsAvailable}
                    className="w-10 h-10 rounded-xl text-sm transition-all"
                    style={{ background: seats === n ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.06)", color: seats === n ? "#00C896" : n > trip.seatsAvailable ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", border: seats === n ? "1px solid rgba(0,200,150,0.3)" : "1px solid transparent", fontWeight: 700, cursor: n > trip.seatsAvailable ? "not-allowed" : "pointer" }}>
                    {n}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>{trip.seatsAvailable} available</span>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-5" style={{ background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.12)" }}>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>৳{trip.pricePerSeat} × {seats} seat{seats > 1 ? "s" : ""}</span>
                <span className="text-white">৳{trip.pricePerSeat * seats}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Service fee</span>
                <span className="text-white">৳20</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <span style={{ fontWeight: 700, color: "white" }}>Total</span>
                <span style={{ fontWeight: 700, color: "#00C896", fontSize: 18 }}>৳{trip.pricePerSeat * seats + 20}</span>
              </div>
            </div>

            <button onClick={() => setStep("payment")} className="w-full py-3.5 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}>
              Continue to Payment
            </button>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Choose payment method</p>
            <div className="space-y-2 mb-5">
              {PAYMENTS.map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)} className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all"
                  style={{ background: paymentMethod === method ? "rgba(0,200,150,0.08)" : "rgba(255,255,255,0.04)", border: paymentMethod === method ? "1px solid rgba(0,200,150,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, color: paymentMethod === method ? "#00C896" : "rgba(255,255,255,0.7)", fontWeight: 600 }}>{method}</span>
                  {paymentMethod === method && <CheckCircle size={16} style={{ color: "#00C896" }} />}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Total payable</span>
              <span style={{ color: "#00C896", fontWeight: 800, fontSize: 20 }}>৳{trip.pricePerSeat * seats + 20}</span>
            </div>
            <button onClick={() => setStep("confirmed")} className="w-full py-3.5 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}>
              Pay ৳{trip.pricePerSeat * seats + 20} via {paymentMethod}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// For details: Shahriyar Sumon (LinkedIn: linkedin.com/in/shahriyarsumon)
export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fall back to first trip if the ID doesn't match — prevents a blank page in demo mode
  const trip = mockTrips.find(t => t.id === id) || mockTrips[0];
  const VehicleIcon = { car: Car, bike: Bike, microbus: Bus }[trip.vehicleType];

  return (
    <div style={{ color: "white", paddingTop: 72, minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
          <ChevronLeft size={16} /> Back to search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Trip header card */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Calendar size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{trip.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSaved(!saved)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: saved ? "#FF4E88" : "rgba(255,255,255,0.4)" }}>
                    <Bookmark size={18} fill={saved ? "#FF4E88" : "none"} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><Share2 size={18} /></button>
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><Flag size={18} /></button>
                </div>
              </div>

              {/* Route visualization */}
              <div className="flex items-center gap-4 mb-5">
                <div>
                  <p className="text-white" style={{ fontWeight: 800, fontSize: 24 }}>{trip.from}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{trip.departureTime}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-center w-full">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#00C896" }} />
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #00C896, rgba(255,255,255,0.1))" }} />
                    {trip.stops.map(stop => (
                      <div key={stop} className="flex flex-col items-center mx-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                      </div>
                    ))}
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), #FF6B2B)" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{trip.duration} · {trip.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-white" style={{ fontWeight: 800, fontSize: 24 }}>{trip.to}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{trip.arrivalTime}</p>
                </div>
              </div>

              {/* Stops */}
              {trip.stops.length > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Navigation size={13} style={{ color: "#00C896" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Stops: {trip.stops.join(", ")}</span>
                </div>
              )}

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: VehicleIcon, label: "Vehicle", value: trip.driver.vehicle.model },
                  { icon: Users, label: "Seats left", value: `${trip.seatsAvailable} of ${trip.totalSeats}` },
                  { icon: Zap, label: "Booking", value: trip.instantBooking ? "Instant" : "Manual" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Icon size={18} style={{ color: "#00C896", margin: "0 auto 6px" }} />
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{value}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities — greyed-out with strikethrough when the option is not offered */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Trip Preferences</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "ac", icon: Wind, label: "Air Conditioning" },
                  { key: "music", icon: Music, label: "Music" },
                  { key: "luggage", icon: Package, label: "Luggage Allowed" },
                  { key: "smoking", icon: AlertCircle, label: "Smoking" },
                  { key: "pets", icon: Heart, label: "Pets Allowed" },
                  { key: "helmet", icon: Shield, label: "Helmet Provided" },
                  { key: "womenOnly", icon: Users, label: "Women Only" },
                ].map(({ key, icon: Icon, label }) => {
                  const val = trip.amenities[key as keyof typeof trip.amenities];
                  return (
                    <div key={key} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Icon size={15} style={{ color: val ? "#00C896" : "rgba(255,255,255,0.2)" }} />
                      <span style={{ fontSize: 12, color: val ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", textDecoration: val ? "none" : "line-through" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map placeholder — swap this div for a Google Maps embed in production */}
            <div className="p-6 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Route Map</h3>
              <div className="relative rounded-xl overflow-hidden" style={{ height: 200, background: "rgba(0,0,0,0.3)" }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(0,200,150,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,0.3) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Navigation size={32} style={{ color: "#00C896" }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{trip.from} → {trip.to}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Google Maps integration available in production</p>
                </div>
                {/* Route dots */}
                <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#00C896", transform: "translateY(-50%)" }} />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#FF6B2B", transform: "translateY(-50%)" }} />
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5" style={{ background: "rgba(0,200,150,0.4)", top: "50%" }} />
              </div>
            </div>

            {/* Reviews */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontWeight: 700 }}>Passenger Reviews</h3>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="#FFB800" style={{ color: "#FFB800" }} />
                  <span style={{ color: "white", fontWeight: 700 }}>{trip.driver.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>({trip.driver.reviews})</span>
                </div>
              </div>
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-start gap-3">
                      <img src={review.photo} className="w-10 h-10 rounded-full flex-shrink-0" alt={review.reviewer} />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm" style={{ fontWeight: 600 }}>{review.reviewer}</p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{review.date}</p>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "#FFB800" : "transparent"} style={{ color: i < review.rating ? "#FFB800" : "rgba(255,255,255,0.2)" }} />)}
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Driver + Booking */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-center mb-5">
                <p style={{ color: "#00C896", fontWeight: 900, fontSize: 36 }}>৳{trip.pricePerSeat}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>per seat · {trip.seatsAvailable} left</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBooking(true)}
                className="w-full py-3.5 rounded-xl text-white mb-3"
                style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
              >
                Book Now
              </motion.button>
              {trip.instantBooking && (
                <div className="flex items-center justify-center gap-1.5 text-sm" style={{ color: "#7B61FF" }}>
                  <Zap size={13} />
                  <span>Instant confirmation</span>
                </div>
              )}
            </div>

            {/* Driver card */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img src={trip.driver.photo} className="w-14 h-14 rounded-2xl" alt={trip.driver.name} />
                  {trip.driver.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#00C896" }}>
                      <Shield size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 700 }}>{trip.driver.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#FFB800" style={{ color: "#FFB800" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#FFB800" }}>{trip.driver.rating}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>· {trip.driver.totalTrips} trips</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 16 }}>{trip.driver.bio}</p>

              {/* Rating breakdown */}
              <div className="mb-4">
                {Object.entries(trip.driver.ratings).map(([key, val]) => (
                  <StarRating key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
                ))}
              </div>

              {/* Driver badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {trip.driver.badges.map(badge => (
                  <span key={badge} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896", border: "1px solid rgba(0,200,150,0.2)" }}>
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
                  <MessageSquare size={14} /> Chat
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
                  <Phone size={14} /> Call
                </button>
              </div>
            </div>

            {/* Safety note */}
            <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.15)" }}>
              <Shield size={16} style={{ color: "#00C896", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                This driver is NID verified with a clean safety record. Your trip is monitored by Pother Dake safety systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal trip={trip} onClose={() => setShowBooking(false)} onConfirm={() => setShowBooking(false)} />}
    </div>
  );
}
