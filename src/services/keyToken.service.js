'use strict';

const { Types } = require('mongoose');

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, privateKey, publicKey, refreshToken }) => {
        // Level 0
        // const tokens = await keyTokenModel.create({
        //     user: userId,
        //     privateKey,
        //     publicKey,
        // });

        // Level n
        const filter = { user: userId };
        const update = {
            publicKey,
            privateKey,
            refreshToken,
            refreshTokenUsed: [],
        };
        const option = { upsert: true, new: true };
        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option);

        return tokens ? tokens.publicKey : null;
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    };

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
    };
}

module.exports = KeyTokenService;
