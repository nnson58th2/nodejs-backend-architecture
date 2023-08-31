'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const discountController = require('../../controllers/discount.controller');

const router = express.Router();

router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

router.post('/amount', asyncHandler(discountController.getDiscountAmount));

router.use(authentication);

router.get('/discount', asyncHandler(discountController.getAllDiscountCodesByShop));

router.post('/', asyncHandler(discountController.createDiscountCode));

module.exports = router;
