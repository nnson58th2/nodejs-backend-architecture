'use strict';

const { BadRequestError } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');

class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location = '17 Phuc Son, P. Vinh Phuoc, TP. Nha Trang, T. Khanh Hoa' }) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError(`Product doesn't exists!`);

        const query = { inventoryShopId: shopId, inventoryShopId: productId };
        const updateSet = {
            $inc: {
                inventoryStock: stock,
            },
            $set: {
                inventoryLocation: location,
            },
        };
        const options = { upsert: true, new: true };
        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;
