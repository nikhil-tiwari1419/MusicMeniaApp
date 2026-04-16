import { useEffect, useState } from "react";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

// ✅ Extract once — not repeated in every call
const API = import.meta.env.VITE_API_URL;

export default function AuthPage() {

  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginBy, setLoginBy] = useState("username");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // ✅ Removed role from form state — backend hardcodes role: 'user'
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { user, loading: authLoading, login, register } = useAuth();
  const navigate = useNavigate();

  // ✅ Added authLoading guard — don't redirect while auth check is still running
  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === "artist" ? "/artist-Dashboard" : "/user-Dashboard");
    }
  }, [user, authLoading, navigate]);

  // ─────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────

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

  // ✅ OTP paste support — users can paste OTP from email
  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  }

  // ✅ Fixed: checks result.success instead of try/catch (login/register no longer throw)
  // ✅ Fixed: role removed from register payload
  // ✅ Fixed: navigation uses result.data.user.role (correct shape)
  async function handleSubmit() {
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
          // Handle validation errors array from express-validator
          if (result.errors) {
            result.errors.forEach(e => toast.error(e.msg));
          } else {
            toast.error(result.message || "Login failed");
          }
          return;
        }

        toast.success("Welcome back! 🎵");
        navigate(result.data.user.role === "artist" ? "/artist-Dashboard" : "/user-Dashboard");

      } else {
        // ✅ Role NOT sent — backend hardcodes role: 'user'
        const result = await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });

        if (!result.success) {
          if (result.errors) {
            result.errors.forEach(e => toast.error(e.msg));
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

  // ✅ Fixed: uses axios instead of fetch (consistent with rest of app)
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

  // ✅ Removed role from reset — role no longer in form state
  function switchMode() {
    setIsLogin(!isLogin);
    setForm({ username: "", email: "", password: "" });
    setShowOTP(false);
    setShowPassword(false);
    setOtp(["", "", "", "", "", ""]);
  }

  // ─────────────────────────────────────────
  // PASSWORD STRENGTH CHECKS
  // ─────────────────────────────────────────

  const passwordChecks = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "At least one number", valid: /\d/.test(form.password) },
    { label: "At least one special character (@$!%*&)", valid: /[@$!%*&]/.test(form.password) },
  ];

  // ─────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <div
        className="flex cursor-pointer mb-8 z-10"
        onClick={() => {
          if (user) navigate(user?.role === "artist" ? "/artist-Dashboard" : "/user-Dashboard");
          else navigate("/");
        }}
      >
        <img src="/logoo.png" alt="logo" className="h-20 sm:h-50 w-auto" />
      </div>

      {/* Card */}
      <div className="bg-gray-100 rounded-md w-full max-w-md p-8 shadow-2xl z-10">

        {/* Tabs */}
        {!showOTP && (
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7 border border-gray-800">
            <button
              onClick={() => isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-sans transition-all duration-200
                ${isLogin ? "bg-blue-500 text-white shadow-lg" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => !isLogin || switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-bold font-sans transition-all duration-200
                ${!isLogin ? "bg-blue-500 text-white shadow-lg" : "text-gray-500 hover:text-gray-300 bg-transparent"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* OTP Screen */}
        {showOTP ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">📬</span>
            <h2 className="text-black text-xl font-bold">Verify your email</h2>
            <p className="text-gray-900 text-sm text-center">
              OTP sent to <span className="text-green-400 font-semibold">{registeredEmail}</span>
            </p>

            {/* 6 OTP Input Boxes */}
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
                  //  Paste handler only on first box
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  className={`w-11 h-14 text-center text-xl font-bold font-sans rounded-xl border
                    bg-gray-50 text-black outline-none transition-all duration-200 focus:border-green-500
                    ${val ? "border-green-500 bg-green-100" : "border-gray-700"}`}
                />
              ))}
            </div>

            {/* Fixed contrast: dark text on yellow background */}
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-bold font-sans py-3 rounded-xl transition-all duration-200 mt-2"
            >
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>

            <button
              onClick={() => setShowOTP(false)}
              className="text-gray-900 hover:text-gray-700 text-sm font-sans transition-colors mt-1 bg-transparent border-none cursor-pointer"
            >
              ← Back
            </button>
          </div>

        ) : (
          /* Main Form */
          <div className="flex flex-col">
            <h2 className="text-blue-600 text-xl font-semibold mb-1">
              {isLogin ? "Welcome back 👋" : "Join MusicMenia 🎵"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? "Sign in to continue your journey" : "Create your account today"}
            </p>

            {/* Login By Toggle */}
            {isLogin && (
              <div className="flex bg-gray-50 rounded-xl p-1 mb-5 border border-gray-800">
                <button
                  onClick={() => { setLoginBy("username"); setForm({ ...form, email: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-sans transition-all duration-200
                    ${loginBy === "username" ? "bg-gray-300 text-black" : "text-gray-500 hover:text-gray-900 bg-transparent"}`}
                >
                  Username
                </button>
                <button
                  onClick={() => { setLoginBy("email"); setForm({ ...form, username: "" }); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-sans transition-all duration-200
                    ${loginBy === "email" ? "bg-gray-300 text-black" : "text-gray-500 hover:text-gray-900 bg-transparent"}`}
                >
                  Email
                </button>
              </div>
            )}

            {/* Username Field */}
            {(!isLogin || loginBy === "username") && (
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-900 text-xs font-sans font-semibold uppercase tracking-wider">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="bg-gray-50 border border-gray-700 focus:border-green-500 rounded-xl
                    px-4 py-3 text-black text-sm font-sans outline-none transition-all duration-200 placeholder-gray-600"
                />
              </div>
            )}

            {/* Email Field */}
            {(!isLogin || loginBy === "email") && (
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-gray-900 text-xs font-sans font-semibold uppercase tracking-wider">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-gray-50 border border-gray-700 focus:border-purple-500 rounded-xl
                    px-4 py-3 text-black text-sm font-sans outline-none transition-all duration-200 placeholder-gray-600"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-gray-900 text-xs font-sans font-semibold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-gray-50 border border-gray-700 focus:border-green-500 rounded-xl
                    px-4 py-3 pr-12 text-black text-sm font-sans outline-none transition-all duration-200 placeholder-gray-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength hints — outside relative div so eye icon stays in place */}
              {!isLogin && form.password.length > 0 && (
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  {passwordChecks.map(({ label, valid }) => (
                    <li key={label} className={valid ? "text-green-500" : "text-gray-500"}>
                      {valid ? "✔️" : "○"} {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="flex justify-end mb-5 mt-1">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-green-400 text-xs font-sans cursor-pointer hover:text-green-300 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:opacity-60
                text-white font-bold font-sans py-3 rounded-xl transition-all duration-200 mt-3 cursor-pointer"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
            </button>

            {/* Switch Mode */}
            <p className="text-center text-gray-500 text-sm mt-5 font-sans">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={switchMode}
                className="text-green-400 hover:text-green-300 cursor-pointer font-bold underline underline-offset-4 transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-xs font-sans tracking-widest mt-8 z-10">
        🎵 DISCOVER · CREATE · SHARE
      </p>
    </div>
  );
}

