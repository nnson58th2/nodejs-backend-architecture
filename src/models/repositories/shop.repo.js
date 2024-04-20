'use strict';

const { Types } = require('mongoose');

const SHOP_MODEL = require('../shop.model');
const { getSelectData, getUnSelectData, convertToObjectId } = require('../../utils');

const getShopById = async ({ shop_id, select }) => {
    const shop = await SHOP_MODEL.findById(shop_id).select(getUnSelectData(select)).lean().exec();
    return shop;
};

module.exports = {
    getShopById,
};
