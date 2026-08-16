// AuthPage — multi-step auth flow: method selection → login/register → OTP → NID verify → success.
// Proprietary source — OTP verification integrates with an SMS gateway in production.

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Upload, ChevronLeft } from "lucide-react";

// Step names double as the animation key for AnimatePresence — keep them unique
type Step = "method" | "register" | "login" | "otp" | "verify-id" | "success";

export default function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("method");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  // Auto-advance focus to the next OTP box as the user types each digit
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  /* Shared inline style objects keep the JSX clean and avoid repeated Tailwind strings
     for the glassmorphism card used across every step. */
  const containerStyle = {
    background: "rgba(13,21,40,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 420,
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "white",
    width: "100%",
    outline: "none",
    fontSize: 14,
  };

  const btnPrimary = {
    background: "linear-gradient(135deg, #00C896, #009E78)",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    color: "white",
    width: "100%",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ paddingTop: 72 }}>
      {/* Bg blobs */}
      <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #00C896, transparent)", top: "10%", left: "10%" }} />
      <div className="absolute w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #7B61FF, transparent)", bottom: "10%", right: "10%" }} />

      <AnimatePresence mode="wait">
        {step === "method" && (
          <motion.div key="method" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={containerStyle}>
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00C896, #009E78)" }}>
                <MapPin size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-white text-center mb-1" style={{ fontWeight: 800 }}>Welcome to Pother Dake</h2>
            <p className="text-center mb-8" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Join Bangladesh's largest ridesharing community</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Login", desc: "Existing user", onClick: () => { setMode("login"); setStep("login"); } },
                { label: "Register", desc: "New user", onClick: () => { setMode("register"); setStep("register"); } },
              ].map(({ label, desc, onClick }) => (
                <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white" style={{ fontWeight: 700 }}>{label}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{desc}</p>
                </motion.button>
              ))}
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs" style={{ background: "#0D1528", color: "rgba(255,255,255,0.3)" }}>Or continue as</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["Passenger", "Driver", "Admin"].map(role => (
                <button key={role} onClick={() => navigate(`/${role.toLowerCase()}`)}
                  className="py-2.5 rounded-xl text-xs transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
                  {role}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "login" && (
          <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={containerStyle}>
            <button onClick={() => setStep("method")} className="flex items-center gap-1 mb-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="text-white mb-1" style={{ fontWeight: 800 }}>Welcome Back!</h2>
            <p className="mb-6" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Login to your Pother Dake account</p>

            {/* Method toggle */}
            <div className="flex rounded-xl p-1 mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
              {[{ key: "phone", label: "Phone", icon: Phone }, { key: "email", label: "Email", icon: Mail }].map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setLoginMethod(key as "phone" | "email")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all"
                  style={{ background: loginMethod === key ? "rgba(0,200,150,0.15)" : "transparent", color: loginMethod === key ? "#00C896" : "rgba(255,255,255,0.5)", fontWeight: loginMethod === key ? 600 : 400 }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-5">
              {loginMethod === "phone" ? (
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-3 rounded-xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>🇧🇩 +880</span>
                  </div>
                  <input style={inputStyle} placeholder="1XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              ) : (
                <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              )}
              <div className="relative">
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm cursor-pointer" style={{ color: "#00C896" }}>Forgot password?</span>
              </div>
            </div>

            <button style={btnPrimary} onClick={() => setStep("otp")}>
              Send OTP <ArrowRight size={16} />
            </button>
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Don't have an account? <span className="cursor-pointer" style={{ color: "#00C896" }} onClick={() => setStep("register")}>Sign up</span>
            </p>
          </motion.div>
        )}

        {step === "register" && (
          <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={containerStyle}>
            <button onClick={() => setStep("method")} className="flex items-center gap-1 mb-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="text-white mb-1" style={{ fontWeight: 800 }}>Create Account</h2>
            <p className="mb-6" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Join thousands of smart travelers</p>

            <div className="space-y-3 mb-5">
              <input style={inputStyle} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>🇧🇩 +880</span>
                </div>
                <input style={inputStyle} placeholder="1XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <input style={inputStyle} type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
              <div className="relative">
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl mb-5 flex items-start gap-2" style={{ background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.15)" }}>
              <Shield size={14} style={{ color: "#00C896", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                After registration you'll need to verify your NID for full platform access. Driver registration requires additional documents.
              </p>
            </div>

            <button style={btnPrimary} onClick={() => setStep("otp")}>
              Register & Verify <ArrowRight size={16} />
            </button>
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Already registered? <span className="cursor-pointer" style={{ color: "#00C896" }} onClick={() => setStep("login")}>Login</span>
            </p>
          </motion.div>
        )}

        {/* OTP step — 6-digit input with keyboard-friendly focus chaining */}
        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={containerStyle}>
            <button onClick={() => setStep(mode === "login" ? "login" : "register")} className="flex items-center gap-1 mb-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.2)" }}>
                <Phone size={24} style={{ color: "#00C896" }} />
              </div>
            </div>
            <h2 className="text-white text-center mb-1" style={{ fontWeight: 800 }}>Verify Your Number</h2>
            <p className="text-center mb-8" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              We sent a 6-digit OTP to <span style={{ color: "white" }}>+880 {phone || "1XXXXXXXXX"}</span>
            </p>

            <div className="flex gap-2 justify-center mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 rounded-xl text-center text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: digit ? "1px solid rgba(0,200,150,0.5)" : "1px solid rgba(255,255,255,0.08)", fontSize: 20, fontWeight: 700 }}
                />
              ))}
            </div>

            <button style={btnPrimary} onClick={() => mode === "register" ? setStep("verify-id") : setStep("success")}>
              Verify OTP <CheckCircle size={16} />
            </button>
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Didn't receive it? <span className="cursor-pointer" style={{ color: "#00C896" }}>Resend OTP</span>
            </p>
          </motion.div>
        )}

        {/* NID verification step — AI face matching happens server-side after upload */}
        {step === "verify-id" && (
          <motion.div key="verify-id" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={containerStyle}>
            <h2 className="text-white mb-1" style={{ fontWeight: 800 }}>Identity Verification</h2>
            <p className="mb-6" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Required to ensure platform safety. Step 1 of 2.</p>

            <div className="space-y-3 mb-5">
              {[
                { label: "NID Card — Front", desc: "Upload clear photo" },
                { label: "NID Card — Back", desc: "Upload clear photo" },
              ].map(({ label, desc }) => (
                <div key={label} className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:border-emerald-500/50 transition-all" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <Upload size={22} style={{ color: "rgba(255,255,255,0.2)", margin: "0 auto 8px" }} />
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl mb-5" style={{ background: "rgba(255,183,0,0.06)", border: "1px solid rgba(255,183,0,0.2)" }}>
              <p style={{ fontSize: 12, color: "rgba(255,183,0,0.8)", textAlign: "center" }}>
                Step 2: Live face verification video will be requested after NID upload
              </p>
            </div>

            <button style={btnPrimary} onClick={() => setStep("success")}>
              Submit for Verification <CheckCircle size={16} />
            </button>
            <button className="w-full mt-3 py-3 rounded-xl text-sm" style={{ color: "rgba(255,255,255,0.5)" }} onClick={() => setStep("success")}>
              Skip for now (limited access)
            </button>
          </motion.div>
        )}

        {/* Success state — gives the user clear next-action paths (passenger vs driver) */}
        {step === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={containerStyle}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(0,200,150,0.1)", border: "2px solid rgba(0,200,150,0.3)" }}>
                <CheckCircle size={40} style={{ color: "#00C896" }} />
              </div>
              <h2 className="text-white mb-2" style={{ fontWeight: 800 }}>You're All Set!</h2>
              <p className="mb-8" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Welcome to Pother Dake! Your account is created. {mode === "register" ? "Verification is being reviewed." : ""}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => navigate("/passenger")} className="py-3 rounded-xl text-sm" style={{ background: "rgba(0,200,150,0.1)", color: "#00C896", border: "1px solid rgba(0,200,150,0.2)", fontWeight: 600 }}>
                  Passenger Dashboard
                </button>
                <button onClick={() => navigate("/driver")} className="py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600 }}>
                  Driver Dashboard
                </button>
              </div>
              <button onClick={() => navigate("/")} className="w-full py-3.5 rounded-xl text-white" style={{ background: "linear-gradient(135deg, #00C896, #009E78)", fontWeight: 700 }}>
                Start Exploring Rides
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
