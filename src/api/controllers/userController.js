const { validationResult } = require('express-validator');
const userService = require('../services/userService');

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, message: "Request body incomplete, both email and password are required" });
    }

    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json({ message: "User created" });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: true, message: "User already exists" });
        }
        res.status(400).json({ error: true, message: error.message });
    }
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, message: "Request body incomplete, both email and password are required" });
    }

    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(401).json({ error: true, message: 'User not found' });
        }
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: true, message: "Incorrect email or password" });
        }
        res.status(400).json({ error: true, message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const profile = await userService.getUserProfile(req.params.email, req.user, req.isAuthenticated); // Assumes req.user is populated by authenticate middleware
        res.status(200).json(profile);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: true, message: "User not found" });
        } else {
            res.status(400).json({ error: true, message: error.message });
        }
    }
};

const updateUserProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, message: errors.array()[0].msg });
    }

    if (req.params.email !== req.user.email) {
        return res.status(403).json({ error: true, message: 'Forbidden' });
    }

    try {
        const updateProfile = await userService.updateUserProfile(req.params.email, req.body, req.user);
        if (updateProfile===null) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        res.status(200).json(updateProfile);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};