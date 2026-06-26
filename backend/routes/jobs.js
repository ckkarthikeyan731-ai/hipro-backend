import express from 'express';
import multer from 'multer';
import Application from '../models/application.js'; // Correct import path

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- Application Logic integrated here ---

// POST: Student applies for a job
router.post('/:id/apply', upload.single('resume'), async (req, res) => {
    try {
        const { studentId, coverLetter } = req.body;
        const newApp = new Application({
            jobId: req.params.id,
            studentId,
            resumeUrl: req.file.path,
            coverLetter
        });
        await newApp.save();
        res.status(201).json({ message: "Applied successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET: Recruiter fetches all applications
router.get('/applications', async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId');
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH: Recruiter updates application status
router.patch('/applications/:id/status', async (req, res) => {
    try {
        const updatedApp = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updatedApp);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;