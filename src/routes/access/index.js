'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const accessController = require('../../controllers/access.controller');

const router = express.Router();

router.post('/shop/sign-up', asyncHandler(accessController.signUp));

router.post('/shop/sign-in', asyncHandler(accessController.signIn));

router.use(authentication);

router.post('/shop/sign-out', asyncHandler(accessController.signOut));

module.exports = router;
