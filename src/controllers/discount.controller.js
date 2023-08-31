'use strict';

const { CREATED, OK } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        const payload = {
            ...req.body,
            shopId: req.user.userId,
        };

        const result = await DiscountService.createDiscountCode(payload);

        new CREATED({
            message: 'Successfully code generations',
            metadata: result,
        }).send(res);
    };

    getAllDiscountCodesByShop = async (req, res, next) => {
        const payload = {
            ...req.query,
            shopId: req.user.userId,
        };

        const results = await DiscountService.getAllDiscountCodesByShop(payload);

        new OK({
            message: 'Successfully code found',
            metadata: results,
        }).send(res);
    };

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        const payload = {
            ...req.query,
        };

        const results = await DiscountService.getAllDiscountCodeWithProduct(payload);

        new OK({
            message: 'Successfully code found',
            metadata: results,
        }).send(res);
    };

    getDiscountAmount = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await DiscountService.getDiscountAmount(payload);

        new OK({
            message: 'Successfully discount amount',
            metadata: result,
        }).send(res);
    };
}

module.exports = new DiscountController();
