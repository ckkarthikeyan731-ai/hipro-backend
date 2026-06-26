import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String
    },
    type: {
        type: String,
        default: 'Full-time'
    }
}, { timestamps: true });

// Export the mongoose compiled schema model definition cleanly
export default mongoose.model('Job', JobSchema);