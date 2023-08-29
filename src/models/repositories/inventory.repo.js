'use strict';

const { Types } = require('mongoose');

const inventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
    return await inventoryModel.create({
        inventoryProductId: productId,
        inventoryShopId: shopId,
        inventoryLocation: location,
        inventoryStock: stock,
    });
};

module.exports = {
    insertInventory,
};
