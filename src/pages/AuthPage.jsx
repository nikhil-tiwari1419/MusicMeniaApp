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

  // Main submit: login or register 
  // Runs on <form onSubmit={...}> now, not a button's onClick.
  // e.preventDefault() stops the browser's native page-reload behaviour,
  // which is what was happening before on every tab/toggle/submit click.
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

        toast.success("Welcome back! 🎵");
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
        toast.success("OTP sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return toast.error("Enter full OTP");

    setLoading(true);
    try {
      await axios.post(
        `${API}/auth/verify-email`,
        { email: registeredEmail, otp: otpValue },
        { withCredentials: true }
      );
      toast.success("Email verified! Please login. ✅");
      setShowOTP(false);
      setIsLogin(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "At least one number", valid: /\d/.test(form.password) },
    { label: "At least one special character (@$!%*&)", valid: /[@$!%*&]/.test(form.password) },
  ];

  // Shared style tokens (black theme, blue + green accents)
  const inputClass = "w-full bg-zinc-900 border border-zinc-700 focus:border-blue-500 rounded-xl " +
    "px-4 py-3 text-white text-sm outline-none transition-colors placeholder-zinc-600";
  const labelClass = "text-zinc-400 text-xs font-semibold uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <button
        type="button"
        className="flex cursor-pointer mb-8 z-10 bg-transparent border-none"
        onClick={() => navigate(user ? (ROLE_HOME[user.role] || "/user-Dashboard") : "/")}
      >
        <img src="/music_logo.png" alt="logo" className="h-20 sm:h-24 w-auto" />
      </button>

      {/* Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl z-10">

        {/* Sign In / Sign Up tabs */}
        {!showOTP && (
          <div className="flex bg-zinc-900 rounded-xl p-1 mb-7 border border-zinc-800">
            <button
              type="button"
              onClick={() => !isLogin && switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors
                ${isLogin ? "bg-blue-600 text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => isLogin && switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors
                ${!isLogin ? "bg-blue-600 text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* OTP verification screen */}
        {showOTP ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">📬</span>
            <h2 className="text-white text-xl font-bold">Verify your email</h2>
            <p className="text-zinc-400 text-sm text-center">
              OTP sent to <span className="text-green-400 font-semibold">{registeredEmail}</span>
            </p>

            <div className="flex gap-3 my-2">
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
                  className={`w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-colors
                    bg-zinc-900 text-white
                    ${val ? "border-green-500 bg-green-500/10" : "border-zinc-700 focus:border-blue-500"}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60
                text-black font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>

            <button
              type="button"
              onClick={() => setShowOTP(false)}
              className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors mt-1 bg-transparent border-none"
            >
              ← Back
            </button>
          </div>

        ) : (
          /* Main form — onSubmit here, NOT onClick on the button. */
          <form onSubmit={handleSubmit} className="flex flex-col">
            <h2 className="text-blue-400 text-xl font-semibold mb-1">
              {isLogin ? "Welcome back 👋" : "Join MusicMenia 🎵"}
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              {isLogin ? "Sign in to continue your journey" : "Create your account today"}
            </p>

            {/* Login-by toggle (username vs email) */}
            {isLogin && (
              <div className="flex bg-zinc-900 rounded-xl p-1 mb-5 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setLoginBy("username"); setForm({ ...form, email: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors
                    ${loginBy === "username" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Username
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginBy("email"); setForm({ ...form, username: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors
                    ${loginBy === "email" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Email
                </button>
              </div>
            )}

            {/* Username field */}
            {(!isLogin || loginBy === "username") && (
              <div className="flex flex-col gap-1 mb-4">
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

            {/* Email field */}
            {(!isLogin || loginBy === "email") && (
              <div className="flex flex-col gap-1 mb-4">
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

            {/* Password field */}
            <div className="flex flex-col gap-1 mb-2">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors bg-transparent border-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && form.password.length > 0 && (
                <ul className="text-xs mt-2 space-y-1">
                  {passwordChecks.map(({ label, valid }) => (
                    <li key={label} className={valid ? "text-green-400" : "text-zinc-500"}>
                      {valid ? "✔️" : "○"} {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end mb-5 mt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-green-400 text-xs hover:text-green-300 underline underline-offset-4 transition-colors bg-transparent border-none"
                >
                  Forgot password?
                </button>
              </div>
            )}

          {/* submit btn */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60
                text-white font-bold py-3 rounded-xl transition-colors mt-3"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
            </button>

            <p className="text-center text-zinc-500 text-sm mt-5">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={switchMode}
                className="text-green-400 hover:text-green-300 font-bold underline underline-offset-4 transition-colors bg-transparent border-none"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        )}
      </div>

      <p className="text-zinc-600 text-xs tracking-widest mt-8 z-10">
        🎵 DISCOVER · CREATE · SHARE
      </p>
    </div>
  );
}


