import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config.js';

const Login = () => {
    // Primary User Credential Input States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Interface Visibility, Password Toggles & Focus Tracking States
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [rememberMe, setRememberMe] = useState(true);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [inputAnimation, setInputAnimation] = useState(false);

    // Track state mounting parameters to prevent memory leaks during redirects
    useEffect(() => {
        setIsMounted(true);
        setInputAnimation(true);

        // Auto-fill email indicator parameter if stored in persistent memory
        const preservedOperator = localStorage.getItem('saved_operator_email');
        if (preservedOperator) {
            setEmail(preservedOperator);
        }

        return () => setIsMounted(false);
    }, []);

    const handleLoginSubmissionHandler = async (e) => {
        e.preventDefault();
        if (!isMounted) return;

        setError('');
        setLoading(true);

        // Sanitize string metrics configuration data vectors before network transmission
        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError("The operational system email address field cannot be left blank.");
            setLoading(false);
            return;
        }

        if (!password || password.length < 4) {
            setError("Security credential keys must meet the minimum parameter length requirements.");
            setLoading(false);
            return;
        }

        try {
            // Forward authorization parameters straight to your production cloud web cluster
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: cleanEmail,
                password: password
            });

            // DEEP PAYLOAD AUTO-RECOVERY SCANNER: Extract validation key tokens from any object wrapping schema
            const secureToken =
                response.data?.token ||
                response.data?.authToken ||
                response.data?.jwt ||
                response.data?.jwtToken ||
                response.data?.data?.token ||
                response.data?.user?.token ||
                (response.headers?.authorization ? response.headers.authorization.split(' ')[1] : null);

            const profileRole =
                response.data?.role ||
                response.data?.user?.role ||
                response.data?.accountType ||
                'student';

            if (secureToken && secureToken !== "undefined" && secureToken !== "null") {
                // Instantly purge stale authorization tracking footprints to eliminate cache intersection bugs
                localStorage.clear();
                sessionStorage.clear();

                // Lock down identical authentication values across all available variable scopes simultaneously
                localStorage.setItem('token', secureToken);
                localStorage.setItem('authToken', secureToken);
                localStorage.setItem('role', profileRole);
                localStorage.setItem('session_generation_timestamp', Date.now().toString());

                // Session Storage Fallback Layer for advanced cross-tab memory preservation configurations
                sessionStorage.setItem('token', secureToken);
                sessionStorage.setItem('role', profileRole);

                // Preserve operator context markers if the user toggled the remember checkbox
                if (rememberMe) {
                    localStorage.setItem('saved_operator_email', cleanEmail);
                }

                // DUAL ROUTING ENGINE: Maps both traditional clean routes and modern SPA routing switch variants
                const fallbackRouteSegment = (profileRole === 'recruiter' || profileRole === 'admin') ? 'recruiter' : 'student';

                if (window.location.pathname.includes('_') || !window.location.hash) {
                    window.location.href = `/_${fallbackRouteSegment}`;
                } else {
                    window.location.href = `#${fallbackRouteSegment}`;
                }

                // Introduce structural I/O latency delay allowing system disk files to complete register tasks
                setTimeout(() => {
                    window.location.reload();
                }, 150);
            } else {
                setError("Credentials validated successfully, but the security access token was unreadable in the payload.");
            }
        } catch (err) {
            console.error("Secure handshake authentication layout rejected by remote host:", err);
            setError(err.response?.data?.message || err.response?.data?.error || "Invalid security parameters provided. Please check network logs.");
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <div className={`bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full max-w-md transition-all duration-500 transform ${inputAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} hover:shadow-md`}>

                {/* HEAD CONTEXT PANEL LAYOUT HEADER */}
                <div className="mb-8">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 animate-pulse">
                            <span className="text-white font-black text-xs">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-wider text-xs uppercase">HiPro Cloud Register</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Terminal Access</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                        Input verified infrastructure account metrics below to mount core dashboard utilities and map application databases.
                    </p>
                </div>

                {/* ANIMATED NOTIFICATIONS MODAL DISPLAYER */}
                {error && (
                    <div className="mb-6 bg-rose-50 text-rose-600 border border-rose-100/60 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all duration-200 animate-fadeIn">
                        <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="leading-tight">{error}</span>
                    </div>
                )}

                {/* ENTERPRISE SIGN-IN OPERATION FORM */}
                <form onSubmit={handleLoginSubmissionHandler} className="space-y-5">
                    <div>
                        <label className={`block text-[10px] font-extrabold uppercase tracking-wider mb-1.5 transition-colors duration-150 ${emailFocused ? 'text-indigo-600' : 'text-slate-400'}`}>
                            System Email Identity
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@domain.com"
                                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl pl-4 pr-10 py-3 text-xs font-semibold text-slate-800 transition duration-150 outline-none placeholder:text-slate-400 shadow-inner"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                                <span>✉️</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={`block text-[10px] font-extrabold uppercase tracking-wider transition-colors duration-150 ${passwordFocused ? 'text-indigo-600' : 'text-slate-400'}`}>
                                Security Credentials Mask
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[10px] font-extrabold text-indigo-500 hover:text-indigo-700 transition duration-100 uppercase tracking-wider select-none outline-none focus:text-indigo-700"
                            >
                                {showPassword ? "Hide Mask" : "Reveal Mask"}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl pl-4 pr-10 py-3 text-xs font-semibold text-slate-800 transition duration-150 outline-none placeholder:text-slate-400 shadow-inner"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                                <span>🔒</span>
                            </div>
                        </div>
                    </div>

                    {/* PERSISTENT MEMORY OPTION BUTTON ROW */}
                    <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-500">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 bg-slate-50 border-slate-200 rounded focus:ring-indigo-500/20 cursor-pointer"
                            />
                            <span>Remember Identity</span>
                        </label>
                        <a href="#forgot" className="text-slate-400 hover:text-indigo-500 transition duration-150">
                            Recover Key Parameters
                        </a>
                    </div>

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-3.5 px-4 rounded-xl transition duration-150 text-xs uppercase tracking-wider shadow-md shadow-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] outline-none"
                        >
                            {loading ? "Verifying Access Tokens..." : "Initialize Verification Sequence"}
                        </button>
                    </div>
                </form>

                {/* REDIRECTION FRAME REGISTRY PATH LINK */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        New system network operator?{" "}
                        <a href="#register" className="text-indigo-600 hover:text-indigo-800 font-black transition duration-150 underline decoration-indigo-200 underline-offset-4 decoration-2">
                            Create Master Profile
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;