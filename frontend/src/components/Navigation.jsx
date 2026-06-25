export const Navigation = ({ user, setRole }) => (
    <nav className="fixed w-full z-50 bg-white border-b border-slate-100 py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600">HiPro</h1>
        <div className="flex gap-4">
            {!user ? (
                <>
                    <button onClick={() => setRole('student')} className="font-bold text-slate-600">Student</button>
                    <button onClick={() => setRole('recruiter')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Recruiter</button>
                </>
            ) : <span className="font-bold text-blue-600">Logged in as {user}</span>}
        </div>
    </nav>
);