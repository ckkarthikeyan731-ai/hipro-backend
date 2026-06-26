import express from 'express';
import Job from '../models/job.js'; // Verified lowercase filename matching your disk

const router = express.Router();

// 1. GET ALL JOBS: This matches GET to "/api/jobs" from the Student Dashboard
router.get('/', async (req, res) => {
    try {
        // Fetch all jobs from MongoDB collection and sort by newest first
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Critical failure fetching master job list records:", err);
        res.status(500).json({ error: "Failed to compile available openings metrics." });
    }
});

// 2. CREATE A NEW JOB: Matches POST to "/api/jobs" or "/api/jobs/create" from Recruiter Dashboard
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

// 3. GET STUDENT APPLICATIONS BACKLOG: Matches GET to "/api/jobs/my-applications"
router.get('/my-applications', async (req, res) => {
    try {
        // Returns a clean array placeholder to prevent frontend compilation map crashes
        res.status(200).json([]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET RECRUITER INCOMING APPLICATIONS LIST: Matches GET to "/api/jobs/applications"
router.get('/applications', async (req, res) => {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;