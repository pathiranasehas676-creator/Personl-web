const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tech_stack: {
        type: [String],
        default: []
    },
    github_url: {
        type: String,
        default: '#'
    },
    demo_url: {
        type: String,
        default: '#'
    },
    icon_class: {
        type: String, // e.g., 'fa-solid fa-plane-departure'
        default: 'fa-solid fa-code'
    },
    gradient_class: {
        type: String, // e.g., 'bg-gradient-1'
        default: 'bg-gradient-1'
    },
    badge_text: {
        type: String, // e.g., '1M+ DLs'
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
