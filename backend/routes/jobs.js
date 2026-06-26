import express from 'express';
import multer from 'multer';
import path from 'path';
import Job from '../models/job.js';
import Application from '../models/application.js';

const router = express.Router();

// Configure static disk storage parameters for candidate uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// 1. PUBLIC JOBS INDEX ROUTE
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Failure fetching job logs:", err);
        res.status(500).json({ error: "Failed to fetch openings indices." });
    }
});

// 2. BROADCAST FRESH POSITION CREATOR ROUTE
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
        console.error("Failed to broadcast job:", err);
        res.status(500).json({ error: "Failed to parse position parameters." });
    }
});

// 3. CRITICAL MULTIPART FORM MULTER CAPTURE GATEWAY
// This explicitly binds to the field key 'resume' sent from your student dashboard
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Multipart error: File field key mismatch. Missing document upload body." });
        }

        const newApplication = new Application({
            jobId,
            coverLetter: coverLetter || '',
            resumeUrl: req.file.path.replace(/\\/g, "/") // Enforce clean forward-slashes for Render compatibility
        });

        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        console.error("Multer boundary handling failed:", err);
        res.status(500).json({ error: "Multipart network boundary processing failure inside backend routers." });
    }
});

// 4. HISTORICAL LEDGERS LINK SINK ROUTES
router.get('/my-applications', async (req, res) => {
    try {
        const backlog = await Application.find().populate('jobId').sort({ createdAt: -1 });
        res.status(200).json(backlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/applications', async (req, res) => {
    try {
        const incomingStreams = await Application.find().populate('jobId').sort({ createdAt: -1 });
        res.status(200).json(incomingStreams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Application.findByIdAndUpdate(id, { status }, { new: true }).populate('jobId');
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;