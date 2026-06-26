import express from 'express';
import Job from '../models/job.js';
// Assuming your application schema model is named application.js inside models
import Application from '../models/application.js';

const router = express.Router();

// 1. GET ALL PUBLIC JOBS
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Critical failure fetching master job list records:", err);
        res.status(500).json({ error: "Failed to compile available openings metrics." });
    }
});

// 2. CREATE A NEW JOB POSTING
router.post(['/', '/create'], async (req, res) => {
    try {
        const { title, company, location, salary, type } = req.body;
        const newJob = new Job({ title, company, location, salary, type });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error("Database operation failed inside job router:", err);
        res.status(500).json({ error: "Failed to store record configuration." });
    }
});

// 3. GET STUDENT APPLICATIONS BACKLOG
router.get('/my-applications', async (req, res) => {
    try {
        // Enforce pulling from live collections using populated references
        const applications = await Application.find().populate('jobId');
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. CRITICAL FIX: GET RECRUITER INCOMING APPLICATIONS LIST
router.get('/applications', async (req, res) => {
    try {
        // Fetches every submitted application and populates the linked job details
        const incomingApps = await Application.find().populate('jobId').sort({ createdAt: -1 });
        res.status(200).json(incomingApps);
    } catch (err) {
        console.error("Failed to compile recruiter incoming application streams:", err);
        res.status(500).json({ error: "Failed to fetch master application datasets." });
    }
});

// 5. CRITICAL FIX: UPDATE APPLICATION STATUS (Accept/Reject Core Engine)
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expected: 'Accepted' or 'Rejected'

        if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ error: "Invalid status state flag provided." });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('jobId');

        if (!updatedApplication) {
            return res.status(404).json({ error: "Target application record not found." });
        }

        // Bypassing active email triggers since it takes a separate SMTP microservice path, 
        // but database states update live here instantly!
        res.status(200).json(updatedApplication);
    } catch (err) {
        console.error("Failed to alter application state flag matrix:", err);
        res.status(500).json({ error: "Internal transaction failure updating status." });
    }
});

export default router;