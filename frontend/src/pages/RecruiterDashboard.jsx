import React, { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, Users, FileText, MapPin, Building } from 'lucide-react';

export const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [type, setType] = useState('Full-time');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs');
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        if (!title || !company || !location) {
            alert("Please fill in Title, Company, and Location fields.");
            return;
        }

        const jobData = { title, company, location, salary: salary || 'Competitive Pay', type, status: 'Active' };

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                const newJob = await response.json();
                setJobs([newJob, ...jobs]);
                setTitle('');
                setCompany('');
                setLocation('');
                setSalary('');
                setType('Full-time');
            }
        } catch (error) {
            console.error("Error connecting to backend API:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={24} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active Postings</p>
                        <h3 className="text-2xl font-black text-slate-900">{jobs.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Users size={24} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Verified Applicants</p>
                        <h3 className="text-2xl font-black text-slate-900">0</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FileText size={24} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Interviews Settled</p>
                        <h3 className="text-2xl font-black text-slate-900">0</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                    <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <PlusCircle size={20} className="text-blue-600" /> Post a New Job
                    </h2>
                    <form onSubmit={handlePostJob} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Job Title *</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Software Engineer" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Company Name *</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Location *</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Chennai, TN" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Salary Range</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. ₹12,00,000" value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Job Setting Tier</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm">
                            Publish Posting
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6">Your Active Openings</h2>
                    {loading ? (
                        <div className="text-center py-6 text-slate-400 font-medium">Loading records matrix...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 border border-dashed rounded-xl">No active jobs published yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div key={job._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{job.title}</h4>
                                        <div className="flex gap-3 text-xs text-slate-500 mt-1 font-medium">
                                            <span className="flex items-center gap-0.5"><Building size={12} /> {job.company}</span>
                                            <span className="flex items-center gap-0.5"><MapPin size={12} /> {job.location}</span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        {job.status || 'Active'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};