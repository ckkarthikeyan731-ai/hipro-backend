import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: email,
                password: password
            });

            // 1. Extract the token value dynamically out of any common response field variation
            const incomingToken = response.data?.token || response.data?.authToken || response.data?.jwtToken;
            const userRole = response.data?.role || 'student';

            if (incomingToken) {
                // 2. Clear out old entries to prevent session contamination
                localStorage.clear();

                // 3. Save under all common key variations so every frontend file reads it correctly
                localStorage.setItem('token', incomingToken);
                localStorage.setItem('authToken', incomingToken);
                localStorage.setItem('role', userRole);

                // 4. Smooth client routing redirection
                if (userRole === 'recruiter') {
                    window.location.href = '#recruiter';
                } else {
                    window.location.href = '#student';
                }

                window.location.reload();
            } else {
                setError("Authentication succeeded but no token structure was found in response.");
            }
        } catch (err) {
            console.error("Authentication handshake rejected:", err);
            setError(err.response?.data?.message || "Invalid system credentials provided.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Login</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Input verified system parameters below to access core terminals.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-rose-50 text-rose-600 border border-rose-100 px-4 py-3 rounded-xl text-xs font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@domain.com"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                            Security Credentials
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium text-slate-800 transition duration-150 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-md mt-2"
                    >
                        {loading ? "Verifying..." : "Verify Credentials"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;