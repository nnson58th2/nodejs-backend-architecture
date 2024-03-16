'use strict';

const express = require('express');

const asyncHandler = require('../../helpers/asyncHandler');
const { grantAccess } = require('../../middlewares/rbac');

const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router.get('/view-any', grantAccess('readAny', 'profile'), asyncHandler(profileController.profiles));
router.get('/view-own', grantAccess('readOwn', 'profile'), asyncHandler(profileController.profile));

module.exports = router;
