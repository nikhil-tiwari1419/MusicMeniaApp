import { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Where each role lands after a successful login/register.
// Kept in one place so we never have a typo'd path in two spots again.
const ROLE_HOME = {
  admin: "/admin-dashboard",
  artist: "/artist-Dashboard",
  user: "/user-Dashboard",
};

// NOTE: this file loads Space Grotesk + Inter via a runtime @import for
// portability. In production, move this <link> into index.html instead so
// the font isn't blocked by render-blocking CSS-in-JS.
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
      .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .vinyl-spin { animation: spin-slow 22s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .vinyl-spin { animation: none; }
      }
    `}</style>
  );
}

// Concentric groove rings for the record — generated once, not on every
// render, since they never change.
const GROOVES = Array.from({ length: 14 }, (_, i) => 86 - i * 5.6);

function Vinyl() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 shrink-0">
      <svg viewBox="0 0 200 200" className="w-full h-full vinyl-spin drop-shadow-2xl">
        <circle cx="100" cy="100" r="96" fill="#0a0a0b" />
        <circle cx="100" cy="100" r="96" fill="url(#sheen)" />
        {GROOVES.map((r, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#1f2023"
            strokeWidth="0.6"
          />
        ))}
        <circle cx="100" cy="100" r="34" fill="#3B82F6" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="4.5" fill="#0a0a0b" />
        <defs>
          <radialGradient id="sheen" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <text
          x="100"
          y="104"
          textAnchor="middle"
          className="font-display"
          fontSize="13"
          fontWeight="700"
          fill="#0B0C0F"
        >
          MM
        </text>
      </svg>

      {/* Tonearm resting on the edge of the record */}
      <div className="absolute -top-6 -right-4 w-24 h-24 origin-top-right rotate-[28deg]">
        <div className="absolute top-0 right-2 w-3 h-3 rounded-full bg-zinc-700 border border-zinc-600" />
        <div className="absolute top-2 right-3 w-1.5 h-20 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-full" />
        <div className="absolute bottom-0 right-2 w-2.5 h-4 bg-zinc-700 rounded-sm rotate-45" />
      </div>
    </div>
  );
}

export default function AuthPage() {
  // Form / UI state
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginBy, setLoginBy] = useState("username");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { user, loading: authLoading, login, register } = useAuth();
  const navigate = useNavigate();

  // If a user is already logged in, bounce them straight to their dashboard
  // instead of showing the login form. `authLoading` guard avoids redirecting
  // during the brief moment auth status is still being checked.
  useEffect(() => {
    if (!authLoading && user) {
      navigate(ROLE_HOME[user.role] || "/user-Dashboard");
    }
  }, [user, authLoading, navigate]);

  // Simple field handlers

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleOtpChange(value, index) {
    if (!/^\d*$/.test(value)) return; // only digits allowed
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  }

  function switchMode() {
    setIsLogin(!isLogin);
    setForm({ username: "", email: "", password: "" });
    setShowOTP(false);
    setShowPassword(false);
    setOtp(["", "", "", "", "", ""]);
  }

  // login or register
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const payload = {
          password: form.password,
          ...(loginBy === "username"
            ? { username: form.username }
            : { email: form.email }),
        };

        const result = await login(payload);

        if (!result.success) {
          if (result.errors) {
            result.errors.forEach(err => toast.error(err.msg));
          } else {
            toast.error(result.message || "Login failed");
          }
          return;
        }

        toast.success("Welcome back!");
        navigate(ROLE_HOME[result.data.user.role] || "/user-Dashboard");

      } else {
        // Role is never sent from the client — backend always creates role: 'user'
        const result = await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });

        if (!result.success) {
          if (result.errors) {
            result.errors.forEach(err => toast.error(err.msg));
          } else {
            toast.error(result.message || "Registration failed");
          }
          return;
        }

        setRegisteredEmail(form.email);
        setShowOTP(true);
        toast.success("OTP sent to your email");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return toast.error("Enter the full code");

    setLoading(true);
    try {
      await axios.post(
        `${API}/auth/verify-email`,
        { email: registeredEmail, otp: otpValue },
        { withCredentials: true }
      );
      toast.success("Email verified — sign in to continue");
      setShowOTP(false);
      setIsLogin(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "8+ characters", valid: form.password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "Number", valid: /\d/.test(form.password) },
    { label: "Special character", valid: /[@$!%*&]/.test(form.password) },
  ];

  // Shared style tokens
  const inputClass = "w-full font-body bg-gray-200 border border-[#26282d] focus:border-blue-500 rounded-lg " +
    "px-4 py-3 text-black text-sm outline-none transition-colors placeholder-[#5c5e66]";
  const labelClass = "font-body text-[#8b8d97] text-xs font-medium";

  return (
    <div className="min-h-screen border bg-[#f4f8e9] font-body flex">
      <FontLoader />

      {/* ===== Left: form panel ===== */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-30 py-18 relative z-50">
        <button
          type="button"
          className="flex items-center gap-2 mb-10 cursor-pointer bg-transparent border-none w-fit"
          onClick={() => navigate(user ? (ROLE_HOME[user.role] || "/user-Dashboard") : "/")}
        >
          <img src="/music_logo.png" alt="logo" className="h-28 rounded-2xl w-auto" />
          <span className="font-display text-[#222208] underline underline-offset-4 text-4xl font-semibold">MusicMenia</span>
        </button>

        <div className="w-full max-w-sm">
          {showOTP ? (
            /* ===== OTP verification screen ===== */
            <div>
              <h1 className="font-display text-[#15150c] text-3xl font-semibold leading-tight mb-2">
                Check your inbox
              </h1>
              <p className="text-[#8b8d97] text-sm mb-8">
                We sent a 6-digit code to{" "}
                <span className="text-[#191913] font-medium">{registeredEmail}</span>
              </p>

              <div className="flex gap-2.5 mb-8">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className={`w-11 h-13 sm:h-14 text-center font-display text-lg font-semibold rounded-lg border outline-none transition-colors
                      bg-[#dffdff] text-[#191911]
                      ${val ? "border-blue-500 bg-blue-500/10" : "border-[#26282d] focus:border-blue-500"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60
                  text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Verifying…" : "Verify email"}
              </button>

              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="text-[#8b8d97] hover:text-[#00c555] text-sm transition-colors mt-4 bg-transparent border-none"
              >
                Back
              </button>
            </div>
          ) : (
            /* ===== Main form ===== */
            <form onSubmit={handleSubmit} className="flex flex-col">
              <h1 className="font-display text-[#055f2f] text-3xl font-semibold leading-tight mb-2">
                {isLogin ? "Good to hear from you" : "Start your library"}
              </h1>
              <p className="text-[#6b83fc] text-sm mb-8">
                {isLogin ? "Sign in to pick up where you left off" : "Sheet music, tracks and sessions, all in one place"}
              </p>

              {isLogin && (
                <div className="flex gap-5 mb-6 border-b border-[#1f2024]">
                  {["username", "email"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setLoginBy(mode);
                        setForm({ ...form, [mode === "username" ? "email" : "username"]: "" });
                      }}
                      className={`pb-3 text-sm font-medium capitalize transition-colors bg-transparent border-none border-b-2 -mb-px
                        ${loginBy === mode
                          ? "text-[#0a0aff] border-blue-500"
                          : "text-[#343235] border-transparent hover:underline"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}

              {(!isLogin || loginBy === "username") && (
                <div className="flex flex-col gap-1.5 mb-4">
                  <label htmlFor="username" className={labelClass}>Username</label>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="your_username"
                    className={inputClass}
                  />
                </div>
              )}

              {(!isLogin || loginBy === "email") && (
                <div className="flex flex-col gap-1.5 mb-4">
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 mb-1">
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#5c5e66] hover:text-[#8b9fff] transition-colors bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLogin && form.password.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                    {passwordChecks.map(({ label, valid }) => (
                      <span
                        key={label}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${valid ? "text-emerald-400" : "text-[#5c5e66]"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${valid ? "bg-emerald-400" : "bg-[#c6d5a0]"}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="flex justify-end mb-6 mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[#8b8d97] hover:text-[#63e438d0] text-xs transition-colors bg-transparent border-none"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60
                  text-white font-medium py-3 rounded-lg transition-colors mt-4"
              >
                {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
              </button>

              <p className="text-center text-[#5c5e66] text-sm mt-6">
                {isLogin ? "New to MusicMenia? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors bg-transparent border-none"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ===== Right: vinyl hero panel ===== */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gray-100">
        <div className="absolute w-[420px] h-[420px] bg-blue-600 opacity-[0.60] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-10 w-[380px] h-[380px] bg-emerald-500 opacity-[0.70] rounded-full blur-3xl" />

        <div className="relative flex flex-col items-center gap-10 z-10">
          <Vinyl />
          <div className="text-center max-w-xs">
            <p className="font-display text-[#ef5514e7] text-xl font-medium leading-snug">
              Discover. Create. Share.
            </p>
            <p className="text-[#6b6d76] text-sm mt-2">
              Every track, sheet and session — one account away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
