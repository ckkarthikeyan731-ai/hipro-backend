import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    appliedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);