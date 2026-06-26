import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = (props) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [file, setFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch jobs directly from your working backend endpoint
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

        // Dynamically extract student ID passing down from App session context or fallback to storage
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
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white py-12 px-6 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Find Your Next Horizon</h1>
                    <p className="mt-2 text-indigo-200 text-sm max-w-xl">
                        Browse active job listings, upload your professional profile details, and track application responses seamlessly.
                    </p>
                    <div className="mt-6 max-w-md">
                        <input
                            type="text"
                            placeholder="Search positions, technologies, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Main Listing View */}
            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all group duration-300">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                        {job.type || "Full-Time"}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">{job.location || "Remote"}</span>
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {job.title}
                                </h3>
                                <p className="text-sm font-semibold text-slate-500">{job.company}</p>
                                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                    {job.description || "No supplemental details provided for this active listing."}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="mt-6 w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-slate-900/10"
                            >
                                Apply For Position
                            </button>
                        </div>
                    ))}
                </div>

                {/* Application Overlay Drawer / Modal System */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-slate-800 text-base">Application Gateway</h2>
                                    <p className="text-xs text-slate-400 font-medium">{selectedJob.title} — {selectedJob.company}</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedJob(null); setFile(null); }}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Upload Professional Resume
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 text-center transition-colors relative bg-slate-50/50">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        <p className="text-xs text-slate-600 font-medium">
                                            {file ? `✅ Selected: ${file.name}` : "Drag and drop your file here, or browse local paths"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOC, DOCX files up to 10MB</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Cover Letter Statement
                                    </label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Outline your background skill sets and technical competencies..."
                                        className="w-full border border-slate-200 text-xs p-3 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30"
                                    />
                                </div>
                                <div className="pt-2 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedJob(null); setFile(null); }}
                                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Transmitting Profile Data..." : "Submit Profile Application"}
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