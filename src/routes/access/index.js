'use strict';

const express = require('express');

const { asyncHandler } = require('../../utils/handler');
const accessController = require('../../controllers/access.controller');

const router = express.Router();

// Sign up
router.post('/shop/sign-up', asyncHandler(accessController.signUp));

module.exports = router;
