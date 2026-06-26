import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config.js';

const Login = () => {
    // Structural Input Data Registries
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // UI Visibility & Focus Flags
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleLoginSubmission = async (e) => {
        e.preventDefault();
        if (!isMounted) return;

        setError('');
        setLoading(true);

        const cleanEmail = email.trim();
        if (!cleanEmail || !password) {
            setError("All terminal access parameters must be completed.");
            setLoading(false);
            return;
        }

        try {
            // Post authorization metrics directly to live Render backend production servers
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: cleanEmail,
                password: password
            });

            // DEEP PAYLOAD SCANNER: Parses every possible JSON response structure for JWT variations
            const extractedToken =
                response.data?.token ||
                response.data?.authToken ||
                response.data?.jwt ||
                response.data?.jwtToken ||
                response.data?.data?.token ||
                response.data?.user?.token ||
                (response.headers?.authorization ? response.headers.authorization.split(' ')[1] : null);

            const userRole =
                response.data?.role ||
                response.data?.user?.role ||
                response.data?.accountType ||
                'student';

            if (extractedToken && extractedToken !== "undefined") {
                // Securely purge old operational footprints to prevent state cross-contamination
                localStorage.clear();
                sessionStorage.clear();

                // Lock keys across all common application namespaces simultaneously
                localStorage.setItem('token', extractedToken);
                localStorage.setItem('authToken', extractedToken);
                localStorage.setItem('role', userRole);
                localStorage.setItem('session_timestamp', Date.now().toString());

                // Fallback backup onto SessionStorage in case local scope is restricted or blocked
                sessionStorage.setItem('token', extractedToken);
                sessionStorage.setItem('role', userRole);

                // PATH EVALUATOR: Automatically handles standard hash paths or custom clean paths
                const targetRoute = (userRole === 'recruiter' || userRole === 'admin') ? 'recruiter' : 'student';

                if (window.location.pathname.includes('_') || !window.location.hash) {
                    window.location.href = `/_${targetRoute}`;
                } else {
                    window.location.href = `#${targetRoute}`;
                }

                // Small explicit execution frame buffer delay ensuring I/O tasks write cleanly to disk
                setTimeout(() => {
                    window.location.reload();
                }, 150);
            } else {
                setError("Credentials validated, but the authorization token layout failed to extract from the payload matrix.");
            }
        } catch (err) {
            console.error("Authentication handshake protocol rejected by cloud host platform:", err);
            setError(err.response?.data?.message || err.response?.data?.error || "Invalid system verification credentials provided.");
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full max-w-md transition-all duration-300 hover:shadow-md">

                {/* HEAD CONTEXT PANEL HEADER */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
                            <span className="text-white font-black text-[10px]">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-xs uppercase tracking-wider">HiPro Registry Terminal</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Login</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                        Input verified account parameters below to mount core system profiles and access real-time cloud data streams.
                    </p>
                </div>

                {/* VISUAL ALERTS BANNER LAYER */}
                {error && (
                    <div className="mb-5 bg-rose-50 text-rose-600 border border-rose-100/60 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                        <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="leading-tight">{error}</span>
                    </div>
                )}

                {/* CORE OPERATIONAL DATA FORM INPUTS */}
                <form onSubmit={handleLoginSubmission} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                            Email Address Parameter
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
                                Security Credentials Mask
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[10px] font-extrabold text-indigo-500 hover:text-indigo-700 transition duration-100 uppercase tracking-wider select-none outline-none"
                            >
                                {showPassword ? "Hide Field" : "Reveal Field"}
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
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-md shadow-indigo-100/60 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {loading ? "Verifying Parameters..." : "Verify System Credentials"}
                        </button>
                    </div>
                </form>

                {/* ACCOUNT RE-ROUTING OPTION FOOTER */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        New system operator?{" "}
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