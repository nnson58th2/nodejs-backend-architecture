'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

const accessRouter = require('./access');
const productRouter = require('./product');
const discountRouter = require('./discount');
const cartRouter = require('./cart');

// Check apiKey
router.use(apiKey);

// Check permission
router.use(permission('0000'));

router.use('/v1/api/shop', accessRouter);
router.use('/v1/api/product', productRouter);
router.use('/v1/api/discount', discountRouter);
router.use('/v1/api/cart', cartRouter);

module.exports = router;
