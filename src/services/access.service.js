'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
        try {
            // Check email exists??
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 400,
                    metadata: null,
                    message: 'Shop already registered!',
                    status: 'error',
                };
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [ROLE_SHOP.SHOP],
            });
            if (!newShop) {
                return {
                    code: 400,
                    metadata: null,
                    message: 'Shop creation failed!',
                    status: 'error',
                };
            }

            // Created privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const userId = newShop._id;
            const keyStore = await KeyTokenService.createKeyToken({ userId, privateKey, publicKey });
            if (!keyStore) {
                return {
                    code: 400,
                    metadata: null,
                    message: 'Key store error!',
                    status: 'error',
                };
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
        } catch (error) {
            return {
                code: 400,
                metadata: null,
                message: error.message,
                status: 'error',
            };
        }
    };
}

module.exports = AccessService;
