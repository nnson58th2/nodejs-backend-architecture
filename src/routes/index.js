'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

const access = require('./access');

// Check apiKey
router.use(apiKey);

// Check permission
router.use(permission('0000'));

router.use('/v1/api', access);

module.exports = router;
