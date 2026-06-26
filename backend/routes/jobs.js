import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
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
    limits: { fileSize: 5 * 1024 * 1024 }
});

// --- ROUTE: GET ALL JOBS ---
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch jobs: " + err.message });
    }
});

// --- ROUTE: CREATE JOB ---
router.post('/create', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: "Creation failed: " + err.message });
    }
});

// --- ROUTE: APPLY (The Database Validation Fix) ---
// --- ROUTE: APPLY (Final DB ID Fix) ---
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No resume file received." });
        }

        const { jobId, coverLetter } = req.body;
        let applicantId = null;

        // 1. Aggressively extract the ID from the token
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.decode(token);
                // Hunt for every common ID variation used in MERN stacks
                applicantId = decoded?.studentId || decoded?._id || decoded?.id || decoded?.userId || decoded?.user?._id || decoded?.user?.id;
            } catch (tokenErr) {
                console.error("Token decode error:", tokenErr);
            }
        }

        // 2. Force the strict schema validation
        if (!applicantId) {
            return res.status(400).json({
                message: "Database Error: Could not find your User ID in the token. Please log out of the dashboard and log back in."
            });
        }

        // 3. Map all possible ID fields to satisfy Mongoose
        const applicationData = {
            jobId,
            coverLetter,
            resumeUrl: req.file.path.replace(/\\/g, "/"),
            studentId: applicantId,  // THIS SATISFIES YOUR SCHEMA
            applicantId: applicantId,
            userId: applicantId
        };

        const newApplication = new Application(applicationData);
        await newApplication.save();

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
        console.error("DATABASE_SAVE_ERROR:", err);
        res.status(500).json({ message: `Database Error: ${err.message}` });
    }
});
// --- ROUTE: TRACKING ---
router.get('/my-applications', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId');
        res.status(200).json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ROUTE: RECRUITER VIEW ---
router.get('/applications', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId');
        res.status(200).json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ROUTE: STATUS UPDATE ---
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;