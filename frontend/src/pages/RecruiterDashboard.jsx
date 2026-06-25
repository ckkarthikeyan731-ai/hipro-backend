export const RecruiterDashboard = ({ applications }) => (
    <div className="p-8 pt-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-8">Recruiter Portal</h2>
        {applications.map(app => (
            <div key={app._id} className="p-6 mb-4 bg-white border rounded-2xl flex justify-between items-center">
                <div>
                    <p className="font-bold text-lg">{app.jobId?.title}</p>
                    <p className="text-sm text-slate-500">Applicant: {app.studentId?.email}</p>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Accept</button>
            </div>
        ))}
    </div>
);