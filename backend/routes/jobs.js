import express from 'express';
import Job from '../models/job.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve active openings.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, company, location, salary, type } = req.body;
        const newJob = new Job({ title, company, location, salary, type });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: 'Failed to publish posting.' });
    }
});

export default router;