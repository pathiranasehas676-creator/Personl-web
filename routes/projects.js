const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET /api/projects - Fetch all projects for the portfolio
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        console.error('Projects API Error:', err);
        res.status(500).json({ success: false, error: 'Server error retrieving projects.' });
    }
});

// POST /api/projects - Add a new project (Will be protected by Admin Auth later)
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        console.error('Create Project Error:', err);
        res.status(500).json({ success: false, error: 'Server error creating project.' });
    }
});

module.exports = router;
