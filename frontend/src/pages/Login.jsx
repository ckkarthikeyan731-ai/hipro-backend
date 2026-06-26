import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config.js'; // Dynamically pulls your live backend API route context

const Login = () => {
    // Primary State Management Registries
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // UI Accessibility and Visibility State Flags
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginSubmission = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Enforce structural parameters before wasting bandwidth on a network call
        if (!email.trim() || !password.trim()) {
            setError("All system credential fields must be filled completely.");
            setLoading(false);
            return;
        }

        try {
            // Dispatch the verification parameters directly to your production cluster
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: email.trim(),
                password: password
            });

            // MAXIMUM COMPATIBILITY EXTRACTOR: Deep scans response layers for any token formatting variant
            const incomingToken =
                response.data?.token ||
                response.data?.authToken ||
                response.data?.jwtToken ||
                response.data?.data?.token ||
                response.data?.user?.token;

            const userRole = response.data?.role || response.data?.user?.role || 'student';

            if (incomingToken) {
                // Instantly purge stale authorization tokens to eliminate caching layout corruption
                localStorage.clear();

                // Save across all common namespace variations to protect StudentDashboard calls completely
                localStorage.setItem('token', incomingToken);
                localStorage.setItem('authToken', incomingToken);
                localStorage.setItem('role', userRole);

                // PATH COMPLIANCE EVALUATOR: Tracks clean routing paths versus backward hash fallbacks
                if (userRole === 'recruiter' || userRole === 'admin') {
                    window.location.href = window.location.pathname.includes('_') ? '/_recruiter' : '#recruiter';
                } else {
                    window.location.href = window.location.pathname.includes('_') ? '/_student' : '#student';
                }

                // Introduce an explicit frame buffer delay to allow local storage writes to finalize fully
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            } else {
                setError("Authentication succeeded, but the security profile validation key was missing from the server array.");
            }
        } catch (err) {
            console.error("Secure handshake protocol rejected by backend server host:", err);
            // Catch custom messaging details returned directly from your database routes
            setError(err.response?.data?.message || "Invalid system credentials provided.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full max-w-md transition-all duration-300 hover:shadow-md">

                {/* APPLICATION SYSTEM BRAND HERO LAYER */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100 animate-pulse">
                            <span className="text-white font-black text-[10px]">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-sm uppercase tracking-wider">HiPro Portal System</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Login</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                        Input verified system parameters below to access core student terminals and real-time database registries.
                    </p>
                </div>

                {/* ANIMATED SYSTEM ALERT COMPONENT */}
                {error && (
                    <div className="mb-5 bg-rose-50 text-rose-600 border border-rose-100/60 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2.5 animate-fadeIn">
                        <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="leading-tight">{error}</span>
                    </div>
                )}

                {/* PRIMARY SECURE TERMINAL DATA FORM */}
                <form onSubmit={handleLoginSubmission} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                            Email Address Registry
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@domain.com"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                Security Credentials
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[10px] font-extrabold text-indigo-500 hover:text-indigo-700 transition duration-100 uppercase tracking-wider select-none outline-none focus:text-indigo-700"
                            >
                                {showPassword ? "Hide Mask" : "Reveal Mask"}
                            </button>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-md shadow-indigo-100/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
                        >
                            {loading ? "Verifying Parameters..." : "Verify System Credentials"}
                        </button>
                    </div>
                </form>

                {/* CORE OPERATOR REDIRECTION LINK ENTRY */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        New portal system operator?{" "}
                        <a href="#register" className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-150 underline decoration-indigo-200 underline-offset-4 decoration-2">
                            Create Master Profile
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;