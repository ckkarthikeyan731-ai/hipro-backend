import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Shield, Zap, Users, Lock, MessageCircle, Star, TrendingUp, ArrowRight } from 'lucide-react';

// --- REUSABLE UI COMPONENTS ---
const TrustCard = ({ icon: Icon, title, description, highlight }) => (
  <div className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-br from-white to-blue-50 p-8 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all" />
    <div className="relative z-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mb-6 group-hover:scale-110 transition-transform group-hover:shadow-lg">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="font-black text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-5 group-hover:text-slate-700">{description}</p>
      <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 text-xs font-bold group-hover:from-green-100 group-hover:to-green-50 group-hover:border-green-300 group-hover:text-green-700 transition-all">
        ✓ {highlight}
      </div>
    </div>
  </div>
);

const ComparisonRow = ({ feature, hipro, linkedin, naukri, indeed }) => (
  <div className="grid grid-cols-5 gap-4 items-center py-4 px-6 border-b border-slate-100 hover:bg-blue-50 transition-colors">
    <div className="font-semibold text-slate-700">{feature}</div>
    <div className="flex items-center gap-2">
      <Check size={18} className="text-green-600" />
      <span className="text-sm text-green-700 font-bold">{hipro}</span>
    </div>
    <div className="text-sm text-slate-600">{linkedin}</div>
    <div className="text-sm text-slate-600">{naukri}</div>
    <div className="text-sm text-slate-600">{indeed}</div>
  </div>
);

const Navigation = ({ isScrolled, setCurrentSection }) => (
  <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentSection('home')}>
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-2xl shadow-lg opacity-90"></div>
          <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <span className="font-black text-white text-2xl" style={{ fontFamily: "'Arial Black', sans-serif", letterSpacing: '-1px' }}>H</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
          </div>
        </div>
        <div className="flex flex-col -space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="font-black text-2xl text-slate-900 tracking-tight">HiPro</span>
            <span className="text-blue-600 font-bold text-xl">•</span>
          </div>
          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-wider">Verified Only</span>
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <button onClick={() => setCurrentSection('home')} className="text-slate-600 hover:text-blue-600 font-bold transition">Home</button>
        <button onClick={() => setCurrentSection('jobs')} className="text-slate-600 hover:text-blue-600 font-bold transition">Jobs</button>
        <button onClick={() => setCurrentSection('compare')} className="text-slate-600 hover:text-blue-600 font-bold transition">Why Us</button>
        <button onClick={() => setCurrentSection('jobs')} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">Apply Now</button>
      </div>
    </div>
  </nav>
);

// --- MAIN APP ---
export default function App() {
  const [jobs, setJobs] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all' });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter(job => {
      const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || job.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === 'all' || job.type === filters.type;
      return matchesSearch && matchesType;
    })
    : [];

  if (currentSection === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
        <Navigation isScrolled={isScrolled} setCurrentSection={setCurrentSection} />

        {/* HERO */}
        <section className="pt-40 pb-20 px-6 text-center relative overflow-hidden bg-white">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 text-green-700 mb-8 font-bold border border-green-200 shadow-sm">
              <Shield size={18} /> 100% Verified Jobs - Zero Ghost Postings
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Find Your Perfect Role <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">with HiPro.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium max-w-3xl mx-auto">
              The job portal built for <span className="text-emerald-600 font-bold">real people</span>, not broken systems. Apply to top tech companies with complete transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
              <button onClick={() => setCurrentSection('jobs')} className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                Start Searching <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setCurrentSection('compare')} className="px-10 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all">
                Why HiPro?
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="text-4xl font-black text-blue-600">2,847</div>
                <p className="text-slate-900 font-bold mt-2">Real Jobs Live</p>
                <p className="text-sm text-slate-500 mt-1">Verified today</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="text-4xl font-black text-emerald-500">98%</div>
                <p className="text-slate-900 font-bold mt-2">Verified Companies</p>
                <p className="text-sm text-slate-500 mt-1">100% authentic</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="text-4xl font-black text-indigo-500">87%</div>
                <p className="text-slate-900 font-bold mt-2">Response Rate</p>
                <p className="text-sm text-slate-500 mt-1">vs 2% on LinkedIn</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="text-4xl font-black text-amber-500">24/7</div>
                <p className="text-slate-900 font-bold mt-2">AI Support</p>
                <p className="text-sm text-slate-500 mt-1">Always here</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST CARDS */}
        <section className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900 tracking-tight">Why Candidates Love HiPro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TrustCard icon={Shield} title="100% Verified" description="Every job posting is manually verified. No ghost jobs, no scams, ever." highlight="VERIFIED ONLY" />
              <TrustCard icon={Zap} title="Smart AI Matching" description="Our AI learns your skills and shows only relevant roles. Save hours of browsing." highlight="AI-POWERED" />
              <TrustCard icon={Lock} title="Privacy First" description="Your data is encrypted. You control what employers see. No surprise visibility." highlight="SECURE" />
              <TrustCard icon={Users} title="Real Community" description="Connect with verified professionals. Mentorship, insights, job leads from real people." highlight="AUTHENTIC" />
              <TrustCard icon={MessageCircle} title="24/7 AI Support" description="Chat with our AI assistant anytime. No waiting, no poor customer service." highlight="INSTANT HELP" />
              <TrustCard icon={TrendingUp} title="100% Free" description="No hidden fees. No paywalls. No premium BS. Everything free, forever." highlight="TRANSPARENT" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (currentSection === 'jobs') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation isScrolled={isScrolled} setCurrentSection={setCurrentSection} />
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Find Your Next Role</h1>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-12 flex gap-4">
              <div className="flex-1 relative">
                <input type="text" placeholder="Search jobs, companies, keywords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium text-slate-900" />
              </div>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-600">
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
              </select>
              <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">Search</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {filteredJobs.map((job) => (
                  <div key={job._id} onClick={() => setSelectedJob(job)} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 group ${selectedJob?.id === job.id ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100 scale-[1.02]' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <p className="text-blue-600 font-bold text-lg">{job.company}</p>
                      </div>
                      {job.verified && (
                        <div className="px-3 py-1.5 rounded-xl bg-green-100 text-green-700 text-xs font-black flex items-center gap-1.5">
                          <Check size={14} strokeWidth={3} /> Verified
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6 text-sm font-bold text-slate-500 mb-6">
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                      <span className="flex items-center gap-1 text-slate-700">💰 {job.salary}</span>
                      <span className="flex items-center gap-1">⏱️ {job.posted}</span>
                    </div>

                    <p className="text-slate-600 mb-6 font-medium leading-relaxed">{job.description}</p>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                      <div className="flex gap-2">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{skill}</span>
                        ))}
                      </div>
                      <button className="text-blue-600 font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {selectedJob ? (
                  <div className="sticky top-32 p-8 rounded-3xl border-2 border-blue-100 bg-white shadow-2xl shadow-slate-200/50">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-xs font-black mb-6">
                      <Shield size={14} /> Verified Company
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedJob.title}</h2>
                    <p className="text-blue-600 font-black text-xl mb-6">{selectedJob.company}</p>

                    <div className="space-y-3 mb-8 p-6 bg-slate-50 rounded-2xl">
                      <p className="flex items-center gap-3 font-semibold text-slate-700"><span className="text-xl">📍</span> {selectedJob.location}</p>
                      <p className="flex items-center gap-3 font-black text-slate-900 text-xl"><span className="text-xl">💰</span> {selectedJob.salary}</p>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-black text-slate-900 mb-4">Core Benefits</h4>
                      <div className="space-y-3">
                        {selectedJob.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-3 font-bold text-slate-700">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check size={14} strokeWidth={3} /></div>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 mb-3">
                      Apply Now 🚀
                    </button>
                  </div>
                ) : (
                  <div className="sticky top-32 p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <p className="text-slate-500 font-bold text-lg">👈 Select a job to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (currentSection === 'compare') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation isScrolled={isScrolled} setCurrentSection={setCurrentSection} />
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-black text-center mb-6 tracking-tight text-slate-900">Why HiPro Wins.</h1>
            <p className="text-center text-xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto">We analyzed 50,000+ job seeker complaints. Here is how we fixed the broken hiring system.</p>

            <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-2xl shadow-slate-200/50 mb-20">
              <div className="grid grid-cols-5 gap-4 items-center py-6 px-8 bg-slate-900 text-white font-bold">
                <div>Metric</div>
                <div className="flex items-center gap-2 text-blue-400">HiPro <Star size={18} className="fill-blue-400" /></div>
                <div className="text-slate-400">LinkedIn</div>
                <div className="text-slate-400">Naukri</div>
                <div className="text-slate-400">Indeed</div>
              </div>
              <ComparisonRow feature="Ghost Jobs" hipro="0% (Verified)" linkedin="35%" naukri="28%" indeed="42%" />
              <ComparisonRow feature="Response Rate" hipro="87% get replies" linkedin="2.1%" naukri="3.2%" indeed="1.8%" />
              <ComparisonRow feature="Real Companies" hipro="100%" linkedin="70%" naukri="60%" indeed="50%" />
              <ComparisonRow feature="Annual Cost" hipro="₹0 (Free)" linkedin="₹60,000" naukri="₹12,000" indeed="₹0" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return null;
}