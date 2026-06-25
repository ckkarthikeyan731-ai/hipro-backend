require('dotenv').config(); // Load variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Job = require('./models/job');
const User = require('./models/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const dbUrl = process.env.MONGO_URL; // Using the variable we agreed upon

mongoose.connect(dbUrl)
    .then(async () => {
        console.log('✅ Connected to HiPro Database!');

        // Auto-seed only if empty
        const count = await Job.countDocuments();
        if (count === 0) {
            await Job.create({
                title: "Software Engineer",
                company: "St. Joseph's Tech",
                location: "Chennai",
                salary: "8 LPA",
                description: "Initial seed job."
            });
            console.log("Database seeded with initial job.");
        }
    })
    .catch(err => console.error('❌ DB Error:', err.message));

// --- API Routes ---

// Get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// Register/Login
app.post('/api/auth', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email, password, role });
        }

        // In a real app, verify password here!
        res.status(200).json({ message: "Success", role: user.role });
    } catch (err) {
        res.status(400).json({ error: "Authentication failed" });
    }
});

// Add new job (Recruiter only)
app.post('/api/jobs', async (req, res) => {
    try {
        const newJob = await Job.create(req.body);
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ error: "Could not create job" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));