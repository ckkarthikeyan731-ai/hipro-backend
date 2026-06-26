import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = (props) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [file, setFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch jobs directly from your production backend architecture
    useEffect(() => {
        const fetchAvailableJobs = async () => {
            try {
                const response = await axios.get('https://hipro-backend.onrender.com/api/jobs');
                setJobs(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error retrieving job index:", err);
            }
        };
        fetchAvailableJobs();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a valid resume document to upload.");

        setIsSubmitting(true);
        const dataPayload = new FormData();
        dataPayload.append('resume', file);
        dataPayload.append('coverLetter', coverLetter);

        // Dynamically parse student ID from props tracking or fallback context safely
        const dynamicStudentId = props.sessionUser?.id || props.sessionUser?._id || localStorage.getItem('userId') || '';
        dataPayload.append('studentId', dynamicStudentId);

        try {
            await axios.post(`https://hipro-backend.onrender.com/api/jobs/${selectedJob._id}/apply`, dataPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Application submitted successfully to our database platform.");
            setFile(null);
            setCoverLetter('');
            setSelectedJob(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error transmitting application parameters.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Branding Premium Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-14 px-6 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-md mb-4 uppercase tracking-widest">
                        Talent Ecosystem
                    </span>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">Find Your Next Horizon</h1>
                    <p className="mt-2 text-indigo-200/80 text-sm max-w-xl leading-relaxed">
                        Browse real-time global opportunities, submit your verified professional metrics, and track evaluation cycles seamlessly.
                    </p>
                    <div className="mt-8 max-w-md relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-indigo-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search active roles, companies, or stacks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 backdrop-blur-md transition-all text-sm shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Main Listing View Grid */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {filteredJobs.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-lg mx-auto mt-6">
                        <svg className="mx-auto text-slate-300 w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm font-bold text-slate-800">No Matched Records Found</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Try modifying your search keywords or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-200/60 transition-all group duration-300 relative overflow-hidden">
                                <div>
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 tracking-wide uppercase">
                                            {job.type || "Full-Time"}
                                        </span>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-xs font-semibold tracking-wide">{job.location || "Remote"}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">
                                        {job.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5">{job.company}</p>
                                    <p className="mt-3 text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                                        {job.description || "No supplemental criteria records published for this role tracking catalog entry."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(job)}
                                    className="mt-6 w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm"
                                >
                                    Apply For Position
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Overlaid Animated Focus Application Drawer Gateway */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 scale-100">
                            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="font-black text-slate-900 text-base tracking-tight">Application Gateway</h2>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedJob.title} — <span className="font-bold text-slate-500">{selectedJob.company}</span></p>
                                </div>
                                <button
                                    onClick={() => { setSelectedJob(null); setFile(null); }}
                                    className="text-slate-400 hover:text-slate-700 bg-white border border-slate-100 rounded-full h-7 w-7 flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Upload Professional Resume Document
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-2xl p-5 text-center transition-colors relative group/drop">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        <svg className="mx-auto w-6 h-6 text-slate-400 group-hover/drop:text-indigo-500 transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-xs text-slate-700 font-bold max-w-xs mx-auto truncate">
                                            {file ? `✅ Selected: ${file.name}` : "Drag and drop your file sheet, or click to browse files"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Supports PDF, DOC, or DOCX records up to 10MB</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                                        Cover Letter Statement
                                    </label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Outline your background, qualifications, core skill sets, and tech competencies..."
                                        className="w-full border border-slate-200 text-xs p-3.5 rounded-xl h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/20 placeholder-slate-400 font-medium"
                                    />
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedJob(null); setFile(null); }}
                                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        {isSubmitting ? "Transmitting Profile Portfolio..." : "Submit Application"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;