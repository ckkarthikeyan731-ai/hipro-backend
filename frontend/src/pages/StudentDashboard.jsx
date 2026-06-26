import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config.js'; // Routes directly to your live backend domain

const StudentDashboard = () => {
    // Core Application States
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'tracking'

    // Modal & Multipart Upload States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Fetch initial data completely silently on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch available jobs registry (Public endpoint - no token needed)
                const jobsResponse = await axios.get(`${API_URL}/jobs`);
                setJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);

                // 2. Fetch student's applications ledger only if a token exists
                const token = localStorage.getItem('token');
                if (token) {
                    const appsResponse = await axios.get(`${API_URL}/jobs/my-applications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMyApplications(Array.isArray(appsResponse.data) ? appsResponse.data : []);
                }
            } catch (err) {
                // All background errors are logged silently to the console—never alerting the user
                console.error("Background data synchronization handled silently:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Client-side text matrix filtering
    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open upload form modal with an explicit user check on click
    const openApplyModal = (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to your student account to submit applications.");
            window.location.href = '#login';
            return;
        }
        setSelectedJobId(jobId);
        setIsModalOpen(true);
    };

    // Process multipart form attachment uploads to backend disk storage
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please attach a valid resume document file (PDF/DOCX).");
            return;
        }

        setSubmitLoading(true);
        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('jobId', selectedJobId);
            formData.append('coverLetter', coverLetter);
            formData.append('resume', resumeFile);

            const response = await axios.post(`${API_URL}/jobs/apply`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert("Application submitted successfully to the pipeline ledger!");
                setIsModalOpen(false);
                setCoverLetter('');
                setResumeFile(null);

                // Re-fetch tracking matrix records cleanly
                const appsResponse = await axios.get(`${API_URL}/jobs/my-applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMyApplications(Array.isArray(appsResponse.data) ? appsResponse.data : []);
            }
        } catch (err) {
            console.error("Application placement transaction failed:", err);
            alert(err.response?.data?.message || "Failed to finalize application routing.");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-slate-400 tracking-wider uppercase">Loading Core Job Indices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 relative">
            {/* Dark Top Hero Section */}
            <div className="bg-[#0f172a] text-white px-6 py-16 md:px-12 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20">
                                Talent Ecosystem
                            </span>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl mt-4">Find Your Next Horizon</h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2 max-w-2xl">
                                Browse real-time global opportunities, submit your verified professional metrics, and track evaluation cycles seamlessly.
                            </p>
                        </div>

                        {/* Interactive View Toggles */}
                        <div className="flex bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/30 self-start md:self-center whitespace-nowrap">
                            <button
                                onClick={() => setActiveTab('browse')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 ${activeTab === 'browse' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Browse Jobs
                            </button>
                            <button
                                onClick={() => setActiveTab('tracking')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 ${activeTab === 'tracking' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Track Applications ({myApplications.length})
                            </button>
                        </div>
                    </div>

                    {/* Search Field Interface */}
                    {activeTab === 'browse' && (
                        <div className="mt-8 max-w-md relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="software developer"
                                className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500 focus:bg-slate-900 rounded-2xl pl-5 pr-12 py-3.5 text-sm font-medium text-white placeholder-slate-500 transition duration-150 outline-none shadow-inner"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Render Output Content Spaces */}
            <div className="max-w-6xl mx-auto p-6 md:p-12 -mt-8">

                {activeTab === 'browse' ? (
                    /* VIEW PANEL A: BROWSE OPEN REPOS */
                    filteredJobs.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
                            <p className="text-sm font-bold text-slate-800">No Matched Records Found</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Try modifying your search keywords or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredJobs.map((job) => {
                                const hasApplied = myApplications.some(app => app.jobId?._id === job._id);
                                return (
                                    <div key={job._id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="font-black text-slate-900 tracking-tight text-base">{job.title}</h3>
                                                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{job.company}</p>
                                                </div>
                                                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                                    {job.type}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-4 text-slate-400 font-medium text-xs">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {job.location}
                                                </div>
                                                {job.salary && <div className="font-bold text-slate-600">₹ {job.salary}</div>}
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => openApplyModal(job._id)}
                                                disabled={hasApplied}
                                                className={`w-full font-bold py-2.5 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-sm
                                                    ${hasApplied
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 cursor-not-allowed shadow-none'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                            >
                                                {hasApplied ? "✓ Application Submitted" : "Apply Position"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    /* VIEW PANEL B: TRACKING MONITOR INTERFACE */
                    myApplications.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
                            <p className="text-sm font-bold text-slate-800">No Applications Filed Yet</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Active listings will appear here once submitted.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="p-4 pl-6">Company / Position</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Submission Date</th>
                                            <th className="p-4 pr-6 text-center">Status Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                        {myApplications.map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <p className="font-bold text-slate-800">{app.jobId?.title || "Archived Role"}</p>
                                                    <p className="text-[10px] font-bold text-indigo-600 mt-0.5">{app.jobId?.company || "N/A"}</p>
                                                </td>
                                                <td className="p-4 text-slate-500">{app.jobId?.location || "N/A"}</td>
                                                <td className="p-4 text-slate-400">
                                                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                                                </td>
                                                <td className="p-4 pr-6 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                        ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' : ''}
                                                        ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200/40' : ''}
                                                        ${app.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/40' : ''}
                                                    `}>
                                                        {app.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* SINGLE ATTACHMENT MODAL FORM COMPONENT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-base font-black text-slate-900 tracking-tight">Complete Application Details</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Cover Statement</label>
                                <textarea
                                    rows="3"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Brief introduction on why you are ideal for this target role..."
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 outline-none resize-none transition duration-150"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Upload Resume (PDF, DOCX) *</label>
                                <input
                                    type="file"
                                    required
                                    accept=".pdf,.docx,.doc"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    className="w-full text-xs font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 cursor-pointer"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition duration-150 text-xs tracking-wide shadow-md mt-4"
                            >
                                {submitLoading ? "Uploading Attachments..." : "Submit Completed File Ledger"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;