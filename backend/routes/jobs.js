import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Job from '../models/job.js';
import Application from '../models/application.js';

const router = express.Router();

// Robust Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- ROUTE: GET ALL JOBS ---
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// --- ROUTE: CREATE JOB ---
router.post('/create', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: "Creation failed" });
    }
});

// --- ROUTE: APPLY (The File Boundary Fix) ---
// Note: We use .single('resume') to match your frontend append key
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided or invalid form-data" });
        }

        const { jobId, coverLetter } = req.body;
        const newApplication = new Application({
            jobId,
            coverLetter,
            resumeUrl: req.file.path.replace(/\\/g, "/")
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Application failed" });
    }
});

// --- ROUTE: TRACKING ---
router.get('/my-applications', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId');
        res.status(200).json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTE: RECRUITER VIEW ---
router.get('/applications', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId');
        res.status(200).json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTE: STATUS UPDATE ---
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(app);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;