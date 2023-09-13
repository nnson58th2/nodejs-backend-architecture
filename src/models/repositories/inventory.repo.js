'use strict';

const { Types } = require('mongoose');
const { convertToObjectId } = require('../../utils');

const inventoryModel = require('../inventory.model');

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
    return await inventoryModel.create({
        inventoryProductId: productId,
        inventoryShopId: shopId,
        inventoryLocation: location,
        inventoryStock: stock,
    });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
            inventoryProductId: convertToObjectId(productId),
            inventoryStock: { $gte: quantity },
        },
        updateSet = {
            $inc: {
                inventoryStock: -quantity,
            },
            $push: {
                inventoryReservation: {
                    quantity,
                    cartId,
                    createdAt: new Date(),
                },
            },
        },
        options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
    insertInventory,
    reservationInventory,
};
