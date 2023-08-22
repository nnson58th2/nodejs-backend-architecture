'use strict';

const { CREATED, OK } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        const payload = req.body;
        console.log(`[P]::signUp::`, payload);

        const result = await AccessService.signUp(payload);
        new CREATED({
            message: 'Registered successfully',
            metadata: result,
        }).send(res);
    };

    signIn = async (req, res, next) => {
        const payload = req.body;

        const result = await AccessService.signIn(payload);
        new OK({
            message: 'Signed successfully',
            metadata: result,
        }).send(res);
    };

    signOut = async (req, res, next) => {
        const result = await AccessService.signOut(req.keyStore);
        new OK({
            message: 'Signed out successfully',
            metadata: result,
        }).send(res);
    };
}

module.exports = new AccessController();
