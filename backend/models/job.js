import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, default: 'HiPro Partner Corp' },
    location: { type: String, default: 'Chennai, TN' },
    type: { type: String, default: 'Full-time' },
    salary: { type: String, default: 'Competitive Pay' },
    status: { type: String, default: 'Active' },
    applications: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);