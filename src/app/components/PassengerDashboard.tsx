// PassengerDashboard — tab-based view for a logged-in passenger.
// Tabs: overview · bookings · wallet · notifications
// Internal implementation — wallet balance pulled from /api/wallet in production.

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Car, Clock, Star, Wallet, MapPin, CheckCircle, X, AlertCircle,
  Plus, ArrowRight, Shield, Gift, Ticket, Download, Bell, Search, ChevronRight
} from "lucide-react";
import { mockBookings, mockTrips } from "./mockData";

// Reusable stat tile — takes an accent colour so each metric has a distinct visual identity
function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: string; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{label}</span>
      </div>
      <p className="text-white" style={{ fontWeight: 800, fontSize: 24 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sub}</p>}
    </motion.div>
  );
}

// Drives the colour and icon for each booking status badge
const STATUS_STYLES = {
  upcoming: { bg: "rgba(0,200,150,0.1)", color: "#00C896", label: "Upcoming", icon: Clock },
  completed: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", label: "Completed", icon: CheckCircle },
  cancelled: { bg: "rgba(213,24,61,0.1)", color: "#D4183D", label: "Cancelled", icon: X },
};

// For details: Shahriyar Sumon (LinkedIn: linkedin.com/in/shahriyarsumon)
export default function PassengerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "wallet" | "notifications">("overview");
  const [walletBalance] = useState(1240);
  const TABS = ["overview", "bookings", "wallet", "notifications"] as const;

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ color: "white" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>My Dashboard</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Welcome back, Rahim!</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}
        >
          <Search size={15} /> Find Rides
        </motion.button>
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

      {/* ─── Overview Tab ────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Car} label="Total Trips" value="23" color="#00C896" sub="4 this month" />
            <StatCard icon={Star} label="Avg Rating" value="4.8" color="#FFB800" sub="as passenger" />
            <StatCard icon={Wallet} label="Wallet" value={`৳${walletBalance}`} color="#7B61FF" sub="available balance" />
            <StatCard icon={Gift} label="Referrals" value="7" color="#FF6B2B" sub="৳700 earned" />
          </div>

          {/* Upcoming booking — prominently styled with the brand green border */}
          {mockBookings.filter(b => b.status === "upcoming").length > 0 && (
            <div className="mb-6">
              <h3 className="text-white mb-3" style={{ fontWeight: 700 }}>Next Trip</h3>
              {mockBookings.filter(b => b.status === "upcoming").map(booking => (
                <div key={booking.id} className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,200,150,0.03))", border: "1px solid rgba(0,200,150,0.2)" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={booking.driverPhoto} className="w-12 h-12 rounded-xl" alt={booking.driverName} />
                      <div>
                        <p className="text-white text-sm" style={{ fontWeight: 700 }}>{booking.driverName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Shield size={11} style={{ color: "#00C896" }} />
                          <span style={{ fontSize: 11, color: "#00C896" }}>Verified Driver</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(0,200,150,0.15)", color: "#00C896", fontWeight: 600 }}>
                      Jul 26
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: "#00C896" }} />
                      <span className="text-white text-sm" style={{ fontWeight: 600 }}>{booking.from}</span>
                    </div>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B2B" }} />
                      <span className="text-white text-sm" style={{ fontWeight: 600 }}>{booking.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>৳{booking.price} · {booking.paymentMethod}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>View QR</button>
                      <button className="px-4 py-2 rounded-lg text-xs" style={{ background: "rgba(213,24,61,0.1)", color: "#D4183D" }}>Cancel</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent bookings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white" style={{ fontWeight: 700 }}>Recent Trips</h3>
              <button onClick={() => setActiveTab("bookings")} style={{ fontSize: 13, color: "#00C896" }}>View all</button>
            </div>
            <div className="space-y-3">
              {mockBookings.slice(0, 3).map(booking => {
                const s = STATUS_STYLES[booking.status];
                const SIcon = s.icon;
                return (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <img src={booking.driverPhoto} className="w-10 h-10 rounded-xl flex-shrink-0" alt={booking.driverName} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>{booking.from} → {booking.to}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{booking.date} · {booking.driverName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>৳{booking.price}</p>
                      <span className="flex items-center gap-1 justify-end mt-1" style={{ fontSize: 11, color: s.color }}>
                        <SIcon size={10} /> {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h3 className="text-white mb-3" style={{ fontWeight: 700 }}>Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Gift, label: "Refer & Earn", desc: "৳100/referral", color: "#FF6B2B", onClick: () => {} },
                { icon: Ticket, label: "Promo Codes", desc: "Add coupon", color: "#7B61FF", onClick: () => {} },
                { icon: Download, label: "Invoices", desc: "Download PDF", color: "#00C896", onClick: () => {} },
                { icon: AlertCircle, label: "Support", desc: "Get help", color: "#FFB800", onClick: () => {} },
              ].map(({ icon: Icon, label, desc, color, onClick }) => (
                <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}
                  className="p-4 rounded-2xl text-left"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>All Bookings</h3>
          <div className="space-y-3">
            {mockBookings.map(booking => {
              const s = STATUS_STYLES[booking.status];
              const SIcon = s.icon;
              return (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start gap-4">
                    <img src={booking.driverPhoto} className="w-12 h-12 rounded-xl flex-shrink-0" alt={booking.driverName} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-white" style={{ fontWeight: 700 }}>{booking.from} → {booking.to}</p>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{booking.date} · {booking.driverName} · {booking.seats} seat{booking.seats > 1 ? "s" : ""}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-white" style={{ fontWeight: 700, fontSize: 18 }}>৳{booking.price}</p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{booking.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: s.bg, color: s.color }}>
                          <SIcon size={10} /> {s.label}
                        </span>
                        <div className="flex gap-2">
                          {booking.status === "upcoming" && (
                            <>
                              <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>QR Code</button>
                              <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(213,24,61,0.1)", color: "#D4183D" }}>Cancel</button>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <>
                              <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Rate Driver</button>
                              <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Invoice</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Wallet Tab ──────────────────────────────────────────────── */}
      {activeTab === "wallet" && (
        <div>
          <div className="p-6 rounded-2xl mb-5" style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.15), rgba(123,97,255,0.1))", border: "1px solid rgba(0,200,150,0.2)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Available Balance</p>
            <p style={{ fontWeight: 900, fontSize: 40, color: "white" }}>৳{walletBalance}</p>
            <div className="flex gap-3 mt-5">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: "rgba(0,200,150,0.15)", color: "#00C896", fontWeight: 600, border: "1px solid rgba(0,200,150,0.25)" }}>
                <Plus size={15} /> Add Money
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                Withdraw
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Spent", value: "৳8,420", icon: Car, color: "#FF6B2B" },
              { label: "Cashback", value: "৳340", icon: Gift, color: "#00C896" },
              { label: "Refunds", value: "৳150", icon: CheckCircle, color: "#7B61FF" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Icon size={18} style={{ color, margin: "0 auto 8px" }} />
                <p className="text-white" style={{ fontWeight: 700 }}>{value}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>

          <h3 className="text-white mb-3" style={{ fontWeight: 700 }}>Transaction History</h3>
          <div className="space-y-2">
            {[
              { label: "Ride: Dhaka → Chittagong", date: "Jul 26, 2026", amount: "-৳350", type: "debit" },
              { label: "Referral Bonus", date: "Jul 20, 2026", amount: "+৳100", type: "credit" },
              { label: "Ride: Dhaka → Sylhet", date: "Jul 10, 2026", amount: "-৳560", type: "debit" },
              { label: "Promo Code: DHAKARIDE", date: "Jul 5, 2026", amount: "+৳50", type: "credit" },
              { label: "Top-up via bKash", date: "Jun 30, 2026", amount: "+৳1,000", type: "credit" },
            ].map(({ label, date, amount, type }, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{date}</p>
                </div>
                <p style={{ fontWeight: 700, color: type === "credit" ? "#00C896" : "rgba(255,255,255,0.7)" }}>{amount}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Notifications Tab ─────────────────────────────────────────
           Unread items use a green left border; read ones are visually muted. */}
      {activeTab === "notifications" && (
        <div className="space-y-3">
          {[
            { title: "Booking Confirmed", msg: "Your ride Dhaka → Chittagong on Jul 26 is confirmed.", time: "2h ago", read: false, icon: CheckCircle, color: "#00C896" },
            { title: "Trip Reminder", msg: "Your ride tomorrow departs at 7:00 AM. Be ready 15 mins early.", time: "5h ago", read: false, icon: Clock, color: "#7B61FF" },
            { title: "Promo: 20% off this weekend", msg: "Use code WEEKEND20 for rides this Fri-Sun.", time: "1d ago", read: true, icon: Gift, color: "#FF6B2B" },
            { title: "Rating Received", msg: "Rafiqul rated you 5 stars as a passenger. Great job!", time: "3d ago", read: true, icon: Star, color: "#FFB800" },
          ].map(({ title, msg, time, read, icon: Icon, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
              style={{ background: read ? "rgba(255,255,255,0.03)" : "rgba(0,200,150,0.05)", border: read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,200,150,0.15)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white text-sm" style={{ fontWeight: read ? 500 : 700 }}>{title}</p>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{time}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.5 }}>{msg}</p>
              </div>
              {!read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#00C896" }} />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
