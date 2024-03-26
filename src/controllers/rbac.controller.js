'use strict';

const { OK, CREATED } = require('../core/success.response');

const RbacService = require('../services/rbac.service');

const createResource = async (req, res, next) => {
    const result = await RbacService.createResource(req.body);
    new CREATED({
        message: 'Created resource',
        metadata: result,
    }).send(res);
};

const createRole = async (req, res, next) => {
    const result = await RbacService.createRole(req.body);
    new CREATED({
        message: 'Created role',
        metadata: result,
    }).send(res);
};

const resourceList = async (req, res, next) => {
    const result = await RbacService.resourceList(req.query);
    new OK({
        message: 'Get list resources',
        metadata: result,
    }).send(res);
};

const roleList = async (req, res, next) => {
    const result = await RbacService.roleList(req.query);
    new OK({
        message: 'Get list roles',
        metadata: result,
    }).send(res);
};

module.exports = {
    createResource,
    createRole,
    resourceList,
    roleList,
};
