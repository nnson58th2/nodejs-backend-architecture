'use strict';

const { CREATED, OK } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
    createComment = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CommentService.createComment(payload);

        new CREATED({
            message: 'Created comment successfully',
            metadata: result,
        }).send(res);
    };

    getCommentsByParentId = async (req, res, next) => {
        const payload = {
            ...req.query,
        };

        const result = await CommentService.getCommentsByParentId(payload);

        new OK({
            message: 'Get a list of comments for a successful product',
            metadata: result,
        }).send(res);
    };
}

module.exports = new CommentController();
