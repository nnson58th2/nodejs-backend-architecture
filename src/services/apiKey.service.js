'use strict';

const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
};

module.exports = {
    findById,
};
