import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecruiterDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncomingApplications = async () => {
            try {
                const response = await axios.get('https://hipro-backend.onrender.com/api/jobs/applications');
                setApplications(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Failed to compile target app matrix:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncomingApplications();
    }, []);

    const updateApplicationStatus = async (id, targetStatus) => {
        try {
            const response = await axios.patch(`https://hipro-backend.onrender.com/api/jobs/applications/${id}/status`, {
                status: targetStatus
            });
            setApplications(prev =>
                prev.map(item => item._id === id ? { ...item, status: response.data.status } : item)
            );
        } catch (err) {
            console.error(err);
            alert("Could not process structural status modification.");
        }
    };

    // Derived Analytic Metric States
    const totalCount = applications.length;
    const acceptedCount = applications.filter(a => a.status === 'Accepted').length;
    const pendingCount = applications.filter(a => a.status === 'Pending').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-slate-400 tracking-wider uppercase">Compiling Application Indices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Dashboard Heading Architecture */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-5 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Applicant Track Intelligence</h1>
                        <p className="text-xs text-slate-400 font-medium mt-1">Review applicant portfolios, track talent pipeline modifications, and audit resumes.</p>
                    </div>
                </div>

                {/* Analytical Counter Matrix Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Evaluated Pool</p>
                            <span className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{totalCount}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] font-extrabold text-emerald-500 uppercase tracking-wider">Approved Candidates</p>
                            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{acceptedCount}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider">Pending Decisions</p>
                            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{pendingCount}</p>
                    </div>
                </div>

                {/* Data Presentation Layout Grid */}
                {totalCount === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-md mx-auto">
                        <svg className="mx-auto text-slate-300 w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="text-sm font-bold text-slate-800">Pipeline Empty</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">No candidate file submissions have been captured in the ledger.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 pl-6">Target Role</th>
                                        <th className="p-4">Cover Statement</th>
                                        <th className="p-4">Document File</th>
                                        <th className="p-4">Pipeline Status</th>
                                        <th className="p-4 pr-6 text-center">Operational Flag Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="p-4 pl-6 font-bold text-slate-800">
                                                {app.jobId?.title || <span className="text-slate-400 font-normal italic">Archived Position</span>}
                                            </td>
                                            <td className="p-4 text-slate-500 max-w-xs truncate font-medium">
                                                {app.coverLetter || <span className="text-slate-300 italic font-normal">Omitted</span>}
                                            </td>
                                            <td className="p-4">
                                                <a
                                                    href={`https://hipro-backend.onrender.com/${app.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50/60 px-3 py-1.5 rounded-xl text-[11px]"
                                                >
                                                    View Resume
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' : ''}
                                                    ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200/40' : ''}
                                                    ${app.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/40' : ''}
                                                `}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-center space-x-2">
                                                <button
                                                    onClick={() => updateApplicationStatus(app._id, 'Accepted')}
                                                    disabled={app.status === 'Accepted'}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition duration-150 text-[11px] disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                                                    disabled={app.status === 'Rejected'}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl transition duration-150 text-[11px] disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;