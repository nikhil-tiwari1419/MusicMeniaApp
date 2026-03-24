import { useState } from "react";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {

  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────

  const [isLogin, setIsLogin]           = useState(true);       // Sign In ya Sign Up tab
  const [loading, setLoading]           = useState(false);      // button disable during API call
  const [showOTP, setShowOTP]           = useState(false);      // OTP screen dikhao/chupao
  const [showPassword, setShowPassword] = useState(false);      // password visible/hidden
  const [loginBy, setLoginBy]           = useState("username"); // login: username ya email se
  const [otp, setOtp]                   = useState(["", "", "", "", "", ""]); // 6 OTP boxes
  const [registeredEmail, setRegisteredEmail] = useState("");   // OTP screen pe email dikhane ke liye

  // Form data — sabke liye ek object
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", 
  });

  // Context se login/register/logout functions
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // HANDLERS

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // OTP box mein ek digit type hone pe
  function handleOtpChange(value, index) {
    if (!/^\d*$/.test(value)) return; // sirf numbers allow karo
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  // Backspace pe previous box pe focus
  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  // Sign In ya Sign Up button click
  async function handleSubmit() {
    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN — username ya email se
        const payload = {
          password: form.password,
          ...(loginBy === "username"
            ? { username: form.username }
            : { email: form.email }),
        };
      const data = await login(payload);
        toast.success("Welcome back! 🎵");

        // role check hear 

      if(data.user.role === "artist"){
        navigate("/artist-Dashboard");
      }else{
        navigate("/");
      }
      } else {
        // REGISTER — role bhi bhejo
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role, // user or artist
        });
        setRegisteredEmail(form.email);
        setShowOTP(true);
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // OTP verify karo
  async function handleVerifyOTP() {
    const otpValue = otp.join(""); // ["1","2","3","4","5","6"] → "123456"
    if (otpValue.length < 6) return toast.error("Enter full OTP");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registeredEmail, otp: otpValue }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Email verified! Please login. ✅");
      setShowOTP(false);
      setIsLogin(true); // verify ke baad Sign In tab pe le jao
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  // Tab switch karne pe form reset
  function switchMode() {
    setIsLogin(!isLogin);
    setForm({ username: "", email: "", password: "", role: "user" });
    setShowOTP(false);
    setShowPassword(false);
    setOtp(["", "", "", "", "", ""]);
  }
  
  // UI

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs — decorative only */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <div className="flex cursor-pointer mb-8 z-10" onClick={() => navigate(user?.role === "artist" ? "/artist-Dashboard":"/")}>
        <span className="bg-gray-600 text-white text-xl font-bold py-1 pl-4 pr-2 font-mono rounded-l-2xl">Music</span>
        <span className="bg-purple-500 text-white text-xl font-bold py-1 pr-4 pl-2 font-mono rounded-r-2xl">Menia</span>
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl z-10">

        {/* ── Sign In / Sign Up Tabs ── */}
        {!showOTP && (
          <div className="flex bg-gray-950 rounded-xl p-1 mb-7 border border-gray-800">
            <button
              onClick={() => isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200
                ${isLogin ? "bg-purple-500 text-white shadow-lg" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => !isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200
                ${!isLogin ? "bg-purple-500 text-white shadow-lg" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ── OTP Screen ── */}
        {showOTP ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">📬</span>
            <h2 className="text-white text-xl font-bold">Verify your email</h2>
            <p className="text-gray-400 text-sm text-center">
              OTP sent to <span className="text-purple-400 font-semibold">{registeredEmail}</span>
            </p>

            {/* 6 OTP Input Boxes */}
            <div className="flex gap-3 my-2">
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border
                    bg-gray-950 text-white outline-none transition-all duration-200 focus:border-purple-500
                    ${val ? "border-purple-500 bg-purple-950" : "border-gray-700"}`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white font-bold font-mono py-3 rounded-xl transition-all duration-200 mt-2"
            >
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>

            <button
              onClick={() => setShowOTP(false)}
              className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors mt-1 bg-transparent border-none cursor-pointer"
            >
              ← Back
            </button>
          </div>

        ) : (
          /* ── Main Form ── */
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-bold mb-1">
              {isLogin ? "Welcome back 👋" : "Join MusicMenia 🎵"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? "Sign in to continue your journey" : "Create your account today"}
            </p>

            {/* ── Login By Toggle (Sign In only) ── */}
            {isLogin && (
              <div className="flex bg-gray-950 rounded-xl p-1 mb-5 border border-gray-800">
                <button
                  onClick={() => { setLoginBy("username"); setForm({ ...form, email: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-200
                    ${loginBy === "username" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
                >
                  Username
                </button>
                <button
                  onClick={() => { setLoginBy("email"); setForm({ ...form, username: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-200
                    ${loginBy === "email" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
                >
                  Email
                </button>
              </div>
            )}

            {/* ── Username Field ── */}
            {(!isLogin || loginBy === "username") && (
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="bg-gray-950 border border-gray-700 focus:border-purple-500 rounded-xl
                    px-4 py-3 text-white text-sm font-mono outline-none transition-all duration-200 placeholder-gray-600"
                />
              </div>
            )}

            {/* ── Email Field ── */}
            {(!isLogin || loginBy === "email") && (
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-gray-950 border border-gray-700 focus:border-purple-500 rounded-xl
                    px-4 py-3 text-white text-sm font-mono outline-none transition-all duration-200 placeholder-gray-600"
                />
              </div>
            )}

            {/* ── Role Selection (Sign Up only) ── */}
            {!isLogin && (
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                  I am a...
                </label>
                <div className="flex gap-3">
                  {/* User role */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "user" })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold font-mono transition-all duration-200 cursor-pointer
                      ${form.role === "user"
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                  >
                    🎧 Listener
                  </button>

                  {/* Artist role */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "artist" })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold font-mono transition-all duration-200 cursor-pointer
                      ${form.role === "artist"
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                  >
                    🎤 Artist
                  </button>
                </div>
              </div>
            )}

            {/* ── Password Field ── */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-950 border border-gray-700 focus:border-purple-500 rounded-xl
                    px-4 py-3 pr-12 text-white text-sm font-mono outline-none transition-all duration-200 placeholder-gray-600"
                />
                {/* Eye icon toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ── Forgot Password (Sign In only) ── */}
            {isLogin && (
              <div className="flex justify-end mb-5 mt-1">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-purple-400 text-xs font-mono cursor-pointer hover:text-purple-300 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </span>
              </div>
            )}

            {/* ── Submit Button ── */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 disabled:opacity-60
                text-white font-bold font-mono py-3 rounded-xl transition-all duration-200 mt-3 cursor-pointer"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
            </button>

            {/* ── Switch Mode ── */}
            <p className="text-center text-gray-500 text-sm mt-5 font-mono">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={switchMode}
                className="text-purple-400 hover:text-purple-300 cursor-pointer font-bold underline underline-offset-4 transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-xs font-mono tracking-widest mt-8 z-10">
        🎵 DISCOVER · CREATE · SHARE
      </p>

    </div>
  );
}
