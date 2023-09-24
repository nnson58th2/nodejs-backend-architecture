'user strict';

const { convertToObjectId } = require('../utils');
const { NotFoundRequestError } = require('../core/error.response');

const commentModel = require('../models/comment.model');

/*
    key feature: Comment service
    + add comment [User | Shop]
    + get a list of comment [User | Shop]
    + delete a comment [User | Shop | Admin]
*/
class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {
        const comment = new commentModel({
            commentProductId: productId,
            commentUserId: userId,
            commentContent: content,
            commentParentId: parentCommentId,
        });

        let right = 1;

        // Reply comment
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundRequestError('Parent comment not found!');

            right = parentComment.commentRight;
            // Update many comments
            await commentModel.updateMany(
                {
                    commentProductId: convertToObjectId(productId),
                    commentRight: { $gte: right },
                },
                {
                    $inc: { commentRight: 2 },
                }
            );

            await commentModel.updateMany(
                {
                    commentProductId: convertToObjectId(productId),
                    commentLeft: { $gt: right },
                },
                {
                    $inc: { commentLeft: 2 },
                }
            );
        } else {
            const maximumRight = await commentModel.findOne(
                {
                    commentProductId: convertToObjectId(productId),
                },
                'commentRight',
                { sort: { commentRight: -1 } }
            );

            if (maximumRight) {
                right = maximumRight.commentRight + 1;
            }
        }

        // Insert to comment
        comment.commentLeft = right;
        comment.commentRight = right + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundRequestError('Not found comments for product!');

            const comments = await commentModel
                .find({
                    commentProductId: convertToObjectId(productId),
                    commentLeft: { $gt: parentComment.commentLeft },
                    commentRight: { $lte: parentComment.commentRight },
                })
                .skip(offset)
                .limit(limit)
                .lean()
                .select({
                    commentContent: 1,
                    commentParentId: 1,
                    commentLeft: 1,
                    commentRight: 1,
                })
                .sort({
                    commentLeft: 1,
                })
                .exec();

            return comments;
        }

        const comments = await commentModel
            .find({
                commentProductId: convertToObjectId(productId),
                commentParentId: null,
            })
            .skip(offset)
            .limit(limit)
            .lean()
            .select({
                commentContent: 1,
                commentParentId: 1,
                commentLeft: 1,
                commentRight: 1,
            })
            .sort({
                commentLeft: 1,
            })
            .exec();

        return comments;
    }
}

module.exports = CommentService;
