const { validationResult } = require('express-validator');
const commentService = require('../services/commentService');
const volcanoService = require('../services/volcanoService');

const postComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: true, message: "Request body incomplete: Comment and Rating are required."});
        }

        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: true, message: "ID param is required." });
        }

        const referenceVolcano = await volcanoService.getVolcanoById(id, req.isAuthenticated);

        if (!referenceVolcano) {
            return res.status(404).json({ error: true, message: 'Volcano not found.' });
        }

        const { comment, rating } = req.body;

        const newComment = await commentService.addComment(id, req.user.email, comment, rating);
        res.status(201).json("New comment added.");
    } catch (error) {
        if (error.message === 'User not found')
            return res.status(404).json({ error: true, message: "User not found." });
        res.status(400).json({ error: true, message: error.message });
    }
};

const getCommentsForVolcano = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: true, message: "ID param is required." });
        }

        const referenceVolcano = await volcanoService.getVolcanoById(req.params.id, req.isAuthenticated);

        if (!referenceVolcano) {
            return res.status(404).json({ error: true, message: 'Volcano not found.' });
        }

        const comments = await commentService.getCommentsForVolcano(id, req.user.email);
        res.json(comments);
    } catch (error) {
        if (error.message === 'User not found')
            return res.status(404).json({ error: true, message: "User not found." });
        res.status(400).json({ error: true, message: error.message });
    }
};

module.exports = {
    postComment,
    getCommentsForVolcano
};
