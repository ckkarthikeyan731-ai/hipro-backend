const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    salary: { type: String },
    posted: { type: String },
    verified: { type: Boolean, default: false },
    skills: [String],
    benefits: [String],
}, { timestamps: true }); // <--- Add this line

module.exports = mongoose.model('Job', jobSchema);