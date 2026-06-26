import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config.js'; // Dynamically pulls https://hipro-backend.onrender.com/api

const Login = () => {
    // Component Input States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // UI Interaction States
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginSubmission = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Sanity check input parameter compliance before initiating network loops
        if (!email.trim() || !password.trim()) {
            setError("All system credential fields must be filled completely.");
            setLoading(false);
            return;
        }

        try {
            // Initiate the secure authentication request to your live Render server domain
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: email.trim(),
                password: password
            });

            // Extract token layers from any common backend object parameter key variation
            const incomingToken = response.data?.token || response.data?.authToken || response.data?.jwtToken;
            const userRole = response.data?.role || 'student';

            if (incomingToken) {
                // Clear any lingering session cache fragments out of the browser memory registers
                localStorage.clear();

                // Save under both variations to ensure absolute multi-dashboard feature mapping compatibility
                localStorage.setItem('token', incomingToken);
                localStorage.setItem('authToken', incomingToken);
                localStorage.setItem('role', userRole);

                // Seamless path routing evaluation based on the authenticated profile layer parameters
                if (userRole === 'recruiter') {
                    window.location.href = '#recruiter';
                } else {
                    window.location.href = '#student';
                }

                // Force state cache reload to ensure routing frameworks capture the new token variables
                window.location.reload();
            } else {
                setError("Authentication succeeded, but the validation token structure was missing from the response matrix.");
            }
        } catch (err) {
            console.error("Authentication handshake rejected by remote server:", err);
            // Formulates error logs that match the layout design visible in your tracking images
            setError(err.response?.data?.message || "Invalid system credentials provided.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans antialiased">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full max-w-md transition-all duration-200 hover:shadow-md">

                {/* BRAND HEADER LAYOUT PANEL */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
                            <span className="text-white font-black text-[10px]">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-sm">HiPro Portal System</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Login</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                        Input verified system parameters below to access core terminals and real-time database feeds.
                    </p>
                </div>

                {/* ERROR NOTIFICATION PANEL ROW */}
                {error && (
                    <div className="mb-5 bg-rose-50 text-rose-600 border border-rose-100/60 px-4 py-3 rounded-xl text-xs font-bold transition duration-150 animate-pulse flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* PRIMARY INTERACTION AUTHENTICATION FORM */}
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
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none shadow-inner"
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
                                className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 select-none outline-none"
                            >
                                {showPassword ? "Hide Parameter" : "Reveal Parameter"}
                            </button>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none shadow-inner"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-md shadow-indigo-100 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {loading ? "Verifying Parameters..." : "Verify System Credentials"}
                        </button>
                    </div>
                </form>

                {/* REDIRECTION SYSTEM LINK PATH */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        New system operator?{" "}
                        <a href="#register" className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-150 underline decoration-indigo-200 underline-offset-4">
                            Create Master Profile
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;