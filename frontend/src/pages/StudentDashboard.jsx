import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Search, MapPin, Building, AlertCircle } from 'lucide-react';

export const StudentDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [applications, setApplications] = useState([
        { id: 101, title: 'Python Developer', company: 'ZOHO Corp', status: 'Under Review' },
        { id: 102, title: 'Backend Support', company: 'Infosys', status: 'Shortlisted' }
    ]);

    useEffect(() => {
        const fetchLiveJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/jobs');
                if (!response.ok) throw new Error('Failed to load listings.');
                const data = await response.json();
                setJobs(data);
            } catch (err) {
                console.error("Error reading data:", err);
                setError("Unable to connect to live job feed. Displaying safe local backup data.");
                setJobs([
                    { _id: 'f1', title: 'Software Engineer Intern', company: 'Google', location: 'Bengaluru', type: 'Full-time', salary: '₹12,00,000 / yr' },
                    { _id: 'f2', title: 'Frontend Developer', company: 'TCS', location: 'Chennai', type: 'Remote', salary: '₹6,50,000 / yr' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveJobs();
    }, []);

    const handleApply = (jobTitle, companyName) => {
        alert(`Successfully applied for ${jobTitle} at ${companyName}!`);
        const newApp = { id: Date.now(), title: jobTitle, company: companyName, status: 'Applied' };
        setApplications([newApp, ...applications]);
    };

    const filteredJobs = jobs.filter(job =>
        (job.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white mb-10 shadow-lg">
                <h1 className="text-3xl font-black mb-2">Welcome Back, Karthikeyan</h1>
                <p className="text-blue-100 mb-6 text-sm">Explore premium opportunities tailored to your technology profile.</p>

                <div className="relative max-w-xl">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Type role, company or location to filter live..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 font-medium text-sm shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-semibold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase size={22} className="text-blue-600" /> Available Openings ({filteredJobs.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-6 text-slate-400 font-medium">Loading live feeds...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-slate-500 bg-white p-10 rounded-2xl border text-center font-medium">
                            No matching postings verified inside your MongoDB records.
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{job.type}</span>
                                        <span className="text-sm font-bold text-emerald-600">{job.salary}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-1">
                                        <span className="flex items-center gap-1"><Building size={14} /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleApply(job.title, job.company)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                                    Apply Now
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                    <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-emerald-600" /> Track Applications
                    </h2>
                    <div className="divide-y divide-slate-100">
                        {applications.map((app) => (
                            <div key={app.id} className="py-3.5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{app.title}</p>
                                    <p className="text-xs text-slate-500 font-medium">{app.company}</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                                        app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};