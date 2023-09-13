'use strict';

const { convertToObjectId } = require('../../utils');
const cartModel = require('../cart.model');

const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: convertToObjectId(cartId), cartState: 'ACTIVE' }).lean();
};

module.exports = {
    findCartById,
};
