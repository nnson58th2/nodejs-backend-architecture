'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

const accessRouter = require('./access');
const productRouter = require('./product');

// Check apiKey
router.use(apiKey);

// Check permission
router.use(permission('0000'));

router.use('/v1/api/shop', accessRouter);
router.use('/v1/api/product', productRouter);

module.exports = router;
