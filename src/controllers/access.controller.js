'use strict';

const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        const payload = req.body;
        console.log(`[P]::signUp::`, payload);

        const result = await AccessService.signUp(payload);
        return res.status(201).json(result);
    };
}

module.exports = new AccessController();
