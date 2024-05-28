const commentModel = require('../../models/commentModel');
const userModel = require('../../models/userModel');

const addComment = async (volcano_id, user_email, comment, rating) => {

    const user = await userModel.getUserIdByEmail(user_email);
    if (!user) throw new Error('User not found');
    const commentData = {
        volcano_id,
        user_id: user.id,
        comment,
        rating,
        created_at: new Date()
    };
    return await commentModel.createComment(commentData);
};

const getCommentsForVolcano = async (volcano_id, requester_email) => {
    const profile = await userModel.findByEmail(requester_email);
    if (!profile) throw new Error('User not found');
    const comments = await commentModel.getCommentsByVolcanoId(volcano_id);
    return comments.map(comment => {
        if (comment.user_email !== requester_email) {
            delete comment.rating; // Remove the rating if emails do not match
        }
        delete comment.user_email; // Remove the user_email from the final response
        return comment;
    });
};

module.exports = {
    addComment,
    getCommentsForVolcano
};