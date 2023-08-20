'use strict';

const { CREATED } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        const payload = req.body;
        console.log(`[P]::signUp::`, payload);

        const result = await AccessService.signUp(payload);
        new CREATED({
            message: 'Registered',
            metadata: result,
        }).send(res);
    };
}

module.exports = new AccessController();
