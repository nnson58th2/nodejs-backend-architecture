'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const cartController = require('../../controllers/cart.controller');

const router = express.Router();

router.use(authentication);

router.get('/', asyncHandler(cartController.getListCart));

router.post('/', asyncHandler(cartController.addToCart));

router.post('/update', asyncHandler(cartController.updateCart));

router.delete('/', asyncHandler(cartController.deleteCartItem));

module.exports = router;
