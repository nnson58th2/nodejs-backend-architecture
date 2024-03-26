'use strict';

const { AuthFailureError } = require('../core/error.response');
const roleMiddleware = require('./role.middleware');
const rbacService = require('../services/rbac.service');

/**
 *
 * @param {String} action // read, delete or update - readAny, deleteAny, updateAny | readOwn, deleteOwn, updateOwn
 * @param {String} resource // profile, balance
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            roleMiddleware.setGrants(
                await rbacService.roleList({
                    userId: 9999,
                })
            );

            const roleName = req.query.role;
            const permission = roleMiddleware.can(roleName)[action](resource);
            if (!permission.granted) throw new AuthFailureError(`You don't have enough permissions!`);

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    grantAccess,
};
