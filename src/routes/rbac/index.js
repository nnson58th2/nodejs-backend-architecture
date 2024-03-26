'use strict';

const express = require('express');

const asyncHandler = require('../../helpers/asyncHandler');

const rbacController = require('../../controllers/rbac.controller');

const router = express.Router();

router.get('/resources', asyncHandler(rbacController.resourceList));
router.get('/roles', asyncHandler(rbacController.roleList));

router.post('/resources', asyncHandler(rbacController.createResource));
router.post('/roles', asyncHandler(rbacController.createRole));

module.exports = router;
