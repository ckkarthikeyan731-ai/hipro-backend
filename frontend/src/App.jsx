import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Shield, Zap, Users, Lock, MessageCircle, Star, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

// --- COMPONENTS ---
const TrustCard = ({ icon: Icon, title, description, highlight }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300">
    <div className="relative z-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="font-black text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{description}</p>
      <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">{highlight}</span>
    </div>
  </div>
);

const Navigation = ({ setCurrentSection }) => (
  <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentSection('home')}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl">H</div>
        <div>
          <h1 className="font-black text-xl text-slate-900 leading-none">HiPro</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Verified Only</p>
        </div>
      </div>
      <div className="flex gap-6 items-center">
        {['home', 'jobs', 'compare'].map((item) => (
          <button key={item} onClick={() => setCurrentSection(item)} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition capitalize">
            {item === 'compare' ? 'Why Us' : item}
          </button>
        ))}
        <button onClick={() => setCurrentSection('jobs')} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition">Apply Now</button>
      </div>
    </div>
  </nav>
);

// --- MAIN APP ---
export default function App() {
  const [jobs, setJobs] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:10000/api/jobs') // Ensure port matches server.js
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navigation setCurrentSection={setCurrentSection} />

      {currentSection === 'home' && (
        <section className="pt-40 pb-20 px-6 text-center">
          <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter">Find Your Perfect Role.</h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">The job portal built for real people, not broken systems.</p>
          <button onClick={() => setCurrentSection('jobs')} className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Start Searching</button>
        </section>
      )}

      {currentSection === 'jobs' && (
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {jobs.map(job => (
                  <div key={job._id} onClick={() => setSelectedJob(job)} className="p-6 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 transition">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-blue-600 font-bold">{job.company}</p>
                    <div className="flex gap-4 mt-4 text-xs text-slate-400 font-bold">
                      <span>📍 {job.location}</span> <span>💰 {job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                {selectedJob ? (
                  <div className="sticky top-32 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-black mb-2">{selectedJob.title}</h2>
                    <p className="text-blue-600 font-bold mb-6">{selectedJob.company}</p>
                    <p className="text-slate-600 mb-6">{selectedJob.description}</p>
                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Apply Now</button>
                  </div>
                ) : <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-bold">Select a job to view details</div>}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}