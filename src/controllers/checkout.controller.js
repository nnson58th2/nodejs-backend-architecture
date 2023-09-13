'use strict';

const { OK } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CheckoutService.checkoutReview(payload);

        new OK({
            message: 'Review checkout successfully!',
            metadata: result,
        }).send(res);
    };

    pay = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CheckoutService.pay(payload);

        new OK({
            message: 'Order payment successful!',
            metadata: result,
        }).send(res);
    };
}

module.exports = new CheckoutController();
