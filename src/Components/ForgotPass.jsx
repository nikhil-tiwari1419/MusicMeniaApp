import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

// Steps: 1 = email, 2 = OTP, 3 = new password
export default function ForgotPass() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ─── Password strength ───────────────────────────────
    const checks = [
        { label: 'At least 8 characters',        valid: newPassword.length >= 8 },
        { label: 'One uppercase letter',          valid: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter',          valid: /[a-z]/.test(newPassword) },
        { label: 'One number',                    valid: /\d/.test(newPassword) },
        { label: 'One special character (@$!%*&)', valid: /[@$!%*&]/.test(newPassword) },
    ];
    const allValid = checks.every(c => c.valid);

    // ─── Step 1 — Send OTP ───────────────────────────────
    async function handleSendOTP(e) {
        e.preventDefault();
        if (!email.trim()) return toast.error('Please enter your email');
        setLoading(true);
        try {
            await axios.post(`${API}/auth/forgot-password`, { email });
            toast.success('OTP sent to your email!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    }

    // ─── OTP input handlers ──────────────────────────────
    function handleOtpChange(val, i) {
        if (!/^\d*$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) document.getElementById(`fp-otp-${i + 1}`)?.focus();
    }

    function handleOtpKeyDown(e, i) {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            document.getElementById(`fp-otp-${i - 1}`)?.focus();
        }
    }

    function handleOtpPaste(e) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = [...otp];
        pasted.split('').forEach((c, i) => { next[i] = c; });
        setOtp(next);
        document.getElementById(`fp-otp-${Math.min(pasted.length, 5)}`)?.focus();
    }

    // ─── Step 2 — Verify OTP ────────────────────────────
    async function handleVerifyOTP(e) {
        e.preventDefault();
        const otpVal = otp.join('');
        if (otpVal.length < 6) return toast.error('Enter full 6-digit OTP');
        setLoading(true);
        try {
            // We just move to step 3 — OTP verified on reset
            setStep(3);
            toast.success('OTP verified! Set your new password.');
        } finally {
            setLoading(false);
        }
    }

    // ─── Step 3 — Reset Password ─────────────────────────
    async function handleReset(e) {
        e.preventDefault();
        if (!allValid) return toast.error('Password does not meet requirements');
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

        setLoading(true);
        try {
            await axios.post(`${API}/auth/reset-password`, {
                email,
                otp: otp.join(''),
                newPassword,
            });
            toast.success('Password reset successfully! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
            // If OTP was wrong/expired, go back to OTP step
            if (err.response?.status === 400) {
                setStep(2);
                setOtp(['', '', '', '', '', '']);
            }
        } finally {
            setLoading(false);
        }
    }

    // ─── Step indicators ─────────────────────────────────
    const steps = ['Email', 'Verify OTP', 'New Password'];

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">

            <style>{`
                @keyframes float {
                    0%,100% { transform: translateY(0px) rotate(0deg); }
                    50%      { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .fade-up { animation: fadeUp 0.4s ease forwards; }
                .note-float { animation: float 6s ease-in-out infinite; }
                .note-float-2 { animation: float 8s ease-in-out infinite 1s; }
                .note-float-3 { animation: float 7s ease-in-out infinite 2s; }
            `}</style>

            {/* Background floating notes */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                <span className="note-float absolute top-[10%] left-[8%] text-5xl opacity-10">♪</span>
                <span className="note-float-2 absolute top-[20%] right-[10%] text-7xl opacity-[0.07]">♫</span>
                <span className="note-float-3 absolute bottom-[20%] left-[15%] text-6xl opacity-[0.08]">♩</span>
                <span className="note-float absolute bottom-[10%] right-[8%] text-4xl opacity-10">♬</span>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo / Back */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to login
                    </button>
                    <span className="text-emerald-400 text-xl font-bold tracking-tight">MusicMenia</span>
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`flex items-center gap-2 ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                                    ${step > i + 1 ? 'bg-emerald-500 text-white'
                                    : step === i + 1 ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                                    : 'bg-gray-800 text-gray-500'}`}
                                >
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block transition-colors
                                    ${step === i + 1 ? 'text-white' : step > i + 1 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                    {s}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-px transition-all duration-500 ${step > i + 1 ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

                    {/* ── STEP 1 — Email ── */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="fade-up space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Forgot password?</h2>
                                <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset OTP.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP →'}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 2 — OTP ── */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="fade-up space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Check your email</h2>
                                <p className="text-gray-400 text-sm">
                                    We sent a 6-digit OTP to{' '}
                                    <span className="text-emerald-400 font-semibold">{email}</span>
                                </p>
                            </div>

                            {/* OTP boxes */}
                            <div className="flex gap-2 justify-center">
                                {otp.map((val, i) => (
                                    <input
                                        key={i}
                                        id={`fp-otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={val}
                                        onChange={e => handleOtpChange(e.target.value, i)}
                                        onKeyDown={e => handleOtpKeyDown(e, i)}
                                        onPaste={i === 0 ? handleOtpPaste : undefined}
                                        className={`w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all duration-200
                                            bg-gray-800 text-white
                                            ${val ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 focus:border-emerald-500'}`}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.join('').length < 6}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP →'}
                            </button>

                            {/* Resend */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setOtp(['', '', '', '', '', '']);
                                    }}
                                    className="text-gray-500 hover:text-gray-300 text-sm transition"
                                >
                                    ← Wrong email? Go back
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 3 — New Password ── */}
                    {step === 3 && (
                        <form onSubmit={handleReset} className="fade-up space-y-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Set new password</h2>
                                <p className="text-gray-400 text-sm">Choose a strong password for your account.</p>
                            </div>

                            {/* New password */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 focus:border-emerald-500 rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Strength checklist */}
                                {newPassword.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                        {checks.map(({ label, valid }) => (
                                            <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0
                                                    ${valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'}`}>
                                                    {valid ? '✓' : '○'}
                                                </span>
                                                {label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        className={`w-full bg-gray-800 border rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none transition-all focus:ring-2 placeholder-gray-600
                                            ${confirmPassword && confirmPassword !== newPassword
                                                ? 'border-red-500 focus:ring-red-500/20'
                                                : confirmPassword && confirmPassword === newPassword
                                                ? 'border-emerald-500 focus:ring-emerald-500/20'
                                                : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                    >
                                        {showConfirm ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <p className="text-red-400 text-xs">Passwords do not match</p>
                                )}
                                {confirmPassword && confirmPassword === newPassword && (
                                    <p className="text-emerald-400 text-xs">✓ Passwords match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !allValid || newPassword !== confirmPassword}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm"
                            >
                                {loading ? 'Resetting...' : 'Reset Password ✓'}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Remember your password?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition"
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}