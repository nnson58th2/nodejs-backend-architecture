'use strict';

const JWT = require('jsonwebtoken');

const { AuthFailureError, NotFoundRequestError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const { HEADER } = require('./constants');

const { findByUserId } = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        // Refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        // Verify token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`Error verify:: `, err);
            } else {
                console.log(`Decode verify:: `, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 - Check userId missing??
     * 2 - Get accessToken
     * 3 - Verify token
     * 4 - Check user in bds?
     * 5 - Check keyStore with this userId?
     * 6 - Oke all -> return next()
     */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request!');

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundRequestError('Not found key store!');

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User!');

            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request!');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User!');

        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
};
