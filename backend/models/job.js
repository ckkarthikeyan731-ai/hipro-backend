const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String }, // Required for your UI
    salary: { type: String },   // Required for your UI
    posted: { type: String },   // Required for your UI
    verified: { type: Boolean, default: false },
    skills: [String],           // Required for your UI
    benefits: [String]          // Required for your UI
});

module.exports = mongoose.model('Job', jobSchema);