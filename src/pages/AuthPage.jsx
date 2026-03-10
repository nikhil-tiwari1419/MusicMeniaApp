import { useState } from "react";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleOtpChange(value, index) {
    if (!/^\d*$/.test(value)) return;
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

  async function handleSubmit() {
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email, username: form.username, password: form.password });
        toast.success("Welcome back! 🎵");
        navigate("/");
      } else {
        await register({ username: form.username, email: form.email, password: form.password });
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

  async function handleVerifyOTP() {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return toast.error("Enter full OTP");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp: otpValue }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Email verified! Please login. ✅");
      setShowOTP(false);
      setIsLogin(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsLogin(!isLogin);
    setForm({ username: "", email: "", password: "" });
    setShowOTP(false);
    setOtp(["", "", "", "", "", ""]);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <div className="flex cursor-pointer mb-8 z-10" onClick={() => navigate("/")}>
        <span className="bg-gray-600 text-white text-xl font-bold py-1 pl-4 pr-2 font-mono rounded-l-2xl">
          Music
        </span>
        <span className="bg-blue-500 text-white text-xl font-bold py-1 pr-4 pl-2 font-mono rounded-r-2xl">
          Menia
        </span>
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl z-10">

        {/* Tabs */}
        {!showOTP && (
          <div className="flex bg-gray-950 rounded-xl p-1 mb-7 border border-gray-800">
            <button
              onClick={() => isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200
                ${isLogin
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-300 bg-transparent"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => !isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200
                ${!isLogin
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-300 bg-transparent"
                }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* OTP Screen */}
        {showOTP ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">📬</span>
            <h2 className="text-white text-xl font-bold">Verify your email</h2>
            <p className="text-gray-400 text-sm text-center">
              OTP sent to{" "}
              <span className="text-blue-400 font-semibold">{registeredEmail}</span>
            </p>

            {/* OTP Boxes */}
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
                    bg-gray-950 text-white outline-none transition-all duration-200
                    focus:border-blue-500
                    ${val ? "border-blue-500 bg-blue-950" : "border-gray-700"}`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white 
                font-bold font-mono py-3 rounded-xl transition-all duration-200 mt-2"
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
          /* Form */
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-bold mb-1">
              {isLogin ? "Welcome back 👋" : "Join MusicMenia 🎵"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin
                ? "Sign in to continue your journey"
                : "Create your account today"}
            </p>

            {/* Username */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                className="bg-gray-950 border border-gray-700 focus:border-blue-500 rounded-xl
                  px-4 py-3 text-white text-sm font-mono outline-none transition-all duration-200
                  placeholder-gray-600"
              />
            </div>

            {/* Email — signup only */}
            {!isLogin && (
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
                  className="bg-gray-950 border border-gray-700 focus:border-blue-500 rounded-xl
                    px-4 py-3 text-white text-sm font-mono outline-none transition-all duration-200
                    placeholder-gray-600"
                />
              </div>
            )}

            {/* Password */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-950 border border-gray-700 focus:border-blue-500 rounded-xl
                  px-4 py-3 text-white text-sm font-mono outline-none transition-all duration-200
                  placeholder-gray-600"
              />
            </div>

            {/* Forgot password */}
            {isLogin && (
              <div className="flex justify-end mb-5 mt-1">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-400 text-xs font-mono cursor-pointer hover:text-blue-300
                    underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60
                text-white font-bold font-mono py-3 rounded-xl transition-all duration-200 mt-3 cursor-pointer"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In →"
                : "Create Account →"}
            </button>

            {/* Switch mode */}
            <p className="text-center text-gray-500 text-sm mt-5 font-mono">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={switchMode}
                className="text-blue-400 hover:text-blue-300 cursor-pointer font-bold
                  underline underline-offset-4 transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-700 text-xs font-mono tracking-widest mt-8 z-10">
        🎵 DISCOVER · CREATE · SHARE
      </p>
    </div>
  );
}