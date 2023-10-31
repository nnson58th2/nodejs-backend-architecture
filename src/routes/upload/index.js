'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const uploadController = require('../../controllers/upload.controller');

const router = express.Router();

// router.use(authentication);

router.post('/product', asyncHandler(uploadController.uploadImageFromUrl));

module.exports = router;
