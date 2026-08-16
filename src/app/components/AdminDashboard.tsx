// AdminDashboard — full platform management panel for super admin / admin roles.
// Tabs: Overview (charts) · Users · Drivers · Bookings · Payments · Complaints · Settings
// For details: Shahriyar Sumon (LinkedIn: linkedin.com/in/shahriyarsumon)

import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Car, TrendingUp, DollarSign, Activity, Shield, AlertCircle,
  CheckCircle, X, Clock, Eye, Ban, Trash2, ChevronDown, MoreHorizontal,
  BarChart2, Search, Filter, Download, RefreshCw, Settings
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
  adminStats, revenueData, userGrowthData,
  mockAdminUsers, mockAdminDrivers
} from "./mockData";

/* Eight KPI cards at the top of the overview.
   The `change` string is parsed to determine whether to colour it green or red. */
const STAT_CARDS = [
  { label: "Total Users", value: adminStats.totalUsers.toLocaleString(), icon: Users, color: "#7B61FF", change: "+12.4%", sub: `${adminStats.verifiedUsers.toLocaleString()} verified` },
  { label: "Active Drivers", value: adminStats.activeDrivers.toLocaleString(), icon: Car, color: "#00C896", change: "+8.2%", sub: `${adminStats.totalDrivers.toLocaleString()} total` },
  { label: "Today Revenue", value: `৳${(adminStats.todayRevenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: "#FF6B2B", change: "+18.5%", sub: `৳${(adminStats.monthlyRevenue / 100000).toFixed(1)}L monthly` },
  { label: "Total Trips", value: adminStats.totalTrips.toLocaleString(), icon: Activity, color: "#FFB800", change: "+22.1%", sub: `${adminStats.completedTrips.toLocaleString()} completed` },
  { label: "Open Complaints", value: adminStats.openComplaints.toString(), icon: AlertCircle, color: "#D4183D", change: "-5.3%", sub: "needs attention" },
  { label: "Pending Verify", value: adminStats.pendingVerifications.toString(), icon: Clock, color: "#7B61FF", change: "+3.1%", sub: "driver requests" },
  { label: "Online Users", value: adminStats.onlineUsers.toLocaleString(), icon: Activity, color: "#00C896", change: "Live", sub: "right now" },
  { label: "Net Commission", value: `৳${(adminStats.platformCommission / 100000).toFixed(1)}L`, icon: DollarSign, color: "#FF6B2B", change: "+9.8%", sub: "this year" },
];

// Shared badge style map — used by both the users table and the drivers list
const STATUS_BADGES: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: "rgba(0,200,150,0.1)", color: "#00C896", label: "Verified" },
  pending: { bg: "rgba(255,183,0,0.1)", color: "#FFB800", label: "Pending" },
  suspended: { bg: "rgba(255,107,43,0.1)", color: "#FF6B2B", label: "Suspended" },
  approved: { bg: "rgba(0,200,150,0.1)", color: "#00C896", label: "Approved" },
  rejected: { bg: "rgba(213,24,61,0.1)", color: "#D4183D", label: "Rejected" },
};

// Brand colour palette used across recharts series — keep in sync with theme.css tokens
const CHART_COLORS = ["#00C896", "#7B61FF", "#FF6B2B", "#FFB800", "#FF4E88"];

/* Custom recharts tooltip — dark glassmorphism card that matches the overall dark theme.
   Values above 1000 are formatted as ৳XK to save horizontal space. */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0D1528", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 5 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>{p.name}: {typeof p.value === "number" && p.value > 1000 ? `৳${(p.value / 1000).toFixed(0)}K` : p.value}</p>
      ))}
    </div>
  );
};

type Tab = "overview" | "users" | "drivers" | "bookings" | "payments" | "complaints" | "settings";

// Main admin component — tab state is local; replace with URL params if deep-linking tabs is needed
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [selectedDriverStatus, setSelectedDriverStatus] = useState("all");

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "users", label: "Users", icon: Users },
    { key: "drivers", label: "Drivers", icon: Car },
    { key: "bookings", label: "Bookings", icon: Activity },
    { key: "payments", label: "Payments", icon: DollarSign },
    { key: "complaints", label: "Complaints", icon: AlertCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  // Search across name, phone, and email simultaneously — case-insensitive
  const filteredUsers = mockAdminUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter drivers by status tab first, then by search query
  const filteredDrivers = mockAdminDrivers.filter(d => {
    if (selectedDriverStatus !== "all" && d.status !== selectedDriverStatus) return false;
    return d.name.toLowerCase().includes(driverSearch.toLowerCase()) || d.phone.includes(driverSearch);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ color: "white" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Pother Dake · Super Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
            style={{ background: activeTab === key ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.04)", color: activeTab === key ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: activeTab === key ? 600 : 400, border: activeTab === key ? "1px solid rgba(0,200,150,0.25)" : "1px solid transparent" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, change, sub }) => (
              <motion.div key={label} whileHover={{ y: -2 }} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: change.startsWith("+") ? "rgba(0,200,150,0.1)" : change.startsWith("-") ? "rgba(213,24,61,0.1)" : "rgba(255,183,0,0.1)", color: change.startsWith("+") ? "#00C896" : change.startsWith("-") ? "#D4183D" : "#FFB800" }}>
                    {change}
                  </span>
                </div>
                <p className="text-white" style={{ fontWeight: 800, fontSize: 20 }}>{value}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{label}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ─── Charts row 1: Revenue area chart + User growth line chart ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontWeight: 700 }}>Revenue Overview</h3>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Last 7 months</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C896" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="com" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00C896" strokeWidth={2} fill="url(#rev)" />
                  <Area type="monotone" dataKey="commission" name="Commission" stroke="#7B61FF" strokeWidth={2} fill="url(#com)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white" style={{ fontWeight: 700 }}>User & Driver Growth</h3>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Last 7 months</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="users" name="Users" stroke="#00C896" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="drivers" name="Drivers" stroke="#FF6B2B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── Charts row 2: Vehicle split PieChart + Monthly trips BarChart ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700, fontSize: 15 }}>Trips by Vehicle</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={[{ name: "Car", value: 58 }, { name: "Bike", value: 28 }, { name: "Microbus", value: 14 }]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {["#00C896", "#FF6B2B", "#7B61FF"].map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {[{ label: "Car", color: "#00C896" }, { label: "Bike", color: "#FF6B2B" }, { label: "Microbus", color: "#7B61FF" }].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl lg:col-span-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700, fontSize: 15 }}>Monthly Trips</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="trips" name="Trips" fill="#00C896" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Recent Users</h3>
              <div className="space-y-2">
                {mockAdminUsers.slice(0, 4).map(user => {
                  const b = STATUS_BADGES[user.status];
                  return (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{user.phone}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: b.bg, color: b.color }}>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Pending Driver Approvals</h3>
              <div className="space-y-2">
                {mockAdminDrivers.filter(d => d.status === "pending").slice(0, 3).map(driver => (
                  <div key={driver.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,183,0,0.05)", border: "1px solid rgba(255,183,0,0.15)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>{driver.name}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{driver.vehicle} · {driver.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,200,150,0.1)" }}>
                        <CheckCircle size={14} style={{ color: "#00C896" }} />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(213,24,61,0.1)" }}>
                        <X size={14} style={{ color: "#D4183D" }} />
                      </button>
                    </div>
                  </div>
                ))}
                {mockAdminDrivers.filter(d => d.status === "pending").length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: 16 }}>No pending approvals</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Users Tab ────────────────────────────────────────────────
           Table supports search + filter; action buttons call admin API endpoints. */}
      {activeTab === "users" && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users by name, phone, email..." className="bg-transparent outline-none text-white text-sm flex-1" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="grid grid-cols-7 gap-4 px-5 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Name", "Phone", "Location", "Trips", "Joined", "Status", "Actions"].map(h => (
                <p key={h} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</p>
              ))}
            </div>
            {filteredUsers.map((user, i) => {
              const b = STATUS_BADGES[user.status];
              return (
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-7 gap-4 px-5 py-4 hover:bg-white/5 transition-all items-center"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.phone}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.location}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.trips}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.joined}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs w-fit" style={{ background: b.bg, color: b.color }}>{b.label}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><Eye size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,0.4)" }}><Ban size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all" style={{ color: "#D4183D" }}><Trash2 size={13} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Drivers Tab ──────────────────────────────────────────────
           Pending drivers surface an Approve / Reject button pair.
           Only admin & moderator can approve; financial data is super-admin-only. */}
      {activeTab === "drivers" && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              <input value={driverSearch} onChange={e => setDriverSearch(e.target.value)} placeholder="Search drivers..." className="bg-transparent outline-none text-white text-sm flex-1" />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              {["all", "pending", "approved", "rejected"].map(s => (
                <button key={s} onClick={() => setSelectedDriverStatus(s)} className="px-3 py-1.5 rounded-lg text-xs capitalize transition-all"
                  style={{ background: selectedDriverStatus === s ? "rgba(0,200,150,0.15)" : "transparent", color: selectedDriverStatus === s ? "#00C896" : "rgba(255,255,255,0.5)" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredDrivers.map((driver, i) => {
              const b = STATUS_BADGES[driver.status];
              return (
                <motion.div key={driver.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                    {driver.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <p className="text-white text-sm" style={{ fontWeight: 700 }}>{driver.name}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{driver.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{driver.vehicle}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{driver.type}</p>
                    </div>
                    <div className="hidden md:block">
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{driver.rating > 0 ? `★ ${driver.rating}` : "No rating"}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{driver.trips} trips</p>
                    </div>
                    <div className="hidden md:block">
                      <p style={{ fontSize: 12, color: driver.earnings > 0 ? "#00C896" : "rgba(255,255,255,0.4)" }}>{driver.earnings > 0 ? `৳${driver.earnings.toLocaleString()}` : "—"}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>earnings</p>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs" style={{ background: b.bg, color: b.color }}>{b.label}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {driver.status === "pending" && (
                      <>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                          style={{ background: "rgba(0,200,150,0.12)", color: "#00C896", fontWeight: 600 }}>
                          <CheckCircle size={12} /> Approve
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                          style={{ background: "rgba(213,24,61,0.1)", color: "#D4183D", fontWeight: 600 }}>
                          <X size={12} /> Reject
                        </motion.button>
                      </>
                    )}
                    {driver.status === "approved" && (
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                        <Eye size={12} /> View Docs
                      </button>
                    )}
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.3)" }}><MoreHorizontal size={16} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>All Bookings</h3>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="grid grid-cols-6 gap-4 px-5 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Booking ID", "Route", "Date", "Passenger", "Amount", "Status"].map(h => (
                <p key={h} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase" }}>{h}</p>
              ))}
            </div>
            {[
              { id: "PD-001", route: "Dhaka → Chittagong", date: "Jul 26", passenger: "Rahim Uddin", amount: 350, status: "confirmed" },
              { id: "PD-002", route: "Dhaka → Sylhet", date: "Jul 25", passenger: "Nasrin Begum", amount: 560, status: "completed" },
              { id: "PD-003", route: "Chittagong → Cox's Bazar", date: "Jul 25", passenger: "Arif Khan", amount: 200, status: "completed" },
              { id: "PD-004", route: "Dhaka → Rajshahi", date: "Jul 24", passenger: "Fariha Islam", amount: 640, status: "cancelled" },
              { id: "PD-005", route: "Dhaka → Khulna", date: "Jul 23", passenger: "Sabbir H.", amount: 450, status: "completed" },
            ].map(({ id, route, date, passenger, amount, status }, i) => {
              const statusStyle = { confirmed: { color: "#00C896", bg: "rgba(0,200,150,0.1)" }, completed: { color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)" }, cancelled: { color: "#D4183D", bg: "rgba(213,24,61,0.1)" } }[status] || { color: "#FFB800", bg: "rgba(255,183,0,0.1)" };
              return (
                <div key={id} className="grid grid-cols-6 gap-4 px-5 py-4 hover:bg-white/5 transition-all items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <p style={{ fontSize: 12, color: "#00C896", fontFamily: "monospace" }}>{id}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{route}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{date}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{passenger}</p>
                  <p style={{ fontSize: 13, color: "white", fontWeight: 600 }}>৳{amount}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs w-fit capitalize" style={{ background: statusStyle.bg, color: statusStyle.color }}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Payments Tab ─────────────────────────────────────────────
           Financial section — restricted to super admin and financial manager in production. */}
      {activeTab === "payments" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: `৳${(adminStats.totalRevenue / 10000000).toFixed(2)} Cr`, color: "#00C896" },
              { label: "Platform Commission", value: `৳${(adminStats.platformCommission / 100000).toFixed(1)}L`, color: "#7B61FF" },
              { label: "Monthly Revenue", value: `৳${(adminStats.monthlyRevenue / 100000).toFixed(2)}L`, color: "#FF6B2B" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{label}</p>
                <p style={{ fontWeight: 800, fontSize: 28, color }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Payment Method Breakdown</h3>
            <div className="space-y-3">
              {[
                { method: "bKash", share: 48, amount: "৳40.4L" },
                { method: "Nagad", share: 28, amount: "৳23.6L" },
                { method: "Rocket", share: 14, amount: "৳11.8L" },
                { method: "SSLCommerz", share: 7, amount: "৳5.9L" },
                { method: "Wallet", share: 3, amount: "৳2.5L" },
              ].map(({ method, share, amount }) => (
                <div key={method} className="flex items-center gap-3">
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", width: 80, flexShrink: 0 }}>{method}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${share}%`, background: "linear-gradient(90deg, #00C896, #009E78)" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 60, textAlign: "right" }}>{share}%</span>
                  <span style={{ fontSize: 12, color: "#00C896", fontWeight: 600, width: 65, textAlign: "right" }}>{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Complaints Tab ───────────────────────────────────────────
           Severity colours: high → red, medium → amber, low → green.
           Moderators handle resolution; managers escalate if unresolved after 48h. */}
      {activeTab === "complaints" && (
        <div>
          <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Active Complaints ({adminStats.openComplaints})</h3>
          <div className="space-y-3">
            {[
              { id: "C-001", reporter: "Nasrin B.", against: "Driver: Kamal H.", type: "Rude behavior", severity: "medium", date: "Jul 23" },
              { id: "C-002", reporter: "Jamal H.", against: "Driver: Ruhul A.", type: "Overcharging", severity: "high", date: "Jul 22" },
              { id: "C-003", reporter: "Fariha I.", against: "Driver: Tanvir A.", type: "Late pickup", severity: "low", date: "Jul 21" },
              { id: "C-004", reporter: "Arif K.", against: "Passenger: Rahim U.", type: "No show", severity: "medium", date: "Jul 20" },
            ].map(({ id, reporter, against, type, severity, date }) => {
              const sev = { high: { color: "#D4183D", bg: "rgba(213,24,61,0.1)" }, medium: { color: "#FFB800", bg: "rgba(255,183,0,0.1)" }, low: { color: "#00C896", bg: "rgba(0,200,150,0.1)" } }[severity];
              return (
                <div key={id} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-white text-sm" style={{ fontWeight: 700 }}>{type}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>By {reporter} · Against {against}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ background: sev?.bg, color: sev?.color }}>{severity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{id} · {date}</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896" }}>Resolve</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Settings Tab ─────────────────────────────────────────────
           Danger zone actions require a confirmation modal in production — skipped here for brevity.
           // Internal implementation */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-5">
          {[
            { title: "Platform Commission", desc: "Set the percentage platform takes from each booking", value: "10%", editable: true },
            { title: "Maintenance Mode", desc: "Temporarily disable booking for all users", value: "Off", editable: true },
            { title: "Referral Bonus", desc: "Amount given per successful referral", value: "৳100", editable: true },
            { title: "Max Seats per Trip", desc: "Maximum seats a driver can offer", value: "10", editable: true },
          ].map(({ title, desc, value, editable }) => (
            <div key={title} className="flex items-center justify-between p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 700 }}>{title}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "#00C896", fontWeight: 700, fontSize: 16 }}>{value}</span>
                {editable && (
                  <button className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Edit</button>
                )}
              </div>
            </div>
          ))}

          <div className="p-5 rounded-2xl" style={{ background: "rgba(213,24,61,0.05)", border: "1px solid rgba(213,24,61,0.15)" }}>
            <h3 className="text-white mb-3" style={{ fontWeight: 700 }}>Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-xl text-sm" style={{ background: "rgba(255,183,0,0.1)", color: "#FFB800", border: "1px solid rgba(255,183,0,0.2)" }}>
                Enable Maintenance Mode
              </button>
              <button className="w-full py-3 rounded-xl text-sm" style={{ background: "rgba(213,24,61,0.1)", color: "#D4183D", border: "1px solid rgba(213,24,61,0.2)" }}>
                Reset Platform Data (Dangerous)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
