const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const jwtSecret = "jdfkajsdklfjalkdjf&fakfjasdjf";

router.post("/createuser", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), errors: "Enter valid credentials" });
        }

        const { email, password } = req.body;

        // Check if user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, errors: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        await User.create({
            email,
            password: hashedPassword
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

router.post("/loginuser", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "Invalid email or password" });
        }

        const pwdCompare = await bcrypt.compare(password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Invalid email or password" });
        }

        const data = {
            user: {
                id: userData.id
            }
        }

        const authToken = jwt.sign(data, jwtSecret);

        res.json({ success: true, authToken, email: userData.email });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
