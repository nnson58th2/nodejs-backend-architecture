'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.use(authentication);

router.get('/', asyncHandler(commentController.getCommentsByParentId));

router.post('/', asyncHandler(commentController.createComment));

module.exports = router;
