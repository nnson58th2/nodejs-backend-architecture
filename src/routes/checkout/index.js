'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const checkoutController = require('../../controllers/checkout.controller');

const router = express.Router();

router.use(authentication);

router.post('/review', asyncHandler(checkoutController.checkoutReview));

router.post('/pay', asyncHandler(checkoutController.pay));

module.exports = router;
