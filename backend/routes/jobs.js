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
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No resume file received by the server. Check form-data." });
        }

        const { jobId, coverLetter } = req.body;

        // 1. Safely extract the applicant's ID from the JWT token
        let applicantId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.decode(token);
                applicantId = decoded?.id || decoded?.userId || decoded?._id || decoded?.studentId;
            } catch (tokenErr) {
                console.error("Token decode warning:", tokenErr);
            }
        }

        // 2. Map all possible ID fields to satisfy your specific Mongoose Schema
        const applicationData = {
            jobId,
            coverLetter,
            resumeUrl: req.file.path.replace(/\\/g, "/")
        };

        if (applicantId) {
            applicationData.applicantId = applicantId;
            applicationData.studentId = applicantId;
            applicationData.userId = applicantId;
        }

        // 3. Save to database
        const newApplication = new Application(applicationData);
        await newApplication.save();

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
        console.error("DATABASE_SAVE_ERROR:", err);
        // 4. Return the EXACT error message so the frontend never guesses "5MB" again
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