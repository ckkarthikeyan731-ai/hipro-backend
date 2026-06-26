import express from 'express';
import Job from '../models/job.js';
import Application from '../models/application.js'; // Verified layout mapping for multi-part candidate documents

const router = express.Router();

// 1. GET MASTER INDEX REPOSITORY: Matches GET to "/api/jobs"
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Critical infrastructure error fetching master listings index:", err);
        res.status(500).json({ error: "Failed to compile active openings indices records." });
    }
});

// 2. BROADCAST FRESH ENTRY CONFIGURATIONS: Matches POST to "/api/jobs/create"
router.post(['/', '/create'], async (req, res) => {
    try {
        const { title, company, location, salary, type, description, requirements } = req.body;

        const newJob = new Job({
            title: title?.trim(),
            company: company?.trim(),
            location: location?.trim(),
            salary: salary?.trim(),
            type: type || 'Full-Time',
            description: description?.trim(),
            requirements: requirements?.trim()
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error("Database operation transaction failed inside structural job router:", err);
        res.status(500).json({ error: "Failed to store record configuration layout vectors." });
    }
});

// 3. GET PERSONAL CANDIDATE ACTIVITY LEDGERS: Matches GET to "/api/jobs/my-applications"
router.get('/my-applications', async (req, res) => {
    try {
        // Enforce mapping populated document collections back to the tracking grid arrays
        const applicationsBacklog = await Application.find().populate('jobId').sort({ createdAt: -1 });
        res.status(200).json(applicationsBacklog);
    } catch (err) {
        console.error("Exception compiled tracking candidate historical ledgers:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. GET RECRUITER MONITOR INCOMING INVENTORY FEED: Matches GET to "/api/jobs/applications"
router.get('/applications', async (req, res) => {
    try {
        // Hydrates referenced job structural maps before feeding data arrays back to client view screens
        const recruiterIncomingStreams = await Application.find().populate('jobId').sort({ createdAt: -1 });
        res.status(200).json(recruiterIncomingStreams);
    } catch (err) {
        console.error("Failed to compile recruiter incoming candidate application streams:", err);
        res.status(500).json({ error: "Failed to assemble master pipeline application datasets." });
    }
});

// 5. EVALUATE STATUS INTERACTION CONTROLLER ROUTE: Matches PATCH to "/api/jobs/applications/:id/status"
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expected status flags: 'Accepted' | 'Rejected'

        if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ error: "Invalid pipeline evaluation state flag provided." });
        }

        const updatedApplicationDocument = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('jobId');

        if (!updatedApplicationDocument) {
            return res.status(404).json({ error: "Target student application record not found inside collection pools." });
        }

        // Return the clean mutated document payload back to the client interface matrix
        res.status(200).json(updatedApplicationDocument);
    } catch (err) {
        console.error("Failed to mutate database collection application state flag matrix:", err);
        res.status(500).json({ error: "Internal server transaction failure updating status." });
    }
});

export default router;