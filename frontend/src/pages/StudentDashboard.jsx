import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import API_URL from '../config.js';

const StudentDashboard = () => {
    // Primary Platform Arrays & Search Context Registries
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'tracking'

    // Form Modal Interface Overlay Controls
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthWarningOpen, setIsAuthWarningOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // DUAL TOKEN RESOLVER: Deep scans both storage banks to guard against data dropping
    const fetchActiveSessionToken = () => {
        const token = localStorage.getItem('token') ||
            localStorage.getItem('authToken') ||
            sessionStorage.getItem('token');
        return (token && token !== "undefined" && token !== "null") ? token : null;
    };

    // Synchronize full platform datasets cleanly on mount loops
    useEffect(() => {
        let isDashboardActive = true;

        const loadMasterPlatformRegistry = async () => {
            try {
                // 1. Fetch live jobs directory array from open API registry path
                const jobsResponse = await axios.get(`${API_URL}/jobs`);
                if (isDashboardActive) {
                    setJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);
                }

                // 2. Fetch specific tracking array elements only if session is active
                const targetToken = fetchActiveSessionToken();
                if (targetToken) {
                    const appsResponse = await axios.get(`${API_URL}/jobs/my-applications`, {
                        headers: { Authorization: `Bearer ${targetToken}` }
                    });
                    if (isDashboardActive) {
                        setMyApplications(Array.isArray(appsResponse.data) ? appsResponse.data : []);
                    }
                }
            } catch (err) {
                console.error("Dashboard master indexing sync handled silently:", err);
            } finally {
                if (isDashboardActive) setLoading(false);
            }
        };

        loadMasterPlatformRegistry();
        return () => { isDashboardActive = false; };
    }, []);

    // Highly performant client-side query search matrix filter
    const filteredJobsRegistry = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return jobs;
        return jobs.filter(job =>
            job.title?.toLowerCase().includes(query) ||
            job.company?.toLowerCase().includes(query) ||
            job.location?.toLowerCase().includes(query) ||
            job.type?.toLowerCase().includes(query)
        );
    }, [jobs, searchQuery]);

    // Open file attachment interface with inline security modal checks (No Alerts)
    const handleApplicationModalTrigger = (jobId) => {
        const sessionToken = fetchActiveSessionToken();
        if (!sessionToken) {
            setSelectedJobId(jobId);
            setIsAuthWarningOpen(true); // Open custom inline popup warning card dynamically
            return;
        }
        setSelectedJobId(jobId);
        setFormError('');
        setIsModalOpen(true);
    };

    // Terminate browser authentication states and return to secure portal root gateway
    const handleSessionTeardown = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.pathname.includes('_') ? '/_login' : '#login';
        window.location.reload();
    };

    // Process multipart HTTP POST data configurations safely to disk arrays
    const handleApplicationFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!resumeFile) {
            setFormError("A professional document file attachment (PDF/DOCX) is required.");
            return;
        }

        setSubmitLoading(true);
        try {
            const activeToken = fetchActiveSessionToken();

            // Hard session token verification right before network payload execution
            if (!activeToken) {
                setSubmitLoading(false);
                setIsModalOpen(false);
                setIsAuthWarningOpen(true);
                return;
            }

            const multipartPayload = new FormData();
            multipartPayload.append('jobId', selectedJobId);
            multipartPayload.append('coverLetter', coverLetter.trim());
            multipartPayload.append('resume', resumeFile);

            const response = await axios.post(`${API_URL}/jobs/apply`, multipartPayload, {
                headers: {
                    Authorization: `Bearer ${activeToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(false);
                setCoverLetter('');
                setResumeFile(null);

                // Re-fetch tracking datatable counters to render submission confirmation badge live
                const refreshResponse = await axios.get(`${API_URL}/jobs/my-applications`, {
                    headers: { Authorization: `Bearer ${activeToken}` }
                });
                setMyApplications(Array.isArray(refreshResponse.data) ? refreshResponse.data : []);

                alert("Application portfolio placed successfully into the pipeline log register!");
            }
        } catch (err) {
            console.error("Application placement tracking exception:", err);
            setFormError(err.response?.data?.message || "Multipart database packaging and routing transaction failed.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Compute metrics arrays for user summary displays
    const analyticsMetrics = useMemo(() => {
        const total = myApplications.length;
        const approved = myApplications.filter(a => a.status === 'Accepted' || a.status === 'Approved').length;
        const pending = myApplications.filter(a => a.status === 'Pending' || !a.status).length;
        return { total, approved, pending };
    }, [myApplications]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-black text-slate-400 tracking-wider uppercase">Compiling core platform registries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 relative font-sans antialiased selection:bg-indigo-500 selection:text-white">

            {/* PLATFORM NAVIGATION BLOCK BRANDBAR */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                            <span className="text-white font-black text-sm">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-base uppercase tracking-wide">HiPro Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-flex text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/40">
                            Verified Student Operator
                        </span>
                        <button
                            onClick={handleSessionTeardown}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/60 font-black px-4 py-2 rounded-xl transition duration-150 text-xs shadow-sm shadow-rose-100/20"
                        >
                            Log Out Session
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN MARKETING HERO PANEL BLOCK DISPLAY */}
            <div className="bg-[#0f172a] text-white px-6 py-16 md:px-12 md:py-20 shadow-inner">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20">
                                Talent Ecosystem Terminal
                            </span>
                            <h1 className="text-3xl font-black tracking-tight sm:text-5xl mt-4 max-w-xl leading-tight">Find Your Next Horizon</h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-3 max-w-2xl leading-relaxed">
                                Browse active global opportunities, submit your verified professional portfolio documentation, and track processing evaluation status cycles cleanly.
                            </p>
                        </div>

                        {/* Interactive Tab Toggle Modules */}
                        <div className="flex bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/30 self-start lg:self-center whitespace-nowrap shadow-inner">
                            <button
                                onClick={() => setActiveTab('browse')}
                                className={`px-5 py-2.5 text-xs font-black rounded-xl transition duration-150 uppercase tracking-wider ${activeTab === 'browse' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                Browse Openings
                            </button>
                            <button
                                onClick={() => setActiveTab('tracking')}
                                className={`px-5 py-2.5 text-xs font-black rounded-xl transition duration-150 uppercase tracking-wider ${activeTab === 'tracking' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                Pipeline Tracker ({myApplications.length})
                            </button>
                        </div>
                    </div>

                    {/* Live Query Matrix Filter Searchbox row */}
                    {activeTab === 'browse' && (
                        <div className="mt-10 max-w-lg relative animate-fadeIn">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, company, or location (e.g., software developer)..."
                                className="w-full bg-slate-800/40 border border-slate-700/40 focus:border-indigo-500 focus:bg-slate-900 rounded-2xl pl-5 pr-12 py-4 text-xs font-semibold text-white placeholder-slate-500 transition duration-150 outline-none shadow-inner"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PIPELINE DASHBOARD STATISTICAL SUMMARY CARDS GRID ROW */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Active Submissions</p>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{analyticsMetrics.total}</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Under Active Review</p>
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{analyticsMetrics.pending}</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">Approved Placement Selections</p>
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                    <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{analyticsMetrics.approved}</p>
                </div>
            </div>

            {/* CONFIGURABLE MAIN RENDER WORKSPACE HOUSING VIEW CORES */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24">

                {activeTab === 'browse' ? (
                    /* SUB-VIEW CONTAINER CORE A: RENDER JOBS GRID BLOCK */
                    filteredJobsRegistry.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-20 text-center shadow-sm max-w-md mx-auto animate-scaleUp">
                            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 text-slate-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-black text-slate-800 tracking-tight">No Matched Records Located</h3>
                            <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                                No job entries matched your parameters inside the active cluster board. Try expanding your search queries.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            {filteredJobsRegistry.map((job) => {
                                const hasUserAlreadyApplied = myApplications.some(app => app.jobId?._id === job._id);
                                return (
                                    <div key={job._id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group border-t-2 focus-within:border-t-indigo-500">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="font-black text-slate-900 tracking-tight text-base leading-snug group-hover:text-indigo-600 transition duration-150">{job.title}</h3>
                                                    <p className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-wider">{job.company}</p>
                                                </div>
                                                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                                                    {job.type || 'Full-Time'}
                                                </span>
                                            </div>
                                            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 font-semibold text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {job.location || 'Remote/Global'}
                                                </div>
                                                {job.salary && (
                                                    <div className="flex items-center font-extrabold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-100/60 text-[11px]">
                                                        ₹ {job.salary}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => handleApplicationModalTrigger(job._id)}
                                                disabled={hasUserAlreadyApplied}
                                                className={`w-full font-black py-3 px-4 rounded-xl transition duration-150 text-xs uppercase tracking-wider shadow-sm
                                                    ${hasUserAlreadyApplied
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed shadow-none'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
                                            >
                                                {hasUserAlreadyApplied ? "✓ Position Package Submitted" : "Apply to Position"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    /* SUB-VIEW CONTAINER CORE B: PIPELINE MONITOR TRACKING DATATABLE */
                    myApplications.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-20 text-center shadow-sm max-w-md mx-auto animate-scaleUp">
                            <h3 className="text-sm font-black text-slate-800 tracking-tight">No Active Placements Running</h3>
                            <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                                You haven't initialized any profile application sequences. Active tracking logs appear automatically here upon submission.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                            <th className="p-4 pl-6">Target Corporate Position</th>
                                            <th className="p-4">Geographic Area</th>
                                            <th className="p-4">Submission Date</th>
                                            <th className="p-4">Attached Dossier</th>
                                            <th className="p-4 pr-6 text-center">Pipeline Evaluation Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                        {myApplications.map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/30 transition-all duration-150">
                                                <td className="p-4 pl-6">
                                                    <p className="font-black text-slate-800 text-sm leading-tight">{app.jobId?.title || "Archived Corporate Position"}</p>
                                                    <p className="text-[10px] font-extrabold text-indigo-600 mt-0.5 uppercase tracking-wider">{app.jobId?.company || "N/A Group"}</p>
                                                </td>
                                                <td className="p-4 text-slate-500 font-medium">{app.jobId?.location || "Global"}</td>
                                                <td className="p-4 text-slate-400 font-medium">
                                                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                                                </td>
                                                <td className="p-4">
                                                    {app.resumeUrl ? (
                                                        <a
                                                            href={`${API_URL.replace('/api', '')}/${app.resumeUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-800 font-black underline text-[11px] uppercase tracking-wide inline-flex items-center gap-0.5"
                                                        >
                                                            Open File
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-300 italic font-normal">No File Attached</span>
                                                    )}
                                                </td>
                                                <td className="p-4 pr-6 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                                                        ${app.status === 'Accepted' || app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : ''}
                                                        ${app.status === 'Rejected' || app.status === 'Declined' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : ''}
                                                        ${app.status === 'Pending' || !app.status ? 'bg-amber-50 text-amber-700 border-amber-200/50' : ''}
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
            </main>

            {/* DYNAMIC APPLICATION INTERFACE LAYER A: MULTIPART RESUME SUBMISSION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl w-full max-w-md animate-scaleUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-base font-black text-slate-900 tracking-tight">Complete Application Details</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-black text-sm p-1">✕</button>
                        </div>

                        {formError && (
                            <div className="mb-4 bg-rose-50 text-rose-600 border border-rose-100/60 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleApplicationFormSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Professional Cover Statement</label>
                                <textarea
                                    rows="4"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Provide brief introduction context explaining your skills mapping suitability..."
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none resize-none transition duration-150 leading-relaxed placeholder:text-slate-400 shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Upload Digital Resume (PDF, DOCX) *</label>
                                <input
                                    type="file"
                                    required
                                    accept=".pdf,.docx,.doc"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:uppercase file:tracking-wider file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150 cursor-pointer"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-3.5 px-4 rounded-xl transition duration-150 text-xs uppercase tracking-wider shadow-md shadow-indigo-100 pt-3.5"
                            >
                                {submitLoading ? "Uploading Dossier Frameworks..." : "Submit Completed File Ledger"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DYNAMIC APPLICATION INTERFACE LAYER B: CUSTOM VISUAL AUTH WARNING MODAL */}
            {isAuthWarningOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl w-full max-w-sm text-center animate-scaleUp">
                        <div className="mx-auto w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 mb-4 animate-bounce">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-black text-slate-900 text-base tracking-tight">Operator Authentication Required</h3>
                        <p className="text-xs text-slate-400 font-medium mt-2 px-3 leading-relaxed">
                            Your security profile token session tracker is missing. Please log in first to enable the upload of multi-part file payloads.
                        </p>
                        <div className="mt-6 space-y-2">
                            <button
                                onClick={() => { localStorage.clear(); window.location.href = '#login'; window.location.reload(); }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-150 shadow-md shadow-indigo-100"
                            >
                                Route to Secure Login
                            </button>
                            <button
                                onClick={() => setIsAuthWarningOpen(false)}
                                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-400 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-150 border border-slate-100"
                            >
                                Return to Feed Board
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;