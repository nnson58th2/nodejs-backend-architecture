'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { BadRequestError } = require('../core/error.response');
const { getInfoData } = require('../utils');
const { createTokenPair } = require('../auth/authUtils');

const shopModel = require('../models/shop.model');

const KeyTokenService = require('./keyToken.service');

const ROLE_SHOP = {
    ADMIN: 'ADMIN',
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        // Check email exists??
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Shop already registered!');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [ROLE_SHOP.SHOP],
        });
        if (!newShop) {
            throw new BadRequestError('Shop creation failed!');
        }

        // Created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const userId = newShop._id;
        const keyStore = await KeyTokenService.createKeyToken({ userId, privateKey, publicKey });
        if (!keyStore) {
            throw new BadRequestError('Key store error!');
        }

        // Created token pair
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
        console.log(`Created Token Success:: `, tokens);

        return {
            code: 201,
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email', 'createdAt'], object: newShop }),
                tokens,
            },
            message: 'Successfully created',
            status: 'success',
        };
    };
}

module.exports = AccessService;
