import express from 'express';
// Fixed the exact case layout to match your lowercase filename: job.js
import Job from '../models/job.js';

const router = express.Router();

// Ground truth route: Matches both `/` and `/create` to ensure the frontend never fails
router.post(['/', '/create'], async (req, res) => {
    try {
        const { title, company, location, salary, type } = req.body;

        const newJob = new Job({
            title,
            company,
            location,
            salary,
            type
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error("Database operation failed inside job router:", err);
        res.status(500).json({ error: "Failed to store record configuration." });
    }
});

// Route to fetch application lists
router.get('/applications', async (req, res) => {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;