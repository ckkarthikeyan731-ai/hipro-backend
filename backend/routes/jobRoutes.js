const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const Application = require('../models/application');

// GET all jobs
router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

// POST new job (Recruiter)
router.post('/add', async (req, res) => {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
});

// POST application (Student)
router.post('/apply', async (req, res) => {
    const { jobId, studentId, resumeUrl } = req.body;
    const application = await Application.create({ jobId, studentId, resumeUrl });
    res.status(201).json(application);
});

// GET applications (Recruiter)
router.get('/applications', async (req, res) => {
    const apps = await Application.find().populate('jobId').populate('studentId');
    res.json(apps);
});

// Accept application
router.put('/accept/:id', async (req, res) => {
    const app = await Application.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    res.json(app);
});

module.exports = router;