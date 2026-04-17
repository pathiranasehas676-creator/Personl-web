const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// POST /api/contact - Submit a new contact form message
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        // 2. Save to Database
        const newMessage = await Message.create({
            name,
            email,
            message
        });

        // 3. Optional: Send Email alert (wrapped in try-catch to not fail the whole request if email fails)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: `New Portfolio Message from ${name}`,
                    text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                });
            }
        } catch (emailErr) {
            console.error('Nodemailer Error. Message saved to DB, but email failed:', emailErr);
        }

        res.status(201).json({ success: true, data: newMessage, msg: 'Message sent successfully!' });
    } catch (err) {
        console.error('Contact API Error:', err);
        res.status(500).json({ success: false, error: 'Server error processing your request.' });
    }
});

module.exports = router;
