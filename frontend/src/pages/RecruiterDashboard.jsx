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
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wider uppercase">Compiling Application Indices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Dashboard Heading Architecture */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Applicant Track Intelligence</h1>
                        <p className="text-xs text-slate-400 font-medium mt-1">Review applicant portfolios, change hiring statuses, and manage resumes.</p>
                    </div>
                </div>

                {/* Analytical Counter Matrix Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Evaluated Pool</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{totalCount}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Approved Candidates</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{acceptedCount}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending Decisions</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{pendingCount}</p>
                    </div>
                </div>

                {/* Data Presentation Table Context */}
                {totalCount === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">No applicant file submittals detected within database architecture.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="p-4">Target Role</th>
                                        <th className="p-4">Cover Statement</th>
                                        <th className="p-4">Document File</th>
                                        <th className="p-4">Pipeline Status</th>
                                        <th className="p-4 text-center">Operational Flags</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">
                                                {app.jobId?.title || <span className="text-slate-400 font-normal italic">Archived Listing</span>}
                                            </td>
                                            <td className="p-4 text-slate-500 max-w-xs truncate font-medium">
                                                {app.coverLetter || <span className="text-slate-300 italic font-normal">Omitted</span>}
                                            </td>
                                            <td className="p-4">
                                                <a
                                                    href={`https://hipro-backend.onrender.com/${app.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50/50 px-2.5 py-1 rounded-lg"
                                                >
                                                    View Profile ↗
                                                </a>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : ''}
                                                    ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : ''}
                                                    ${app.status === 'Pending' ? 'bg-amber-50 text-amber-700' : ''}
                                                `}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button
                                                    onClick={() => updateApplicationStatus(app._id, 'Accepted')}
                                                    disabled={app.status === 'Accepted'}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition duration-150 text-[11px] disabled:opacity-30 disabled:pointer-events-none"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                                                    disabled={app.status === 'Rejected'}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl transition duration-150 text-[11px] disabled:opacity-30 disabled:pointer-events-none"
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