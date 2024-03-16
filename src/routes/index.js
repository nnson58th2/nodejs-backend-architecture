'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

const { pushToLogDiscord } = require('../middlewares');

const profileRouter = require('./profile');
const accessRouter = require('./access');
const productRouter = require('./product');
const discountRouter = require('./discount');
const inventoryRouter = require('./inventory');
const cartRouter = require('./cart');
const checkoutRouter = require('./checkout');
const commentRouter = require('./comment');
const notificationRouter = require('./notification');
const uploadRouter = require('./upload');

// Send log to discord
router.use(pushToLogDiscord);

// Check apiKey
router.use(apiKey);

// Check permission
router.use(permission('0000'));

router.use('/v1/api/profile', profileRouter);
router.use('/v1/api/shop', accessRouter);
router.use('/v1/api/product', productRouter);
router.use('/v1/api/discount', discountRouter);
router.use('/v1/api/inventory', inventoryRouter);
router.use('/v1/api/cart', cartRouter);
router.use('/v1/api/checkout', checkoutRouter);
router.use('/v1/api/comment', commentRouter);
router.use('/v1/api/notification', notificationRouter);
router.use('/v1/api/upload', uploadRouter);

module.exports = router;
