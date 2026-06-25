require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
const Job = require('./models/job');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 10000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(async () => {
        console.log('✅ Connected to HiPro Database!');

        // Auto-seed if empty
        const count = await Job.countDocuments();
        if (count === 0) {
            await Job.create({
                title: "Software Engineer",
                company: "St. Joseph's Tech",
                location: "Chennai",
                salary: "8 LPA",
                description: "Initial seed job."
            });
        }
    })
    .catch(err => console.error('❌ DB Error:', err.message));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));