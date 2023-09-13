'use strict';

const { OK } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await InventoryService.addStockToInventory(payload);

        new OK({
            message: 'Add stock to inventory successfully!',
            metadata: result,
        }).send(res);
    };
}

module.exports = new InventoryController();
