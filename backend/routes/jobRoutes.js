const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

router.post('/add', async (req, res) => {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
});

module.exports = router;