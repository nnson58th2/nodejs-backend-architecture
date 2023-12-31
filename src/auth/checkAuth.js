'use strict';

const { findById } = require('../services/apiKey.service');

const { HEADER } = require('./constants');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden Error',
                status: 'error',
            });
        }

        // Check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden Error',
                status: 'error',
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {
        next(error);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                code: 403,
                message: 'Permission Denied',
                status: 'error',
            });
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                code: 403,
                message: 'Permission Denied',
                status: 'error',
            });
        }
        return next();
    };
};

module.exports = {
    apiKey,
    permission,
};
