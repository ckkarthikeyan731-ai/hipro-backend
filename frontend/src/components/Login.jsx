import React, { useState } from 'react';

export const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="flex justify-center items-center pt-20">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-black mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="karthikeyan@stjosephs.ac.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};