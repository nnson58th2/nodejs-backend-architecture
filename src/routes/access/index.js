'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const accessController = require('../../controllers/access.controller');

const router = express.Router();

router.post('/sign-up', asyncHandler(accessController.signUp));

router.post('/sign-in', asyncHandler(accessController.signIn));

router.use(authentication);

router.post('/sign-out', asyncHandler(accessController.signOut));

router.post('/refresh-token', asyncHandler(accessController.refreshToken));

module.exports = router;
