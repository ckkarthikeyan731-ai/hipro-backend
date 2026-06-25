import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { TrustCard } from './components/TrustCard';
import { StudentDashboard } from './pages/StudentDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { Shield, Zap, Lock } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null); // { role: 'student' | 'recruiter' }
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    // Fetches data from your backend
    fetch('http://localhost:10000/api/jobs')
      .then(r => r.json())
      .then(setJobs)
      .catch(err => console.error("Error fetching jobs:", err));

    fetch('http://localhost:10000/api/jobs/applications')
      .then(r => r.json())
      .then(setApps)
      .catch(err => console.error("Error fetching apps:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user?.role} setRole={(r) => setUser({ role: r })} />

      {/* HOME VIEW: Shown only when not logged in */}
      {!user && (
        <div className="pt-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-6xl font-black text-slate-900 mb-6">Welcome to HiPro.</h1>
            <p className="text-xl text-slate-500">The premium portal for verified careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustCard icon={Shield} title="100% Verified" description="No ghost jobs." highlight="VERIFIED" />
            <TrustCard icon={Zap} title="Smart Matching" description="AI-powered." highlight="FAST" />
            <TrustCard icon={Lock} title="Privacy First" description="Secure data." highlight="SECURE" />
          </div>
        </div>
      )}

      {/* STUDENT PORTAL */}
      {user?.role === 'student' && (
        <StudentDashboard jobs={jobs} />
      )}

      {/* RECRUITER PORTAL */}
      {user?.role === 'recruiter' && (
        <RecruiterDashboard applications={apps} />
      )}
    </div>
  );
}