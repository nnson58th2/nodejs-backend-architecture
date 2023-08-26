'use strict';

const express = require('express');

const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

const productController = require('../../controllers/product.controller');

const router = express.Router();

router.get('/', asyncHandler(productController.getAllProducts));
router.get('/:productId', asyncHandler(productController.getProductById));
router.get('/search', asyncHandler(productController.getListSearchProducts));

router.use(authentication);

router.get('/draft', asyncHandler(productController.getAllDraftsForShop));
router.get('/publish', asyncHandler(productController.getAllPublishForShop));

router.post('/', asyncHandler(productController.createProduct));

router.patch('/publish/:productId', asyncHandler(productController.publishProduct));
router.patch('/un-publish/:productId', asyncHandler(productController.unPublishProduct));

module.exports = router;
