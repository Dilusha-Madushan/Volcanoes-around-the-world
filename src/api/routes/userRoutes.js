const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate, authenticateForPublic} = require('../middleware/authMiddleware');

router.post('/register', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').not().isEmpty().withMessage('Password is required')
], userController.loginUser);

// Get user profile information
router.get('/:email/profile', authenticateForPublic, userController.getUserProfile);

const updateUserValidationRules = [
    body('firstName').not().isEmpty().withMessage('Request body incomplete: firstName, lastName, dob and address are required.'),
    body('lastName').not().isEmpty().withMessage('Request body incomplete: firstName, lastName, dob and address are required.'),
    body('dob').not().isEmpty().withMessage('Request body incomplete: firstName, lastName, dob and address are required.'),
    body('address').not().isEmpty().withMessage('Request body incomplete: firstName, lastName, dob and address are required.'),
    body('firstName').isString().withMessage('Request body invalid: firstName, lastName and address must be strings only.'),
    body('lastName').isString().withMessage('Request body invalid: firstName, lastName and address must be strings only.'),
    body('dob')
        .trim()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Invalid input: dob must be a real date in format YYYY-MM-DD.')
        .custom((value) => {
            const date = new Date(value);
            const [year, month, day] = value.split('-');
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) {
                throw new Error('Invalid input: dob must be a real date in format YYYY-MM-DD.');
            }
            const now = new Date();
            if (date > now) {
                throw new Error('Invalid input: dob must be a date in the past.');
            }
            return true;
        }),
    body('address').isString().withMessage('Request body invalid: firstName, lastName and address must be strings only.')
];


// Update user profile information
router.put('/:email/profile', authenticate, updateUserValidationRules, userController.updateUserProfile);

module.exports = router;
