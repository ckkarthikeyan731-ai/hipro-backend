import React, { useState, useEffect } from 'react';
// Corrected to default imports to match our premium dashboard page files
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import { Shield, Lock, Mail, User, ArrowRight, LogOut, Database } from 'lucide-react';

export default function App() {
  const getInitialScreen = () => {
    const hash = window.location.hash.replace('#', '');
    return ['landing', 'login', 'signup', 'student', 'recruiter', 'admin'].includes(hash) ? hash : 'landing';
  };

  const [screen, setScreen] = useState(getInitialScreen());
  const [role, setRole] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const savedSession = localStorage.getItem('hipro_session');
    if (savedSession) {
      const user = JSON.parse(savedSession);
      setCurrentUser(user);
      if (screen === 'landing' || screen === 'login' || screen === 'signup') {
        navigateTo(user.role);
      }
    }

    const handleHashChange = () => setScreen(getInitialScreen());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (nextScreen) => {
    setScreen(nextScreen);
    setAuthError('');
    window.location.hash = nextScreen;
  };

  const saveSessionAndRoute = (user) => {
    localStorage.setItem('hipro_session', JSON.stringify(user));
    setCurrentUser(user);
    navigateTo(user.role);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !role) {
      setAuthError('Please fill in all fields and select a role tier.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (response.ok) {
        const data = await response.json();
        // Preserving backend parameters exactly
        saveSessionAndRoute({ name, role: data.role, token: data.token, id: data.id || data._id });
      } else {
        const errData = await response.json();
        setAuthError(errData.message || 'Registration failed.');
      }
    } catch (err) {
      setAuthError('Network error connecting to global server.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please input credentials.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        saveSessionAndRoute(user);
      } else {
        setAuthError('Invalid system credentials provided.');
      }
    } catch (err) {
      setAuthError('Network error connecting to global server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hipro_session');
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setName('');
    setRole(null);
    navigateTo('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-blue-500 selection:text-white">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(currentUser ? currentUser.role : 'landing')}>
          <Shield className="text-blue-600" size={24} />
          <span className="text-xl font-black tracking-tight text-slate-900">HiPro</span>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              {currentUser.role} Access
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => navigateTo('login')} className="text-sm font-bold text-slate-600 hover:text-slate-900">Sign In</button>
            <button onClick={() => navigateTo('signup')} className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Register</button>
          </div>
        )}
      </nav>

      <main>
        {screen === 'landing' && (
          <div className="max-w-4xl mx-auto text-center py-24 px-4">
            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">Global Commercial Platform</span>
            <h1 className="text-5xl font-black text-slate-900 mt-6 mb-4 tracking-tight">Welcome to HiPro.</h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">The premium architecture deployment portal built completely for 100% verified careers and secure global connections.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => { setRole('student'); navigateTo('signup'); }} className="group px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all">
                Enter Student Terminal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => { setRole('recruiter'); navigateTo('signup'); }} className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-all">
                Recruiter Workspace
              </button>
            </div>
          </div>
        )}

        {screen === 'signup' && (
          <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm mb-6">Select your global role tier to register.</p>
            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-4">{authError}</div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border text-sm font-bold transition-all ${role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>As Student</button>
                <button type="button" onClick={() => setRole('recruiter')} className={`py-3 rounded-xl border text-sm font-bold transition-all ${role === 'recruiter' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>As Recruiter</button>
              </div>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input type="text" placeholder="Full Legal Name" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input type="email" placeholder="Email ID" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input type="password" placeholder="Password" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md mt-2">
                Complete Registration & Login
              </button>
            </form>
          </div>
        )}

        {screen === 'login' && (
          <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black mb-2">Secure Login</h2>
            <p className="text-slate-400 text-sm mb-6">Input administrative or user credentials below.</p>
            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-4">{authError}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input type="email" placeholder="Email Address ID" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input type="password" placeholder="Password" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md mt-2">
                Verify Credentials
              </button>
            </form>
          </div>
        )}

        {/* Passing session context cleanly down to premium dashboard files */}
        {screen === 'student' && <StudentDashboard sessionUser={currentUser} />}
        {screen === 'recruiter' && <RecruiterDashboard sessionUser={currentUser} />}

        {screen === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-slate-900 p-8 rounded-3xl text-white mb-10 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <Database className="text-blue-400" size={28} />
                <h1 className="text-3xl font-black">System Administrator</h1>
              </div>
              <p className="text-slate-400 text-sm">Welcome to the master control terminal. You have global override access.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm text-center">
              <Shield size={48} className="mx-auto text-blue-100 mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Database Connection Verified</h2>
              <p className="text-slate-500 mt-2">All routing and commercial pipelines are functioning nominally.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}