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
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    };
}

module.exports = KeyTokenService;
