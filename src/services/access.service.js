'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { BadRequestError, AuthFailureError, ForbiddenRequestError } = require('../core/error.response');
const { getInfoData } = require('../utils');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');

const shopModel = require('../models/shop.model');

const KeyTokenService = require('./keyToken.service');
const { findByEmail } = require('./shop.service');

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
            shop: getInfoData({ fields: ['_id', 'name', 'email', 'createdAt'], object: newShop }),
            tokens,
        };
    };

    static signIn = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail(email);
        if (!foundShop) throw new BadRequestError('Incorrect email or password!');

        const matchPassword = await bcrypt.compare(password, foundShop.password);
        if (!matchPassword) throw new AuthFailureError('Incorrect email or password!');

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const userId = foundShop._id;
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email', 'createdAt'], object: foundShop }),
            tokens,
        };
    };

    static signOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };

    static refreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // decode ra xem mày là thằng nào?
            const { userId } = await verifyJWT(refreshToken, foundToken.privateKey);

            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenRequestError('Something went wrong happened! Please re-login.');
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError('Shop not registered!');

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        const foundShop = await findByEmail(email);
        if (!foundShop) throw new AuthFailureError('Shop not registered!');

        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user: { userId, email },
            tokens,
        };
    };

    static refreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;

        const refreshTokensUsed = keyStore.refreshTokensUsed.includes(refreshToken);
        if (refreshTokensUsed) {
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenRequestError('Something went wrong happened! Please re-login.');
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!');

        const foundShop = await findByEmail(email);
        if (!foundShop) throw new AuthFailureError('Shop not registered!');

        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user,
            tokens,
        };
    };
}

module.exports = AccessService;
