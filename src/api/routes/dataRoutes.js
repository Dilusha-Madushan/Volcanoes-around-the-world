const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const dataController = require('../controllers/dataController');
const commentController = require('../controllers/commentController');
const {authenticate, authenticateForPublic} = require('../middleware/authMiddleware');


router.get('/countries', dataController.getCountries);
router.get('/volcanoes/', dataController.getAllVolcanoes);

// Routes that require authentication
function validateNoQueryParams(req, res, next) {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        });
    }
    next();
}

router.get('/volcano/:id', authenticateForPublic, validateNoQueryParams, dataController.getVolcanoById);

const validateVolcanoQuery = [
    check('id').isNumeric().withMessage('ID must be a numeric value'),
    check('distance').optional().isNumeric().withMessage('Distance must be a numeric value'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: true,
                message: errors.array().map(err => err.msg).join('. ')
            });
        }
        next();
    }
];

router.get('/volcanoes/nearby/:id', authenticateForPublic, validateVolcanoQuery, dataController.getNearbyVolcanoesById);

router.post('/volcano/:id/comments', authenticate, [
    body('comment').not().isEmpty().withMessage('Request body incomplete: Comment text is required.'),
    body('rating')
        .not().isEmpty().withMessage('Request body incomplete: Rating is required.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5')
], commentController.postComment);


router.get('/volcano/:id/comments', authenticate, commentController.getCommentsForVolcano);

module.exports = router;