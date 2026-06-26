import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config.js'; // Dynamically pulls https://hipro-backend.onrender.com/api

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
            // Force the authentication request directly to your live production server
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: email,
                password: password
            });

            if (response.data && response.data.token) {
                // Secure your session tokens inside local storage registers
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role); // Expected values: 'student' or 'recruiter'

                // Seamless route evaluation based on the authenticated profile parameters
                if (response.data.role === 'recruiter') {
                    window.location.href = '#recruiter';
                } else {
                    window.location.href = '#student';
                }

                // Force reload if your frontend routing framework relies on direct window state audits
                window.location.reload();
            }
        } catch (err) {
            console.error("Authentication handshake rejected:", err);
            // Matches the system response design layout visible in your image logs
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
                    <div className="mb-4 bg-rose-50 text-rose-600 border border-rose-100 px-4 py-3 rounded-xl text-xs font-bold transition duration-150 animate-pulse">
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