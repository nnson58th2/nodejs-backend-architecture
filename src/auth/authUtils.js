'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair,
};
