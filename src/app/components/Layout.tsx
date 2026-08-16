// Layout — single shell component used by every route.
// Public routes get the top navbar; dashboard routes (passenger/driver/admin)
// get the collapsible sidebar instead.
// Project maintained by Shahriyar Sumon

import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Menu, X, User, Bell, LogOut, Settings, Home,
  Search, Car, LayoutDashboard, Users, CreditCard, Shield,
  ChevronDown, Bike, AlertCircle, MessageSquare, BarChart2
} from "lucide-react";

// Public nav items rendered in the top bar
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Find a Ride", path: "/search" },
  { label: "Post a Ride", path: "/driver/post-trip" },
  { label: "How It Works", path: "/#how-it-works" },
];

const PASSENGER_NAV = [
  { icon: Home, label: "Overview", path: "/passenger" },
  { icon: Search, label: "Find Rides", path: "/search" },
  { icon: Car, label: "My Bookings", path: "/passenger/bookings" },
  { icon: CreditCard, label: "Wallet", path: "/passenger/wallet" },
  { icon: MessageSquare, label: "Messages", path: "/passenger/messages" },
  { icon: User, label: "Profile", path: "/passenger/profile" },
  { icon: Settings, label: "Settings", path: "/passenger/settings" },
];

// Driver sidebar — verification and earnings links included
const DRIVER_NAV = [
  { icon: Home, label: "Overview", path: "/driver" },
  { icon: Car, label: "Post a Trip", path: "/driver/post-trip" },
  { icon: MapPin, label: "My Trips", path: "/driver/trips" },
  { icon: CreditCard, label: "Earnings", path: "/driver/earnings" },
  { icon: MessageSquare, label: "Messages", path: "/driver/messages" },
  { icon: Shield, label: "Verification", path: "/driver/verify" },
  { icon: User, label: "Profile", path: "/driver/profile" },
];

/* Admin sidebar — only visible to admin/manager/moderator roles.
   Financial routes are restricted to super admin in the real backend. */
const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Car, label: "Drivers", path: "/admin/drivers" },
  { icon: Search, label: "Bookings", path: "/admin/bookings" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: AlertCircle, label: "Complaints", path: "/admin/complaints" },
  { icon: BarChart2, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

// Returns true for any authenticated dashboard route — drives which layout shell to render
function isDashboardRoute(pathname: string) {
  return pathname.startsWith("/passenger") || pathname.startsWith("/driver") || pathname.startsWith("/admin");
}

// Picks the correct sidebar nav array and role label based on the current URL segment
function getSidebarNav(pathname: string) {
  if (pathname.startsWith("/admin")) return { nav: ADMIN_NAV, role: "Admin Panel" };
  if (pathname.startsWith("/driver")) return { nav: DRIVER_NAV, role: "Driver Panel" };
  return { nav: PASSENGER_NAV, role: "Passenger" };
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Determine layout variant and sidebar nav on every navigation
  const isDashboard = isDashboardRoute(location.pathname);
  const { nav: sidebarNav, role } = getSidebarNav(location.pathname);

  if (isDashboard) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "#070C18", fontFamily: "Inter, sans-serif" }}>
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 flex-shrink-0 flex flex-col border-r"
              style={{ background: "#0D1528", borderColor: "rgba(255,255,255,0.06)" }}
            >
              {/* Logo */}
              <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00C896, #009E78)" }}>
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 700, fontSize: 15 }}>Pother Dake</p>
                  <p style={{ fontSize: 11, color: "#00C896" }}>{role}</p>
                </div>
              </div>

              {/* Nav items — active state uses a green indicator dot */}
              <nav className="flex-1 p-3 overflow-y-auto">
                {sidebarNav.map(({ icon: Icon, label, path }) => {
                  const active = location.pathname === path;
                  return (
                    <Link key={path} to={path}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all"
                        style={{
                          background: active ? "rgba(0, 200, 150, 0.12)" : "transparent",
                          color: active ? "#00C896" : "rgba(255,255,255,0.55)",
                        }}
                      >
                        <Icon size={17} />
                        <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>
                        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#00C896" }} />}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom user */}
              <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User123&backgroundColor=b6e3f4" className="w-9 h-9 rounded-full" alt="user" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate" style={{ fontSize: 13, fontWeight: 600 }}>Rahim Uddin</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>+880 1711-234567</p>
                  </div>
                  <LogOut size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content area — scrolls independently from the sidebar */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ background: "#0D1528", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Menu size={18} />
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                <input placeholder="Search..." className="bg-transparent outline-none text-white/70 text-sm w-48" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#00C896" }} />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User123&backgroundColor=b6e3f4" className="w-8 h-8 rounded-full" alt="user" />
                <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto" style={{ background: "#070C18" }}>
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Public layout — sticky glassmorphism navbar with mobile hamburger menu
  return (
    <div style={{ background: "#070C18", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "rgba(7,12,24,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00C896, #009E78)" }}>
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white" style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px" }}>Pother Dake</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <Link key={path} to={path}>
              <motion.span
                whileHover={{ color: "#00C896" }}
                className="px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
                style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>Switch to:</span>
            <Link to="/passenger">
              <span className="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.7)" }}>Passenger</span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <Link to="/driver">
              <span className="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.7)" }}>Driver</span>
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <Link to="/admin">
              <span className="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.7)" }}>Admin</span>
            </Link>
          </div>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-sm text-white"
              style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 600 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg" style={{ color: "rgba(255,255,255,0.7)" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 px-4 py-4"
            style={{ background: "rgba(13,21,40,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)}>
                <div className="py-3 px-4 rounded-xl text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</div>
              </Link>
            ))}
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full mt-2 py-3 rounded-xl text-white text-sm" style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 600 }}>
                Get Started
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Outlet />
    </div>
  );
}
