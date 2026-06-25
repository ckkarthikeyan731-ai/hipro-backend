export const StudentDashboard = ({ jobs }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 pt-24">
        {jobs.map(job => (
            <div key={job._id} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black">{job.title}</h3>
                <p className="text-blue-600 font-bold mb-4">{job.company}</p>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800">Apply Now</button>
            </div>
        ))}
    </div>
);