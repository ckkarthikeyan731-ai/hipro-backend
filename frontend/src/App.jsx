import React, { useState, useEffect } from 'react';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

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
      const response = await fetch('https://hipro-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (response.ok) {
        const data = await response.json();
        saveSessionAndRoute({
          name,
          role: data.role,
          token: data.token,
          id: data.id || data._id
        });
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
      const response = await fetch('https://hipro-backend.onrender.com/api/auth/login', {
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
      {/* Premium Header Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(currentUser ? currentUser.role : 'landing')}>
          <svg className="text-blue-600 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xl font-black tracking-tight text-slate-900">HiPro</span>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              {currentUser.role} Access
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
              Logout
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
        {/* Landing Terminal Screen */}
        {screen === 'landing' && (
          <div className="max-w-4xl mx-auto text-center py-24 px-4">
            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">Global Commercial Platform</span>
            <h1 className="text-5xl font-black text-slate-900 mt-6 mb-4 tracking-tight sm:text-6xl">Welcome to HiPro.</h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">The premium deployment portal engineered for 100% verified careers and secure international talent matching pipelines.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <button onClick={() => { setRole('student'); navigateTo('signup'); }} className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm">
                Enter Student Terminal
              </button>
              <button onClick={() => { setRole('recruiter'); navigateTo('signup'); }} className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all text-sm">
                Recruiter Workspace
              </button>
            </div>
          </div>
        )}

        {/* Unified Secure Account Sign-Up Screen */}
        {screen === 'signup' && (
          <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Create Account</h2>
            <p className="text-slate-400 text-xs mb-6 font-medium">Select your role classification parameters to initiate connection setup.</p>
            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-4">{authError}</div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border text-xs font-bold tracking-wide uppercase transition-all ${role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}>As Student</button>
                <button type="button" onClick={() => setRole('recruiter')} className={`py-3 rounded-xl border text-xs font-bold tracking-wide uppercase transition-all ${role === 'recruiter' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}>As Recruiter</button>
              </div>
              <div className="relative">
                <input type="text" placeholder="Full Legal Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="relative">
                <input type="email" placeholder="Email Address Identification" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <input type="password" placeholder="Secure Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors mt-2">
                Complete Registration & Login
              </button>
            </form>
          </div>
        )}

        {/* Secure Authorization Screen */}
        {screen === 'login' && (
          <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Secure Login</h2>
            <p className="text-slate-400 text-xs mb-6 font-medium">Input verified system parameters below to access core terminals.</p>
            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-4">{authError}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input type="email" placeholder="Email Address ID" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <input type="password" placeholder="Password Key" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors mt-2">
                Verify Credentials
              </button>
            </form>
          </div>
        )}

        {/* Forward Session context down to dashboards dynamically */}
        {screen === 'student' && <StudentDashboard sessionUser={currentUser} />}
        {screen === 'recruiter' && <RecruiterDashboard sessionUser={currentUser} />}

        {/* Master Admin Portal Layer */}
        {screen === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-slate-900 p-8 rounded-3xl text-white mb-10 shadow-lg border border-slate-800">
              <h1 className="text-3xl font-black">System Administrator</h1>
              <p className="text-slate-400 text-xs mt-1">Global override monitor interface active. Infrastructure monitoring nominal.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm text-center">
              <svg className="mx-auto text-blue-500 w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">Database Connection Operational</h2>
              <p className="text-slate-500 text-xs mt-2 font-medium">All real-time global pipelines, collections, and routing maps are fully synced.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}