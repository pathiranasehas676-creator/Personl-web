require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
const contactAPI = require('./routes/contact');
const projectsAPI = require('./routes/projects');
const authAPI = require('./routes/auth');

app.use('/api/contact', contactAPI);
app.use('/api/projects', projectsAPI);
app.use('/api/auth', authAPI);

// Optional: if someone accesses /admin directly, serve an admin UI (if it exists)
// app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});
