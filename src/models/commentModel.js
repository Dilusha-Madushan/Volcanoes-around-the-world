const db = require('../config/db');

// Create a new comment in the database
const createComment = (commentData) => {
    return db('comments').insert(commentData).then(ids => ({ id: ids[0], ...commentData }));
};

// Retrieve all comments for a specific volcano
const getCommentsByVolcanoId = (volcano_id) => {
    return db('comments')
        .where({ volcano_id })
        .join('users', 'comments.user_id', '=', 'users.id')
        .select('comments.id', 'comment', 'rating', 'created_at', 'users.email as user_email');
};

module.exports = {
    createComment,
    getCommentsByVolcanoId
};
