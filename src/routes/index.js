'use strict';

const express = require('express');
const router = express.Router();

const access = require('./access');

router.use('/v1/api', access);

module.exports = router;
