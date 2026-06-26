import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import API_URL from '../config.js'; // Dynamically pulls your backend domain destination path

const RecruiterDashboard = () => {
    // Structural System State Matrices
    const [postedJobs, setPostedJobs] = useState([]);
    const [incomingApplications, setIncomingApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'publish' | 'pipeline'

    // Form Configuration Data States
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [type, setType] = useState('Full-Time');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    // UI Interactive Selection Filter Contexts
    const [appFilter, setAppFilter] = useState('All'); // 'All' | 'Pending' | 'Accepted' | 'Rejected'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
    const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);

    // Meticulous database sync engine
    const loadMasterRecruiterDataTerminal = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            const headersConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            // 1. Compile all jobs listed across backend databases
            const jobsResponse = await axios.get(`${API_URL}/jobs`);
            setPostedJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);

            // 2. Fetch live incoming application packages submitted by candidates
            const appsResponse = await axios.get(`${API_URL}/jobs/applications`, headersConfig);
            setIncomingApplications(Array.isArray(appsResponse.data) ? appsResponse.data : []);

        } catch (err) {
            console.error("Recruiter terminal master synchronization process failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMasterRecruiterDataTerminal();
    }, []);

    // Process fresh job distribution publishing pipelines
    const handlePublishJobPosting = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        if (!title.trim() || !company.trim() || !location.trim()) {
            setFormMessage({ type: 'error', text: 'All essential operational metadata parameters must be specified.' });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/jobs/create`, {
                title: title.trim(),
                company: company.trim(),
                location: location.trim(),
                salary: salary.trim(),
                type,
                description: description.trim(),
                requirements: requirements.trim()
            });

            if (response.status === 200 || response.status === 201) {
                setFormMessage({ type: 'success', text: 'Operational metric parameters successfully mapped to public board index.' });

                // Clear state field buffers cleanly
                setTitle('');
                setCompany('');
                setLocation('');
                setSalary('');
                setDescription('');
                setRequirements('');

                // Live fetch refresh data arrays without hard flashing redirections
                const jobsRes = await axios.get(`${API_URL}/jobs`);
                setPostedJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
            }
        } catch (err) {
            console.error("Job compilation posting failure:", err);
            setFormMessage({ type: 'error', text: 'Handshake protocol rejected posting parameters storage allocation.' });
        }
    };

    // Commit state transformations live to MongoDB documents (Accept / Reject controller)
    const handleEvaluateCandidateApplication = async (appId, targetStatusState) => {
        setActionLoading(appId);
        try {
            const verificationToken = localStorage.getItem('token') || localStorage.getItem('authToken');

            const response = await axios.patch(`${API_URL}/jobs/applications/${appId}/status`,
                { status: targetStatusState },
                { headers: { Authorization: `Bearer ${verificationToken}` } }
            );

            if (response.status === 200) {
                // Mutate local matrix collection instantly to guarantee structural view integrity
                setIncomingApplications(prev =>
                    prev.map(app => app._id === appId ? { ...app, status: targetStatusState } : app)
                );

                if (selectedApplicationDetails?._id === appId) {
                    setSelectedApplicationDetails(prev => ({ ...prev, status: targetStatusState }));
                }
            }
        } catch (err) {
            console.error("Server execution rejected status change instruction:", err);
            alert("Database write error encountered modifying status evaluation flags.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleInspectCandidatePackage = (applicationObj) => {
        setSelectedApplicationDetails(applicationObj);
        setIsInspectorModalOpen(true);
    };

    const handleGlobalSessionTeardown = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '#login';
        window.location.reload();
    };

    // Perform highly complex compound caching evaluations for data charts filters
    const processedApplicationsRegistry = useMemo(() => {
        return incomingApplications.filter(app => {
            const matchesFilter = appFilter === 'All' || app.status === appFilter || (!app.status && appFilter === 'Pending');
            const candidateText = (app.jobId?.title || '').toLowerCase();
            const coverText = (app.coverLetter || '').toLowerCase();
            const searchMatch = candidateText.includes(searchQuery.toLowerCase()) || coverText.includes(searchQuery.toLowerCase());
            return matchesFilter && searchMatch;
        });
    }, [incomingApplications, appFilter, searchQuery]);

    // Derived metric data calculation counters
    const dashboardMetricsSummary = useMemo(() => {
        const totalPostings = postedJobs.length;
        const totalApps = incomingApplications.length;
        const pendingReviews = incomingApplications.filter(a => !a.status || a.status === 'Pending').length;
        const processedApps = totalApps - pendingReviews;
        return { totalPostings, totalApps, pendingReviews, processedApps };
    }, [postedJobs, incomingApplications]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-black text-slate-400 tracking-wider uppercase">Loading Corporate Console Clusters...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 relative font-sans antialiased selection:bg-indigo-500 selection:text-white">

            {/* COMPREHENSIVE BRAND LAYOUT HEADER CONTROL ROW */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                            <span className="text-white font-black text-sm">Hi</span>
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-base uppercase tracking-wide">HiPro Corporate Terminal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 text-xs font-bold text-slate-500 space-x-1">
                            <button onClick={() => setActiveSection('overview')} className={`px-4 py-1.5 rounded-lg transition ${activeSection === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}>Dashboard Hub</button>
                            <button onClick={() => setActiveSection('publish')} className={`px-4 py-1.5 rounded-lg transition ${activeSection === 'publish' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}>Broadcaster</button>
                            <button onClick={() => setActiveSection('pipeline')} className={`px-4 py-1.5 rounded-lg transition ${activeSection === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}>Evaluation Pipeline</button>
                        </nav>
                        <button
                            onClick={handleGlobalSessionTeardown}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-black px-4 py-2 rounded-xl transition duration-150 text-xs shadow-sm"
                        >
                            De-authorize Terminal
                        </button>
                    </div>
                </div>
            </header>

            {/* FLUID METRIC MONITOR DATA CHART TILES */}
            <section className="bg-slate-900 text-white px-6 py-12 md:px-12 md:py-16 shadow-inner">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20">
                                Management Control Plane
                            </span>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight mt-3">Corporate Overview Analytics</h1>
                        </div>
                        <div className="flex md:hidden bg-slate-800/60 p-1 rounded-xl border border-slate-700/40 text-[11px] font-bold text-slate-400">
                            <button onClick={() => setActiveSection('overview')} className={`px-3 py-1.5 rounded-lg ${activeSection === 'overview' ? 'bg-indigo-600 text-white' : ''}`}>Hub</button>
                            <button onClick={() => setActiveSection('publish')} className={`px-3 py-1.5 rounded-lg ${activeSection === 'publish' ? 'bg-indigo-600 text-white' : ''}`}>Publish</button>
                            <button onClick={() => setActiveSection('pipeline')} className={`px-3 py-1.5 rounded-lg ${activeSection === 'pipeline' ? 'bg-indigo-600 text-white' : ''}`}>Pipeline</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Open Positions</p>
                            <p className="text-2xl font-black text-white mt-1 tracking-tight">{dashboardMetricsSummary.totalPostings}</p>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Candidate Dossiers Lodged</p>
                            <p className="text-2xl font-black text-white mt-1 tracking-tight">{dashboardMetricsSummary.totalApps}</p>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
                            <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Pending Evaluation Review</p>
                            <p className="text-2xl font-black text-amber-400 mt-1 tracking-tight">{dashboardMetricsSummary.pendingReviews}</p>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
                            <p className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Processed Applications</p>
                            <p className="text-2xl font-black text-emerald-400 mt-1 tracking-tight">{dashboardMetricsSummary.processedApps}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRIMARY WORKSPACE MONITOR DISPLAY MAPPING SEGMENTS */}
            <main className="max-w-7xl mx-auto p-6 md:p-12">

                {activeSection === 'overview' && (
                    /* PANEL 1: DASHBOARD HUB CORE LISTINGS INDEX */
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Broadcast Inventory Index</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Live structural database configuration list currently deployed to student screens.</p>
                            </div>

                            {postedJobs.length === 0 ? (
                                <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No active job listings initialized inside system caches.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {postedJobs.map((job) => (
                                        <div key={job._id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 hover:bg-white transition duration-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-black text-slate-800 text-sm tracking-tight leading-tight">{job.title}</h4>
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0">{job.type}</span>
                                                </div>
                                                <p className="text-xs font-bold text-indigo-600 mt-1">{job.company}</p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-3 flex items-center gap-1">
                                                    <span>📍</span> {job.location || 'Global/Remote'}
                                                </p>
                                            </div>
                                            {job.salary && <div className="text-xs font-black text-slate-700 bg-white border border-slate-100 px-2.5 py-1 rounded-xl w-fit mt-4">₹ {job.salary}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'publish' && (
                    /* PANEL 2: BROADCASTER FORM SUBMISSION TERMINAL SECTION */
                    <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate-scaleUp">
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Position Listing Broadcaster</h2>
                            <p className="text-xs text-slate-400 font-medium mt-1">Compile structured position metadata arrays to broadcast outward live.</p>
                        </div>

                        {formMessage.text && (
                            <div className={`mb-5 px-4 py-3 rounded-xl text-xs font-bold ${formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                {formMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePublishJobPosting} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Corporate Position Title *</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Software Developer" className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition shadow-inner" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Company Entity Identifier *</label>
                                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Google" className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition shadow-inner" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Geographic Location Area *</label>
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Chennai, India" className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition shadow-inner" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Annual Salary Remuneration Range (₹)</label>
                                    <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g., 12,000,000" className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition shadow-inner" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Placement Classification Group Type</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none transition">
                                    <option value="Full-Time">Full-Time Operational Placement</option>
                                    <option value="Part-Time">Part-Time Operational Classification</option>
                                    <option value="Internship">Internship Practical Training Track</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Role Specifications / Scope Description</label>
                                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Outline baseline responsibilities mapping to the target role layout..." className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none resize-none transition shadow-inner" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Core Pre-requisite Requirements Ledger</label>
                                <textarea rows="2" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="List key languages, tools or framework metrics expected (e.g. React, Node.js)..." className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none resize-none transition shadow-inner" />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-4 rounded-xl transition text-xs tracking-wide uppercase tracking-wider shadow-md shadow-indigo-100 pt-3.5">
                                Deploy Position Structure Over Board
                            </button>
                        </form>
                    </div>
                )}

                {activeSection === 'pipeline' && (
                    /* PANEL 3: CANDIDATE PIPELINE DATATABLE MATRIX SYSTEM OVERVIEW */
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate-fadeIn">

                        {/* Interactive Data Filter Control Row */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 pb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Candidate Portfolio Evaluation Pipelines</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Filter incoming binary attachment matrices and adjust selection logs.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search portfolios..."
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-indigo-500 text-slate-800 shrink shadow-inner"
                                />
                                <select
                                    value={appFilter}
                                    onChange={(e) => setAppFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold outline-none text-slate-600 cursor-pointer"
                                >
                                    <option value="All">All Pipelines</option>
                                    <option value="Pending">Pending Records Only</option>
                                    <option value="Accepted">Accepted Registers Only</option>
                                    <option value="Rejected">Rejected Registers Only</option>
                                </select>
                            </div>
                        </div>

                        {processedApplicationsRegistry.length === 0 ? (
                            <div className="p-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No candidate records fit the active query parameters filter ledger.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                            <th className="p-4 pl-6">Target Corporate Position</th>
                                            <th className="p-4">Cover Introduction Matrix</th>
                                            <th className="p-4">Candidate Document Link</th>
                                            <th className="p-4 text-center">Status Index</th>
                                            <th className="p-4 pr-6 text-center">Administrative Control Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                                        {processedApplicationsRegistry.map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/20 transition-all duration-150">
                                                <td className="p-4 pl-6">
                                                    <p className="font-black text-slate-800 text-sm leading-tight">{app.jobId?.title || "Archived Corporate Position"}</p>
                                                    <p className="text-[10px] font-extrabold text-indigo-600 mt-0.5 uppercase tracking-wider">{app.jobId?.company || "N/A Group"}</p>
                                                </td>
                                                <td className="p-4 max-w-xs">
                                                    <p className="truncate font-medium text-slate-500 italic">
                                                        {app.coverLetter ? `"${app.coverLetter}"` : <span className="text-slate-300 not-italic">No statement attached</span>}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    {app.resumeUrl ? (
                                                        // CRITICAL RESUME EMBED URL: Maps cleanly directly using your operational backend location formats
                                                        <a
                                                            href={`${API_URL.replace('/api', '')}/${app.resumeUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-800 font-black text-[11px] uppercase tracking-wide underline inline-flex items-center gap-0.5"
                                                        >
                                                            📄 Render File URL Link
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-300 italic font-normal">Payload Empty</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                                                        ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : ''}
                                                        ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : ''}
                                                        ${app.status === 'Pending' || !app.status ? 'bg-amber-50 text-amber-700 border-amber-200/50' : ''}
                                                    `}>
                                                        {app.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleInspectCandidatePackage(app)}
                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition"
                                                        >
                                                            Inspect
                                                        </button>
                                                        {(!app.status || app.status === 'Pending') && (
                                                            <>
                                                                <button
                                                                    disabled={actionLoading === app._id}
                                                                    onClick={() => handleEvaluateCandidateApplication(app._id, 'Accepted')}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    disabled={actionLoading === app._id}
                                                                    onClick={() => handleEvaluateCandidateApplication(app._id, 'Rejected')}
                                                                    className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* EXPANDED CANDIDATE PACKAGE DETAILED INSPECTOR DIALOG OVERLAY SCREEN */}
            {isInspectorModalOpen && selectedApplicationDetails && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl w-full max-w-lg animate-scaleUp">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                            <div>
                                <h3 className="text-base font-black text-slate-900 tracking-tight">Full Application Analysis</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Candidate Tracking Token ID: {selectedApplicationDetails._id}</p>
                            </div>
                            <button onClick={() => setIsInspectorModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-black text-sm p-1">✕</button>
                        </div>

                        <div className="space-y-4 text-xs font-semibold text-slate-700">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Target Corporate Opening</p>
                                <p className="text-sm font-black text-slate-900">{selectedApplicationDetails.jobId?.title || 'N/A'}</p>
                                <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{selectedApplicationDetails.jobId?.company || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Candidate Cover Statement</p>
                                <p className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 font-medium text-slate-600 italic leading-relaxed">
                                    {selectedApplicationDetails.coverLetter ? `"${selectedApplicationDetails.coverLetter}"` : "No description text logs supplied by student operator."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pipeline Evaluation Status</p>
                                    <span className={`inline-flex mt-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                                        ${selectedApplicationDetails.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : ''}
                                        ${selectedApplicationDetails.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : ''}
                                        ${selectedApplicationDetails.status === 'Pending' || !selectedApplicationDetails.status ? 'bg-amber-50 text-amber-700 border-amber-200/50' : ''}
                                    `}>
                                        {selectedApplicationDetails.status || 'Pending'}
                                    </span>
                                </div>

                                {selectedApplicationDetails.resumeUrl && (
                                    <a
                                        href={`${API_URL.replace('/api', '')}/${selectedApplicationDetails.resumeUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-xl font-black uppercase tracking-wider text-[11px] transition shadow-sm"
                                    >
                                        📄 Open Resume File
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Inline Modal Control Updates Action Row */}
                        {(!selectedApplicationDetails.status || selectedApplicationDetails.status === 'Pending') && (
                            <div className="mt-8 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                                <button
                                    disabled={actionLoading === selectedApplicationDetails._id}
                                    onClick={() => handleEvaluateCandidateApplication(selectedApplicationDetails._id, 'Accepted')}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                                >
                                    Approve Candidate
                                </button>
                                <button
                                    disabled={actionLoading === selectedApplicationDetails._id}
                                    onClick={() => handleEvaluateCandidateApplication(selectedApplicationDetails._id, 'Rejected')}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                                >
                                    Decline Candidate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;